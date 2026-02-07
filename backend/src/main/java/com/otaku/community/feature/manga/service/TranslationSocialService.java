package com.otaku.community.feature.manga.service;

import com.otaku.community.common.constant.CommonConstant;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.feature.interaction.entity.Reaction;
import com.otaku.community.feature.interaction.repository.ReactionRepository;
import com.otaku.community.feature.manga.dto.translation.PostTranslationCommentRequest;
import com.otaku.community.feature.manga.dto.translation.TranslationCommentResponse;
import com.otaku.community.feature.manga.dto.translation.TranslationResponse;
import com.otaku.community.feature.manga.dto.translation.TranslationStatsResponse;
import com.otaku.community.feature.manga.dto.translation.UserTranslationsResponse;
import com.otaku.community.feature.manga.entity.Translation;
import com.otaku.community.feature.manga.entity.TranslationComment;
import com.otaku.community.feature.manga.entity.TranslationStats;
import com.otaku.community.feature.manga.mapper.MangaReaderMapper;
import com.otaku.community.feature.manga.repository.TranslationCommentRepository;
import com.otaku.community.feature.manga.repository.TranslationRepository;
import com.otaku.community.feature.manga.repository.TranslationStatsRepository;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class TranslationSocialService {

    private final TranslationRepository translationRepository;
    private final TranslationStatsRepository statsRepository;
    private final TranslationCommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ReactionRepository reactionRepository;
    private final MangaReaderMapper mapper;

    @Transactional
    public void incrementViewCount(UUID translationId) {
        ensureStatsExist(translationId);
        statsRepository.incrementViewCount(translationId);

        translationRepository.findById(translationId)
                .ifPresent(t -> userRepository.incrementTotalMangaViews(t.getTranslator().getId()));
    }

    @Transactional
    public void toggleUpvote(UUID translationId, UUID userId) {
        ensureStatsExist(translationId);

        var existingReaction = reactionRepository.findByUserIdAndTargetTypeAndTargetId(
                userId,
                Reaction.TargetType.TRANSLATION,
                translationId);

        Translation translation = translationRepository.findById(translationId)
                .orElseThrow(() -> new ResourceNotFoundException(CommonConstant.ERR_MSG_TRANSLATION_NOT_FOUND));

        if (existingReaction.isPresent()) {
            reactionRepository.delete(existingReaction.get());
            statsRepository.updateUpvoteCount(translationId, -1);
            userRepository.updateTotalMangaUpvotes(translation.getTranslator().getId(), -1);
        } else {
            var reaction = Reaction.builder()
                    .userId(userId)
                    .targetType(Reaction.TargetType.TRANSLATION)
                    .targetId(translationId)
                    .reactionType(Reaction.ReactionType.LIKE)
                    .build();
            reactionRepository.save(reaction);
            statsRepository.updateUpvoteCount(translationId, 1);
            userRepository.updateTotalMangaUpvotes(translation.getTranslator().getId(), 1);
        }
    }

    public boolean getLikeStatus(UUID translationId, UUID userId) {
        if (userId == null)
            return false;
        return reactionRepository.existsByUserIdAndTargetTypeAndTargetId(
                userId,
                Reaction.TargetType.TRANSLATION,
                translationId);
    }

    @Transactional
    public TranslationCommentResponse postComment(UUID translationId, UUID userId,
                                                  PostTranslationCommentRequest request) {
        Translation translation = translationRepository.findById(translationId)
                .orElseThrow(() -> new ResourceNotFoundException(CommonConstant.ERR_MSG_TRANSLATION_NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(CommonConstant.ERR_MSG_USER_NOT_FOUND));

        TranslationComment comment = TranslationComment.builder()
                .translation(translation)
                .user(user)
                .content(request.getContent())
                .build();

        if (request.getParentId() != null) {
            TranslationComment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            comment.setParent(parent);
        }

        TranslationComment saved = commentRepository.save(comment);

        ensureStatsExist(translationId);
        statsRepository.updateCommentCount(translationId, 1);

        return mapToCommentResponse(saved);
    }

    public PageResponse<TranslationCommentResponse> getComments(int page, int limit, UUID translationId) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<TranslationComment> translationCommentPage = commentRepository
                .findByTranslationIdAndParentIsNullAndDeletedAtIsNullOrderByCreatedAtDesc(translationId,
                        pageable);

        return PageResponse.of(
                translationCommentPage.getContent().stream()
                        .map(this::mapToCommentResponse)
                        .toList(),
                page,
                limit,
                translationCommentPage.getTotalElements());
    }

    public List<TranslationResponse> getLatestTranslations(int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);

        return translationRepository
                .findByStatusOrderByPublishedAtDesc(Translation.TranslationStatus.PUBLISHED, pageable)
                .stream()
                .map(t -> {
                    TranslationResponse res = mapper.toTranslationResponse(t);
                    res.setStats(getStatsResponse(t.getId()));
                    return res;
                })
                .toList();
    }

    public List<TranslationResponse> getTrendingTranslations(int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        // Simple trending: views + (likes * 10)
        // In a real app, this would be a custom query in Repository
        // For now, let's just get some published ones
        return translationRepository.findTrendingTranslations(pageable)
                .stream()
                .map(t -> {
                    TranslationResponse res = mapper.toTranslationResponse(t);
                    res.setStats(getStatsResponse(t.getId()));
                    return res;
                })
                .toList();
    }

    public UserTranslationsResponse getUserTranslations(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(CommonConstant.ERR_MSG_USER_NOT_FOUND));

        List<Translation> translations = translationRepository.findByTranslatorIdAndNotDeleted(user.getId());

        List<TranslationResponse> items = translations.stream()
                .map(t -> {
                    TranslationResponse res = mapper.toTranslationResponse(t);
                    res.setStats(getStatsResponse(t.getId()));
                    return res;
                })
                .toList();

        return UserTranslationsResponse.builder()
                .items(items)
                .totalViews(items.stream().mapToLong(i -> i.getStats().getViews()).sum())
                .totalLikes(items.stream().mapToInt(i -> i.getStats().getLikes()).sum())
                .build();
    }

    public TranslationStatsResponse getStatsResponse(UUID translationId) {
        return statsRepository.findById(translationId)
                .map(s -> TranslationStatsResponse.builder()
                        .views(s.getViewCount())
                        .likes(s.getUpvoteCount())
                        .comments(s.getCommentCount())
                        .build())
                .orElse(TranslationStatsResponse.builder().views(0L).likes(0).comments(0).build());
    }

    private void ensureStatsExist(UUID translationId) {
        if (!statsRepository.existsById(translationId)) {
            Translation translation = translationRepository.findById(translationId)
                    .orElseThrow(() -> new ResourceNotFoundException(CommonConstant.ERR_MSG_TRANSLATION_NOT_FOUND));
            statsRepository.save(TranslationStats.builder()
                    .translation(translation)
                    .updatedAt(Instant.now())
                    .build());
        }
    }

    private TranslationCommentResponse mapToCommentResponse(TranslationComment comment) {
        return TranslationCommentResponse.builder()
                .id(comment.getId())
                .userId(comment.getUser().getId())
                .username(comment.getUser().getUsername())
                .avatarUrl(comment.getUser().getAvatarUrl())
                .content(comment.getContent())
                .imageUrl(comment.getImageUrl())
                .createdAt(comment.getCreatedAt())
                .replies(comment.getReplies().stream().map(this::mapToCommentResponse).toList())
                .build();
    }
}
