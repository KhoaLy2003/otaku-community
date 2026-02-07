package com.otaku.community.feature.manga.service;

import com.otaku.community.common.exception.AsyncJobProcessingException;
import com.otaku.community.common.exception.BadRequestException;
import com.otaku.community.common.exception.ConflictException;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.common.logging.LogExecutionTime;
import com.otaku.community.common.util.CustomMultipartFile;
import com.otaku.community.feature.activity.entity.ActivityTargetType;
import com.otaku.community.feature.activity.entity.ActivityType;
import com.otaku.community.feature.activity.event.ActivityEvent;
import com.otaku.community.feature.manga.dto.translation.CreateUploadJobRequest;
import com.otaku.community.feature.manga.dto.translation.UploadJobResponse;
import com.otaku.community.feature.manga.entity.Chapter;
import com.otaku.community.feature.manga.entity.Translation;
import com.otaku.community.feature.manga.entity.TranslationPage;
import com.otaku.community.feature.manga.entity.UploadJob;
import com.otaku.community.feature.manga.entity.UploadJob.UploadJobStatus;
import com.otaku.community.feature.manga.event.MangaUploadEvent;
import com.otaku.community.feature.manga.mapper.MangaReaderMapper;
import com.otaku.community.feature.manga.repository.ChapterRepository;
import com.otaku.community.feature.manga.repository.TranslationPageRepository;
import com.otaku.community.feature.manga.repository.TranslationRepository;
import com.otaku.community.feature.manga.repository.UploadJobRepository;
import com.otaku.community.feature.media.dto.MediaUploadResponse;
import com.otaku.community.feature.media.service.MediaService;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.IntStream;

@Service
@Slf4j
public class UploadJobService {

    private final UploadJobRepository uploadJobRepository;
    private final TranslationRepository translationRepository;
    private final TranslationPageRepository translationPageRepository;
    private final ChapterRepository chapterRepository;
    private final UserRepository userRepository;
    private final MediaService mediaService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ApplicationEventPublisher eventPublisher;
    private final MangaReaderMapper mapper;
    private final Executor uploadExecutor;

    // Phase 1: Debounced progress tracking
    private final ConcurrentHashMap<UUID, AtomicInteger> uploadCounters = new ConcurrentHashMap<>();
    private static final int PROGRESS_UPDATE_BATCH_SIZE = 2;

    public UploadJobService(
            UploadJobRepository uploadJobRepository,
            TranslationRepository translationRepository,
            TranslationPageRepository translationPageRepository,
            ChapterRepository chapterRepository,
            UserRepository userRepository,
            MediaService mediaService,
            SimpMessagingTemplate messagingTemplate,
            ApplicationEventPublisher eventPublisher,
            MangaReaderMapper mapper,
            @Qualifier("mangaUploadExecutor") Executor uploadExecutor) {
        this.uploadJobRepository = uploadJobRepository;
        this.translationRepository = translationRepository;
        this.translationPageRepository = translationPageRepository;
        this.chapterRepository = chapterRepository;
        this.userRepository = userRepository;
        this.mediaService = mediaService;
        this.messagingTemplate = messagingTemplate;
        this.eventPublisher = eventPublisher;
        this.mapper = mapper;
        this.uploadExecutor = uploadExecutor;
    }

    @Transactional
    public UploadJobResponse createUploadJob(CreateUploadJobRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Chapter chapter = chapterRepository.findById(request.getChapterId())
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found: " + request.getChapterId()));

        // Create initial DRAFT translation
        Translation translation = Translation.builder()
                .chapter(chapter)
                .translator(user)
                .name(request.getTranslationName())
                .notes(request.getNotes())
                .status(Translation.TranslationStatus.DRAFT)
                .build();
        translation = translationRepository.save(translation);

        // Create Upload Job
        UploadJob job = UploadJob.builder()
                .translation(translation)
                .user(user)
                .totalPages(0)
                .uploadedPages(0)
                .status(UploadJob.UploadJobStatus.PENDING)
                .build();
        job = uploadJobRepository.save(job);

        // Track activity
        eventPublisher.publishEvent(new ActivityEvent(
                userId,
                ActivityType.UPLOAD_TRANSLATION,
                ActivityTargetType.TRANSLATION,
                translation.getId().toString(),
                "User started uploading translation: " + translation.getName()));

        return mapper.toUploadJobResponse(job);
    }

