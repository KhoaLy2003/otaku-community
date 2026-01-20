package com.otaku.community.feature.manga.listener;

import com.otaku.community.feature.manga.event.MangaUploadEvent;
import com.otaku.community.feature.manga.service.UploadJobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class MangaUploadListener {

    private final UploadJobService uploadJobService;

    @Async("mangaUploadExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleMangaUpload(MangaUploadEvent event) {
        log.info("Received MangaUploadEvent for job: {}", event.getJobId());
        uploadJobService.processUploadAsync(
                event.getJobId(),
                event.getFileDatas(),
                event.getFilenames(),
                event.getStartPageIndex());
    }
}
