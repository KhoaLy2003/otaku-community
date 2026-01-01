package com.otaku.community.feature.interaction.repository;

import com.otaku.community.feature.interaction.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

    /**
     * Find all comments for a post (excluding soft deleted)
     * Ordered by creation time ascending
     */
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findByPostIdOrderByCreatedAtDesc(@Param("postId") UUID postId);

    /**
     * Find all comments for a post with pagination (excluding soft deleted)
     */
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.deletedAt IS NULL ORDER BY c.createdAt ASC")
    Page<Comment> findByPostIdOrderByCreatedAtDesc(@Param("postId") UUID postId, Pageable pageable);

    /**
     * Count active comments for a post (excluding soft deleted)
     */
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId AND c.deletedAt IS NULL")
    long countActiveByPostId(@Param("postId") UUID postId);

    /**
     * Find a comment by ID and user ID (for ownership verification)
     */
    @Query("SELECT c FROM Comment c WHERE c.id = :commentId AND c.user.id = :userId AND c.deletedAt IS NULL")
    Optional<Comment> findByIdAndUserId(@Param("commentId") UUID commentId, @Param("userId") UUID userId);

    /**
     * Find all comments by a user (excluding soft deleted)
     */
    @Query("SELECT c FROM Comment c WHERE c.user.id = :userId AND c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId);

    /**
     * Find replies to a specific comment (for future nested comments feature)
     */
    @Query("SELECT c FROM Comment c WHERE c.parent.id = :parentId AND c.deletedAt IS NULL ORDER BY c.createdAt ASC")
    List<Comment> findRepliesByParentId(@Param("parentId") UUID parentId);
}