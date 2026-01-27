package com.otaku.community.feature.manga.repository;

import com.otaku.community.feature.manga.entity.TranslationPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TranslationPageRepository extends JpaRepository<TranslationPage, UUID> {

    @Query("SELECT p FROM TranslationPage p WHERE p.translation.id = :translationId AND p.deletedAt IS NULL ORDER BY p.pageIndex ASC")
    List<TranslationPage> findByTranslationIdOrderByPageIndex(@Param("translationId") UUID translationId);

    void deleteByTranslationId(UUID translationId);
}
