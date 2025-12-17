package com.otaku.community.feature.feed.repository;

import com.otaku.community.feature.feed.entity.UserFeed;
import com.otaku.community.feature.feed.entity.UserFeedId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface UserFeedRepository extends JpaRepository<UserFeed, UserFeedId> {

    /**
     * Find user's feed ordered by score (highest first)
     */
    Page<UserFeed> findByUserIdOrderByScoreDescCreatedAtDesc(UUID userId, Pageable pageable);

    /**
     * Find user's feed by reason
     */
    Page<UserFeed> findByUserIdAndReasonOrderByScoreDescCreatedAtDesc(
            UUID userId, 
            UserFeed.FeedReason reason, 
            Pageable pageable
    );

    /**
     * Find feed entries for a specific post
     */
    List<UserFeed> findByPostId(UUID postId);

    /**
     * Find feed entries by author
     */
    //List<UserFeed> findByAuthorId(UUID authorId);

    /**
     * Delete feed entries for a specific post
     */
    void deleteByPostId(UUID postId);

    /**
     * Delete feed entries by author (when user is deleted/blocked)
     */
    //void deleteByAuthorId(UUID authorId);

    /**
     * Delete old feed entries (cleanup)
     */
    void deleteByCreatedAtBefore(LocalDateTime cutoffDate);

    /**
     * Check if a post exists in user's feed
     */
    boolean existsByUserIdAndPostId(UUID userId, UUID postId);

    /**
     * Count feed entries for a user
     */
    long countByUserId(UUID userId);

    /**
     * Find recent feed entries for a user
     */
    @Query("SELECT uf FROM UserFeed uf WHERE uf.userId = :userId " +
           "AND uf.createdAt >= :since ORDER BY uf.score DESC, uf.createdAt DESC")
    List<UserFeed> findRecentByUserId(@Param("userId") UUID userId, @Param("since") LocalDateTime since);

    /**
     * Update scores for feed entries (batch operation)
     */
    @Query("UPDATE UserFeed uf SET uf.score = :newScore WHERE uf.userId = :userId AND uf.postId = :postId")
    void updateScore(@Param("userId") UUID userId, @Param("postId") UUID postId, @Param("newScore") Float newScore);
}