package com.otaku.community.feature.manga.service;

import com.otaku.community.common.exception.ConflictException;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.feature.activity.entity.ActivityTargetType;
import com.otaku.community.feature.activity.entity.ActivityType;
import com.otaku.community.feature.activity.event.ActivityEvent;
import com.otaku.community.feature.manga.dto.translation.ReorderPagesRequest;
import com.otaku.community.feature.manga.dto.translation.TranslationDetailResponse;
import com.otaku.community.feature.manga.dto.translation.TranslationPageResponse;
import com.otaku.community.feature.manga.dto.translation.TranslationResponse;
import com.otaku.community.feature.manga.dto.translation.UpdateTranslationRequest;
import com.otaku.community.feature.manga.entity.Translation;
import com.otaku.community.feature.manga.entity.TranslationPage;
import com.otaku.community.feature.manga.entity.UploadJob;
import com.otaku.community.feature.manga.mapper.MangaReaderMapper;
import com.otaku.community.feature.manga.repository.ChapterRepository;
import com.otaku.community.feature.manga.repository.TranslationPageRepository;
import com.otaku.community.feature.manga.repository.TranslationRepository;
import com.otaku.community.feature.manga.repository.UploadJobRepository;
import com.otaku.community.feature.notification.service.NotificationService;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TranslationService {

    private final TranslationRepository translationRepository;
    private final TranslationPageRepository translationPageRepository;
    private final UploadJobRepository uploadJobRepository;
    private final ChapterRepository chapterRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ApplicationEventPublisher eventPublisher;
    private final MangaReaderMapper mapper;

    public List<TranslationResponse> getPublishedTranslations(UUID chapterId) {
        return translationRepository.findPublishedByChapterId(chapterId).stream()
                .map(mapper::toTranslationResponse)
                .toList();
    }

    @Transactional
    public TranslationResponse updateTranslation(UUID translationId, UpdateTranslationRequest request, UUID userId) {
        Translation translation = getTranslationAndVerifyOwnership(translationId, userId);

        if (request.getName() != null) {
            translation.setName(request.getName());
        }
        if (request.getNotes() != null) {
            translation.setNotes(request.getNotes());
        }

        return mapper.toTranslationResponse(translationRepository.save(translation));
    }

    @Transactional
    public TranslationResponse publishTranslation(UUID translationId, UUID userId) {
        Translation translation = getTranslationAndVerifyOwnership(translationId, userId);

        if (translation.getStatus() == Translation.TranslationStatus.PUBLISHED) {
            throw new ConflictException("Translation is already published");
        }

        // Logic check: ensure at least one page existed or something?
        // AC says UploadJob must complete, but we'll check that in UploadJobService or
        // here.

        translation.setStatus(Translation.TranslationStatus.PUBLISHED);
        translation.setPublishedAt(Instant.now());
        Translation saved = translationRepository.save(translation);

        userRepository.updateTotalTranslations(saved.getTranslator().getId(), 1);

        // Notify users
        notificationService.broadcastNewTranslationNotification(
                userId,
                saved.getId(),
                saved.getName());

        // Track activity
        eventPublisher.publishEvent(new ActivityEvent(
                userId,
                ActivityType.PUBLISH_TRANSLATION,
                ActivityTargetType.TRANSLATION,
                saved.getId().toString(),
                "User published translation: " + saved.getName()));

        return mapper.toTranslationResponse(saved);
    }

    @Transactional
    public void deleteTranslation(UUID translationId, UUID userId) {
        Translation translation = getTranslationAndVerifyOwnership(translationId, userId);
        UUID chapterId = translation.getChapter().getId();

        // Soft delete translation
        if (translation.getStatus() == Translation.TranslationStatus.PUBLISHED) {
            userRepository.updateTotalTranslations(translation.getTranslator().getId(), -1);
        }
        translation.softDelete();
        translation.setStatus(Translation.TranslationStatus.DELETED);
        translationRepository.save(translation);

        // Track activity
        eventPublisher.publishEvent(new ActivityEvent(
                userId,
                ActivityType.DELETE_TRANSLATION,
                ActivityTargetType.TRANSLATION,
                translationId.toString(),
                "User deleted translation: " + translation.getName()));

        // Delete associated pages and jobs
        translationPageRepository.deleteByTranslationId(translationId);
        uploadJobRepository.deleteByTranslationId(translationId);

        // If no more translations for this chapter, soft delete the chapter as well
        long remainingTranslations = translationRepository.countByChapterIdAndNotDeleted(chapterId);
        if (remainingTranslations == 0) {
            chapterRepository.findById(chapterId).ifPresent(chapter -> {
                chapter.softDelete();
                chapterRepository.save(chapter);
                log.info("Soft-deleted chapter {} as it has no more translations", chapterId);
            });
        }
    }

    @Transactional
    public void reorderPages(UUID translationId, ReorderPagesRequest request, UUID userId) {
        Translation translation = getTranslationAndVerifyOwnership(translationId, userId);

        if (translation.getStatus() != Translation.TranslationStatus.DRAFT) {
            throw new ConflictException("Can only reorder pages in DRAFT status");
        }

        List<TranslationPage> pages = translationPageRepository.findByTranslationIdOrderByPageIndex(translationId);
        Map<UUID, TranslationPage> pageMap = pages.stream()
                .collect(Collectors.toMap(TranslationPage::getId, p -> p));

        for (ReorderPagesRequest.PageOrderRequest order : request.getPages()) {
            TranslationPage page = pageMap.get(order.getPageId());
            if (page != null) {
                page.setPageIndex(order.getPageIndex());
            }
        }

        translationPageRepository.saveAll(pages);
    }

    public Translation getTranslationAndVerifyOwnership(UUID translationId, UUID userId) {
        Translation translation = translationRepository.findByIdAndNotDeleted(translationId)
                .orElseThrow(() -> new ResourceNotFoundException("Translation not found: " + translationId));

        if (!translation.getTranslator().getId().equals(userId)) {
            throw new ConflictException("Access denied: You are not the owner of this translation");
        }

        return translation;
    }

    public List<TranslationResponse> getMyTranslations(UUID userId) {
        List<Translation> translations = translationRepository.findByTranslatorIdAndNotDeleted(userId);
        if (translations.isEmpty()) {
            return Collections.emptyList();
        }

        List<UUID> translationIds = translations.stream().map(Translation::getId).toList();

        Map<UUID, UploadJob> uploadJobMap = uploadJobRepository.findByTranslationIdInAndNotDeleted(translationIds)
                .stream()
                .collect(Collectors.toMap(job -> job.getTranslation().getId(), job -> job));

        return translations.stream()
                .map(translation -> {
                    TranslationResponse response = mapper.toTranslationResponse(translation);
                    UploadJob job = uploadJobMap.get(translation.getId());
                    if (job != null) {
                        response.setUploadJob(mapper.toUploadJobResponse(job));
                    }
                    return response;
                })
                .toList();
    }

    public TranslationDetailResponse getTranslationDetail(UUID translationId) {
        Translation translation = translationRepository.findByIdAndNotDeleted(translationId)
                .orElseThrow(() -> new ResourceNotFoundException("Translation not found: " + translationId));

        TranslationDetailResponse response = mapper.toTranslationDetailResponse(translation);

        // Fetch pages
        List<TranslationPageResponse> pages = translationPageRepository
                .findByTranslationIdOrderByPageIndex(translationId)
                .stream()
                .map(mapper::toPageResponse)
                .toList();
        response.setPages(pages);

        return response;
    }
}
