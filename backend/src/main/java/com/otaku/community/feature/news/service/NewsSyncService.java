package com.otaku.community.feature.news.service;

import com.otaku.community.feature.news.dto.RssItemDto;
import com.otaku.community.feature.news.entity.News;
import com.otaku.community.feature.news.entity.RssSource;
import com.otaku.community.feature.news.repository.NewsRepository;
import com.otaku.community.feature.news.repository.RssSourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NewsSyncService {

    private final RssFeedParser rssFeedParser;
    private final NewsRepository newsRepository;
    private final RssSourceRepository rssSourceRepository;
    private final NewsCategoryClassifier categoryClassifier;

    @Transactional
    public void syncAllSources() {
        log.info("Starting sync of all news sources (prioritized)");
        List<RssSource> sources = rssSourceRepository.findByEnabledTrueOrderByPriorityAsc();
        for (RssSource source : sources) {
            syncSource(source);
        }
    }

    @Transactional
    public void syncSource(RssSource source) {
        log.info("Syncing source: {}", source.getName());
        try {
            List<RssItemDto> items = rssFeedParser.parseRssFeed(source.getUrl(), source);

            int newCount = 0;
            for (RssItemDto item : items) {
                if (!newsRepository.existsByLink(item.getLink())) {
                    News news = new News();
                    news.setTitle(item.getTitle());
                    news.setSummary(item.getSummary());
                    news.setContent(item.getContent());
                    news.setLink(item.getLink());
                    news.setImageUrl(item.getImageUrl());
                    news.setAuthor(item.getAuthor());
                    news.setRssSource(item.getSource());
                    news.setCategory(categoryClassifier.classify(item));
                    news.setPublishedAt(item.getPublishedAt());
                    news.setFetchedAt(Instant.now());

                    newsRepository.save(news);
                    newCount++;
                }
            }

            source.setLastSyncAt(Instant.now());
            source.setLastSyncStatus("SUCCESS: " + newCount + " new items");
            rssSourceRepository.save(source);
            log.info("Sync completed for {}: {} new items added", source.getName(), newCount);
        } catch (Exception e) {
            log.error("Failed to sync source {}: {}", source.getName(), e.getMessage());
            source.setLastSyncAt(Instant.now());
            source.setLastSyncStatus("FAILED: " + e.getMessage());
            rssSourceRepository.save(source);
        }
    }
}
