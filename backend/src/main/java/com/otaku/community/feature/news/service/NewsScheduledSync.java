package com.otaku.community.feature.news.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class NewsScheduledSync {

    private final NewsSyncService newsSyncService;

    @Scheduled(fixedDelayString = "${rss.sync.interval:1800000}", initialDelay = 60000)
    public void scheduledSync() {
        log.info("Starting scheduled RSS sync for all news sources");
        newsSyncService.syncAllSources();
    }
}