    /**
     * Phase 2: Event-driven batch upload
     * Creates the job and publishes an event for async processing AFTER transaction
     * commits
     */
    @Transactional
    @LogExecutionTime
    public UploadJobResponse uploadPagesBatch(UUID jobId, MultipartFile[] files, Integer startPageIndex, UUID userId) {
        UploadJob job = uploadJobRepository.findByIdAndNotDeleted(jobId)
                .orElse(null);

        if (Objects.isNull(job)) {
            return new UploadJobResponse();
        }

        if (!job.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied: You are not the owner of this upload job");
        }

        if (job.getStatus() == UploadJob.UploadJobStatus.COMPLETED ||
                job.getStatus() == UploadJob.UploadJobStatus.CANCELLED) {
            throw new ConflictException("Cannot upload to a job in status: " + job.getStatus());
        }

        job.setStatus(UploadJob.UploadJobStatus.UPLOADING);
        job.setTotalPages(job.getUploadedPages() + files.length);
        UploadJob savedJob = uploadJobRepository.save(job);

        // Convert files to bytes for async processing
        List<byte[]> fileDatas = new ArrayList<>();
        List<String> filenames = new ArrayList<>();
        try {
            for (MultipartFile file : files) {
                fileDatas.add(file.getBytes());
                filenames.add(file.getOriginalFilename());
            }
        } catch (IOException e) {
            log.error("Failed to read multiparts for async upload", e);
            throw new BadRequestException("Failed to read upload files");
        }

        // Phase 2: Publish event for processing after transaction commits
        eventPublisher.publishEvent(new MangaUploadEvent(jobId, fileDatas, filenames, startPageIndex));

        return mapper.toUploadJobResponse(savedJob);
    }

    @Transactional
    public UploadJobResponse getJobStatus(UUID jobId) {
        UploadJob job = uploadJobRepository.findByIdAndNotDeleted(jobId)
                .orElse(null);

        if (Objects.isNull(job)) {
            return new UploadJobResponse();
        }

        return mapper.toUploadJobResponse(job);
    }

    @Transactional
    public UploadJobResponse cancelJob(UUID jobId, UUID userId) {
        UploadJob job = uploadJobRepository.findByIdAndNotDeleted(jobId)
                .orElse(null);

        if (Objects.isNull(job)) {
            return new UploadJobResponse();
        }

        if (!job.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied: You are not the owner of this upload job");
        }

        job.setStatus(UploadJob.UploadJobStatus.CANCELLED);

        // Clean up pages and translation
        translationPageRepository.deleteByTranslationId(job.getTranslation().getId());
        translationRepository.delete(job.getTranslation());

        return mapper.toUploadJobResponse(uploadJobRepository.save(job));
    }

