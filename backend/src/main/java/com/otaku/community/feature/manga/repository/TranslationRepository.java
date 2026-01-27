package com.otaku.community.feature.manga.repository;

import com.otaku.community.feature.manga.entity.Translation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TranslationRepository extends JpaRepository<Translation, UUID> {

    @Query("SELECT t FROM Translation t WHERE t.chapter.id = :chapterId AND t.status = 'PUBLISHED' AND t.deletedAt IS NULL ORDER BY t.publishedAt DESC")
    List<Translation> findPublishedByChapterId(@Param("chapterId") UUID chapterId);

    @Query("SELECT t FROM Translation t WHERE t.id = :id AND t.deletedAt IS NULL")
    Optional<Translation> findByIdAndNotDeleted(@Param("id") UUID id);

    @Query("SELECT t FROM Translation t WHERE t.translator.id = :translatorId AND t.deletedAt IS NULL ORDER BY t.createdAt DESC")
    List<Translation> findByTranslatorIdAndNotDeleted(@Param("translatorId") UUID translatorId);

    @Query("SELECT COUNT(t) FROM Translation t WHERE t.chapter.id = :chapterId AND t.deletedAt IS NULL")
    long countByChapterIdAndNotDeleted(@Param("chapterId") UUID chapterId);

    @Query("SELECT t FROM Translation t WHERE t.status = :status AND t.deletedAt IS NULL ORDER BY t.publishedAt DESC")
    List<Translation> findByStatusOrderByPublishedAtDesc(@Param("status") Translation.TranslationStatus status, Pageable pageable);

    @Query("SELECT t FROM Translation t JOIN TranslationStats s ON t.id = s.translationId WHERE t.status = 'PUBLISHED' AND t.deletedAt IS NULL ORDER BY (s.upvoteCount * 10 + s.viewCount) DESC")
    List<Translation> findTrendingTranslations(Pageable pageable);
}
