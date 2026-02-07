package com.otaku.community.feature.news.dto;

import com.otaku.community.feature.news.entity.RssSource;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class RssItemDto {
    private String title;
    private String summary;
    private String content;
    private String link;
    private String imageUrl;
    private String author;
    private Instant publishedAt;
    private RssSource source;
    private List<String> categories;
}
