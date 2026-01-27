package com.otaku.community.feature.manga.repository;

import com.otaku.community.feature.manga.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, UUID> {

    @Query("SELECT c FROM Chapter c WHERE c.manga.id = :mangaId AND c.deletedAt IS NULL ORDER BY c.chapterNumber ASC")
    List<Chapter> findByMangaIdAndNotDeleted(@Param("mangaId") UUID mangaId);

    @Query("SELECT c FROM Chapter c WHERE c.manga.id = :mangaId AND c.chapterNumber = :chapterNumber AND c.deletedAt IS NULL")
    Optional<Chapter> findByMangaIdAndChapterNumber(@Param("mangaId") UUID mangaId,
                                                    @Param("chapterNumber") BigDecimal chapterNumber);
}
