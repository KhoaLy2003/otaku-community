package com.otaku.community.feature.news.service.impl;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.feature.news.dto.NewsResponse;
import com.otaku.community.feature.news.entity.News;
import com.otaku.community.feature.news.entity.NewsCategory;
import com.otaku.community.feature.news.entity.NewsSource;
import com.otaku.community.feature.news.mapper.NewsMapper;
import com.otaku.community.feature.news.repository.NewsRepository;
import com.otaku.community.feature.news.service.NewsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class NewsServiceImpl implements NewsService {

    private final NewsRepository newsRepository;
    private final NewsMapper newsMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<NewsResponse> getNews(NewsSource source, NewsCategory category, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<News> newsPage = newsRepository.findNews(source, category, pageable);

        return PageResponse.of(
                newsPage.getContent().stream()
                        .map(newsMapper::toResponse)
                        .toList(),
                page,
                limit,
                newsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public NewsResponse getNewsById(UUID id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News", "id", id));
        return newsMapper.toResponse(news);
    }
}
