package com.otaku.community.feature.manga.repository;

import com.otaku.community.feature.manga.entity.TranslationStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TranslationStatsRepository extends JpaRepository<TranslationStats, UUID> {

    @Modifying
    @Query("UPDATE TranslationStats s SET s.viewCount = s.viewCount + 1, s.updatedAt = CURRENT_TIMESTAMP WHERE s.translationId = :translationId")
    void incrementViewCount(UUID translationId);

    @Modifying
    @Query("UPDATE TranslationStats s SET s.upvoteCount = s.upvoteCount + :delta, s.updatedAt = CURRENT_TIMESTAMP WHERE s.translationId = :translationId")
    void updateUpvoteCount(UUID translationId, Integer delta);

    @Modifying
    @Query("UPDATE TranslationStats s SET s.commentCount = s.commentCount + :delta, s.updatedAt = CURRENT_TIMESTAMP WHERE s.translationId = :translationId")
    void updateCommentCount(UUID translationId, Integer delta);
}