    /**
     * Phase 1 & 2: Optimized async processing with:
     * - Progressive persistence (save each page immediately)
     * - Debounced progress updates (every 5 files)
     */
    public void processUploadAsync(UUID jobId, List<byte[]> fileDatas, List<String> filenames, Integer startPageIndex) {
        log.info("Starting optimized async upload for job: {} with {} files", jobId, fileDatas.size());

        try {
            // Fetch job with details eagerly to avoid LazyInitializationException in worker
            // threads
            UploadJob job = uploadJobRepository.findByIdWithDetails(jobId)
                    .orElseThrow(() -> new ResourceNotFoundException("Upload job not found: " + jobId));

            int baseIndex = startPageIndex != null ? startPageIndex : job.getUploadedPages();
            Translation translation = job.getTranslation();

            // Check if job was cancelled
            if (job.getStatus() == UploadJob.UploadJobStatus.CANCELLED) {
                log.info("Async upload cancelled for job: {}", jobId);
                return;
            }

            // Initialize progress counter for this job
            uploadCounters.put(jobId, new AtomicInteger(0));

            // Phase 2: Progressive upload with immediate persistence
            List<CompletableFuture<Void>> futures = IntStream.range(0, fileDatas.size())
                    .mapToObj(i -> CompletableFuture.runAsync(() -> {
                        byte[] data = fileDatas.get(i);
                        String filename = filenames.get(i);
                        int pageIndex = baseIndex + i;

                        try {
                            // Check cancellation (individual atomic check)
                            UploadJobStatus status = uploadJobRepository.findById(jobId)
                                    .map(UploadJob::getStatus)
                                    .orElse(null);
                            if (status == UploadJobStatus.CANCELLED) {
                                throw new RuntimeException("Job cancelled");
                            }

                            // Upload to Cloudinary
                            CustomMultipartFile customFile = new CustomMultipartFile(data, filename);
                            MediaUploadResponse mediaResponse = mediaService.uploadMedia(customFile);

                            // Phase 2: Save page immediately (progressive persistence)
                            TranslationPage page = TranslationPage.builder()
                                    .translation(translation)
                                    .pageIndex(pageIndex)
                                    .imageUrl(mediaResponse.getUrl())
                                    .width(mediaResponse.getWidth())
                                    .height(mediaResponse.getHeight())
                                    .build();
                            translationPageRepository.save(page);

                            // Phase 1: Debounced progress update
                            trackUploadProgress(jobId);

                        } catch (Exception e) {
                            log.error("Failed to upload page at index {} for job: {}", i, jobId, e);
                            throw new AsyncJobProcessingException(
                                    jobId,
                                    "Upload job was cancelled"
                            );
                        }
                    }, uploadExecutor).exceptionally(ex -> {
                        log.error("Failed to process upload for job: {}", jobId, ex);
                        return null;
                    }))
                    .toList();

            // Handle completion non-blocking
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                    .thenRunAsync(() -> {
                        // Final progress update with any remaining count
                        finalizeProgress(jobId);

                        // Mark completed
                        UploadJobStatus currentStatus = uploadJobRepository.findById(jobId)
                                .map(UploadJob::getStatus)
                                .orElse(null);
                        if (currentStatus != UploadJobStatus.CANCELLED && currentStatus != UploadJobStatus.FAILED) {
                            uploadJobRepository.updateStatus(jobId, UploadJobStatus.COMPLETED);
                            sendLatestProgressUpdate(jobId);
                        }
                        log.info("Optimized async upload completed for job: {}", jobId);
                        uploadCounters.remove(jobId);
                    }, uploadExecutor)
                    .exceptionally(ex -> {
                        log.error("Fatal error in async upload completion for job: {}", jobId, ex);
                        uploadJobRepository.markAsFailed(jobId, UploadJobStatus.FAILED, ex.getMessage());
                        sendLatestProgressUpdate(jobId);
                        uploadCounters.remove(jobId);
                        return null;
                    });

        } catch (Exception e) {
            log.error("Fatal error in starting async upload for job: {}", jobId, e);
            uploadJobRepository.markAsFailed(jobId, UploadJobStatus.FAILED, e.getMessage());
            sendLatestProgressUpdate(jobId);
            uploadCounters.remove(jobId);
        }
    }

    /**
     * Phase 1: Debounced progress tracking
     * Updates database and sends WebSocket notification every N files
     */
    private void trackUploadProgress(UUID jobId) {
        AtomicInteger counter = uploadCounters.get(jobId);
        if (counter == null) {
            return;
        }

        int count = counter.incrementAndGet();

        // Update every PROGRESS_UPDATE_BATCH_SIZE files
        if (count % PROGRESS_UPDATE_BATCH_SIZE == 0) {
            uploadJobRepository.addToUploadedPages(jobId, PROGRESS_UPDATE_BATCH_SIZE);
            sendLatestProgressUpdate(jobId);
            log.debug("Progress update for job {}: {} files uploaded", jobId, count);
        }
    }

    /**
     * Phase 1: Finalize any remaining progress not yet persisted
     */
    private void finalizeProgress(UUID jobId) {
        AtomicInteger counter = uploadCounters.get(jobId);
        if (counter != null) {
            int remaining = counter.get() % PROGRESS_UPDATE_BATCH_SIZE;
            if (remaining > 0) {
                uploadJobRepository.addToUploadedPages(jobId, remaining);
                log.debug("Finalized remaining {} files for job {}", remaining, jobId);
            }
        }
    }

    private void sendLatestProgressUpdate(UUID jobId) {
        uploadJobRepository.findByIdWithDetails(jobId).ifPresent(this::sendProgressUpdate);
    }

    private void sendProgressUpdate(UploadJob job) {
        UploadJobResponse response = mapper.toUploadJobResponse(job);
        String destination = "/queue/upload-progress";
        log.debug("Sending upload progress update to user: {} at {}", job.getUser().getId(), destination);
        messagingTemplate.convertAndSendToUser(
                job.getUser().getId().toString(),
                destination,
                response);
    }
}
