package com.otaku.community.feature.news.entity;

import com.otaku.community.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "news", indexes = {
        @Index(name = "idx_news_published_at", columnList = "published_at"),
        @Index(name = "idx_news_source", columnList = "source"),
        @Index(name = "idx_news_category", columnList = "category"),
        @Index(name = "idx_news_link", columnList = "link", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class News extends BaseEntity {

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "link", nullable = false, unique = true, length = 1000)
    private String link;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(name = "author", length = 255)
    private String author;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false, length = 50)
    private NewsSource source;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", length = 50)
    private NewsCategory category;

    @Column(name = "published_at", nullable = false)
    private Instant publishedAt;

    @Column(name = "fetched_at")
    private Instant fetchedAt;
}
