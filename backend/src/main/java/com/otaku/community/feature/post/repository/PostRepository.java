package com.otaku.community.feature.post.repository;

import com.otaku.community.feature.post.entity.Post;
import com.otaku.community.feature.post.entity.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {

    /**
     * Find a post by ID that is not soft deleted
     */
    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.id = :id")
    Optional<Post> findByIdAndNotDeleted(@Param("id") UUID id);

    /**
     * Find all posts by user ID that are not soft deleted
     */
    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.userId = :userId ORDER BY p.createdAt DESC")
    Page<Post> findByUserIdAndNotDeleted(@Param("userId") UUID userId, Pageable pageable);

    /**
     * Find all published posts that are not soft deleted
     */
    @Query("""
            SELECT DISTINCT p
            FROM Post p
            JOIN p.postTopics t
            WHERE p.deletedAt IS NULL
            AND p.status = :status
            AND (:topicIds IS NULL OR t.id IN :topicIds)
            ORDER BY p.createdAt DESC, p.id DESC
            """)
    Page<Post> findByStatusAndNotDeletedWithTopics(
            @Param("status") PostStatus status,
            @Param("topicIds") List<UUID> topicIds,
            Pageable pageable);

    /**
     * Find all posts by user ID and status that are not soft deleted
     */
    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.userId = :userId AND p.status = :status ORDER BY p.createdAt DESC")
    Page<Post> findByUserIdAndStatusAndNotDeleted(@Param("userId") UUID userId, @Param("status") PostStatus status,
                                                  Pageable pageable);

    /**
     * Find all posts by user ID and status that are not soft deleted (List version)
     */
    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.userId = :userId AND p.status = :status ORDER BY p.createdAt DESC")
    List<Post> findByUserIdAndStatusAndNotDeletedList(@Param("userId") UUID userId, @Param("status") PostStatus status);

    /**
     * Count posts by user ID that are not soft deleted
     */
    @Query("SELECT COUNT(p) FROM Post p WHERE p.deletedAt IS NULL AND p.userId = :userId")
    long countByUserIdAndNotDeleted(@Param("userId") UUID userId);

    /**
     * Count posts by user ID and status that are not soft deleted
     */
    @Query("SELECT COUNT(p) FROM Post p WHERE p.deletedAt IS NULL AND p.userId = :userId AND p.status = :status")
    long countByUserIdAndStatusAndNotDeleted(@Param("userId") UUID userId, @Param("status") PostStatus status);

    /**
     * Count all published posts that are not soft deleted
     */
    @Query("SELECT COUNT(p) FROM Post p WHERE p.deletedAt IS NULL AND p.status = 'PUBLISHED'")
    long countPublishedAndNotDeleted();

    /**
     * Check if a post exists by ID and is not soft deleted
     */
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Post p WHERE p.deletedAt IS NULL AND p.id = :id")
    boolean existsByIdAndNotDeleted(@Param("id") UUID id);

    /**
     * Check if a user owns a specific post
     */
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Post p WHERE p.deletedAt IS NULL AND p.id = :postId AND p.userId = :userId")
    boolean existsByIdAndUserIdAndNotDeleted(@Param("postId") UUID postId, @Param("userId") UUID userId);

    /**
     * Find published posts after cursor for pagination
     */
    @Query("""
            SELECT DISTINCT p
            FROM Post p
            LEFT JOIN p.postTopics t
            WHERE p.deletedAt IS NULL
            AND p.status = 'PUBLISHED'
            AND (:topicIds IS NULL OR t.id IN :topicIds)
            AND (
                :cursorCreatedAt IS NULL
                OR p.createdAt < :cursorCreatedAt
                OR (p.createdAt = :cursorCreatedAt AND p.id < :cursorPostId)
            )
            ORDER BY p.createdAt DESC, p.id DESC
            """)
    List<Post> findPublishedPostsAfterCursorWithTopics(
            @Param("cursorCreatedAt") Instant cursorCreatedAt,
            @Param("cursorPostId") UUID cursorPostId,
            @Param("topicIds") List<UUID> topicIds,
            Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.status = 'PUBLISHED' " +
            "AND (p.createdAt < :cursorCreatedAt OR (p.createdAt = :cursorCreatedAt AND p.id < :cursorPostId)) " +
            "ORDER BY p.createdAt DESC, p.id DESC")
    List<Post> findPublishedPostsAfterCursor(
            @Param("cursorCreatedAt") Instant cursorCreatedAt,
            @Param("cursorPostId") UUID cursorPostId,
            Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.userId = :userId " +
            "AND (p.createdAt < :cursorCreatedAt OR (p.createdAt = :cursorCreatedAt AND p.id < :cursorPostId)) " +
            "ORDER BY p.createdAt DESC, p.id DESC")
    List<Post> findPostsByUserAfterCursor(
            @Param("userId") UUID userId,
            @Param("cursorCreatedAt") Instant cursorCreatedAt,
            @Param("cursorPostId") UUID cursorPostId,
            Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL AND p.userId = :userId AND p.status = :status " +
            "AND (:cursorCreatedAt IS NULL OR p.createdAt < :cursorCreatedAt OR (p.createdAt = :cursorCreatedAt AND p.id < :cursorPostId)) "
            +
            "ORDER BY p.createdAt DESC, p.id DESC")
    List<Post> findPostsByUserAndStatusAfterCursor(
            @Param("userId") UUID userId,
            @Param("status") PostStatus status,
            @Param("cursorCreatedAt") Instant cursorCreatedAt,
            @Param("cursorPostId") UUID cursorPostId,
            Pageable pageable);
}