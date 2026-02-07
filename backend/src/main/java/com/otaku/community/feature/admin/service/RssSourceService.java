package com.otaku.community.feature.admin.service;

import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.feature.news.dto.CreateRssSourceRequest;
import com.otaku.community.feature.news.dto.RssFeedTestResult;
import com.otaku.community.feature.news.dto.RssSourceResponse;
import com.otaku.community.feature.news.dto.UpdateRssSourceRequest;
import com.otaku.community.feature.news.entity.RssSource;
import com.otaku.community.feature.news.mapper.RssSourceMapper;
import com.otaku.community.feature.news.repository.RssSourceRepository;
import com.otaku.community.feature.news.service.NewsSyncService;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URL;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RssSourceService {

    private final RssSourceRepository rssSourceRepository;
    private final RssSourceMapper rssSourceMapper;
    private final NewsSyncService newsSyncService;

    @Transactional(readOnly = true)
    public List<RssSourceResponse> getAllSources() {
        return rssSourceRepository.findAll().stream()
                .map(rssSourceMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RssSourceResponse> getEnabledSources() {
        return rssSourceRepository.findByEnabledTrueOrderByPriorityAsc().stream()
                .map(rssSourceMapper::toResponse)
                .toList();
    }

    @Transactional
    public RssSourceResponse createSource(CreateRssSourceRequest request) {
        RssSource rssSource = rssSourceMapper.toEntity(request);
        // Default priority if null
        if (rssSource.getPriority() == null) {
            rssSource.setPriority(0);
        }
        RssSource saved = rssSourceRepository.save(rssSource);
        return rssSourceMapper.toResponse(saved);
    }

    @Transactional
    public RssSourceResponse updateSource(UUID id, UpdateRssSourceRequest request) {
        RssSource rssSource = rssSourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RSS Source not found with id: " + id));

        rssSourceMapper.updateEntityFromRequest(request, rssSource);
        RssSource saved = rssSourceRepository.save(rssSource);
        return rssSourceMapper.toResponse(saved);
    }

    @Transactional
    public void deleteSource(UUID id) {
        if (!rssSourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("RSS Source not found with id: " + id);
        }
        rssSourceRepository.deleteById(id);
    }

    @Async
    public void syncSource(UUID id) {
        RssSource rssSource = rssSourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RSS Source not found with id: " + id));
        newsSyncService.syncSource(rssSource);
    }

    public RssFeedTestResult testSource(String url) {
        try {
            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed = input.build(new XmlReader(new URL(url)));

            List<String> sampleTitles = feed.getEntries().stream()
                    .limit(3)
                    .map(SyndEntry::getTitle)
                    .toList();

            return RssFeedTestResult.builder()
                    .success(true)
                    .title(feed.getTitle())
                    .description(feed.getDescription())
                    .itemCount(feed.getEntries().size())
                    .sampleTitles(sampleTitles)
                    .build();

        } catch (Exception e) {
            log.error("RSS Feed test failed for URL: {}", url, e);
            return RssFeedTestResult.builder()
                    .success(false)
                    .error(e.getMessage())
                    .build();
        }
    }
}
