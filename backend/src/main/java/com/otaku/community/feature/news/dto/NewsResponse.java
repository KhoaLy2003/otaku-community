package com.otaku.community.feature.news.dto;

import com.otaku.community.feature.news.entity.NewsCategory;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class NewsResponse {
    private UUID id;
    private String title;
    private String summary;
    private String content;
    private String link;
    private String imageUrl;
    private String author;
    private RssSourceResponse source;
    private NewsCategory category;
    private Instant publishedAt;
    private Instant fetchedAt;
    private Instant createdAt;
}
