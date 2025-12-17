package com.otaku.community.feature.post.repository;

import com.otaku.community.feature.post.entity.PostStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostStatsRepository extends JpaRepository<PostStats, UUID> {

    /**
     * Find stats by post ID
     */
    Optional<PostStats> findByPostId(UUID postId);

    /**
     * Increment like count for a post
     */
    @Modifying
    @Query("UPDATE PostStats ps SET ps.likeCount = ps.likeCount + 1, ps.reactionCount = ps.reactionCount + 1 WHERE ps.postId = :postId")
    void incrementLikeCount(@Param("postId") UUID postId);

    /**
     * Decrement like count for a post
     */
    @Modifying
    @Query("UPDATE PostStats ps SET ps.likeCount = GREATEST(ps.likeCount - 1, 0), ps.reactionCount = GREATEST(ps.reactionCount - 1, 0) WHERE ps.postId = :postId")
    void decrementLikeCount(@Param("postId") UUID postId);

    /**
     * Increment comment count for a post
     */
    @Modifying
    @Query("UPDATE PostStats ps SET ps.commentCount = ps.commentCount + 1 WHERE ps.postId = :postId")
    void incrementCommentCount(@Param("postId") UUID postId);

    /**
     * Decrement comment count for a post
     */
    @Modifying
    @Query("UPDATE PostStats ps SET ps.commentCount = GREATEST(ps.commentCount - 1, 0) WHERE ps.postId = :postId")
    void decrementCommentCount(@Param("postId") UUID postId);

    /**
     * Increment view count for a post
     */
    @Modifying
    @Query("UPDATE PostStats ps SET ps.viewCount = ps.viewCount + 1 WHERE ps.postId = :postId")
    void incrementViewCount(@Param("postId") UUID postId);

    /**
     * Increment share count for a post
     */
    @Modifying
    @Query("UPDATE PostStats ps SET ps.shareCount = ps.shareCount + 1 WHERE ps.postId = :postId")
    void incrementShareCount(@Param("postId") UUID postId);

    /**
     * Find posts with highest like counts
     */
    @Query("SELECT ps FROM PostStats ps ORDER BY ps.likeCount DESC")
    List<PostStats> findTopByLikeCount();

    /**
     * Find posts with highest view counts
     */
    @Query("SELECT ps FROM PostStats ps ORDER BY ps.viewCount DESC")
    List<PostStats> findTopByViewCount();
}