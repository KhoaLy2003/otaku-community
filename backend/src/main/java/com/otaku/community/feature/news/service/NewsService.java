package com.otaku.community.feature.news.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.news.dto.NewsResponse;
import com.otaku.community.feature.news.entity.NewsCategory;
import com.otaku.community.feature.news.entity.NewsSource;

import java.util.UUID;

public interface NewsService {
    PageResponse<NewsResponse> getNews(NewsSource source, NewsCategory category, int page, int limit);

    NewsResponse getNewsById(UUID id);
}
