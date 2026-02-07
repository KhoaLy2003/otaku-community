package com.otaku.community.feature.news.repository;

import com.otaku.community.feature.news.entity.News;
import com.otaku.community.feature.news.entity.NewsCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface NewsRepository extends JpaRepository<News, UUID> {

    boolean existsByLink(String link);

    @Query("""
            SELECT n FROM News n
            WHERE n.deletedAt IS NULL
            AND (:sourceId IS NULL OR n.rssSource.id = :sourceId)
            AND (n.rssSource.enabled = true)
            AND (:category IS NULL OR n.category = :category)
            ORDER BY n.publishedAt DESC
            """)
    Page<News> findNewsWithSource(
            @Param("sourceId") UUID sourceId,
            @Param("category") NewsCategory category,
            Pageable pageable);

    @Query("""
            SELECT n FROM News n
            WHERE n.deletedAt IS NULL
            AND (:category IS NULL OR n.category = :category)
            AND (n.rssSource.enabled = true)
            ORDER BY n.publishedAt DESC
            """)
    Page<News> findNews(
            @Param("category") NewsCategory category,
            Pageable pageable);

    @Query("""
            SELECT n FROM News n
            WHERE n.deletedAt IS NULL
            AND (n.publishedAt < :publishedAt OR (n.publishedAt = :publishedAt AND n.id < :id))
            ORDER BY n.publishedAt DESC, n.id DESC
            """)
    List<News> findNewsAfterCursor(
            @Param("publishedAt") Instant publishedAt,
            @Param("id") UUID id,
            Pageable pageable);

    @Query("""
            SELECT n FROM News n
            WHERE n.deletedAt IS NULL
            ORDER BY n.publishedAt DESC, n.id DESC
            """)
    List<News> findLatestNews(Pageable pageable);
}
