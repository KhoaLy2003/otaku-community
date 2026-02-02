package com.otaku.community.feature.news.repository;

import com.otaku.community.feature.news.entity.News;
import com.otaku.community.feature.news.entity.NewsCategory;
import com.otaku.community.feature.news.entity.NewsSource;
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
            AND (:source IS NULL OR n.source = :source)
            AND (:category IS NULL OR n.category = :category)
            ORDER BY n.publishedAt DESC
            """)
    Page<News> findNews(
            @Param("source") NewsSource source,
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
