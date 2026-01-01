package com.otaku.community.feature.post.repository;

import com.otaku.community.feature.post.entity.PostMedia;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostMediaRepository extends JpaRepository<PostMedia, UUID> {

    /**
     * Find all media for a specific post, ordered by order_index
     */
    List<PostMedia> findByPostIdOrderByOrderIndexAsc(UUID postId);

    /**
     * Delete all media for a specific post
     */
    void deleteByPostId(UUID postId);

    /**
     * Find media items for a specific user across all their published posts
     */
    @org.springframework.data.jpa.repository.Query("SELECT pm FROM PostMedia pm JOIN pm.post p " +
            "WHERE p.userId = :userId AND p.deletedAt IS NULL AND p.status = 'PUBLISHED' " +
            "ORDER BY pm.createdAt DESC, pm.id DESC")
    List<PostMedia> findMediaByUser(
            @Param("userId") java.util.UUID userId,
            Pageable pageable);

    /**
     * Find media items for a specific user after a certain cursor
     */
    @org.springframework.data.jpa.repository.Query("SELECT pm FROM PostMedia pm JOIN pm.post p " +
            "WHERE p.userId = :userId AND p.deletedAt IS NULL AND p.status = 'PUBLISHED' " +
            "AND (pm.createdAt < :cursorCreatedAt OR (pm.createdAt = :cursorCreatedAt AND pm.id < :cursorId)) "
            +
            "ORDER BY pm.createdAt DESC, pm.id DESC")
    List<PostMedia> findMediaByUserAfterCursor(
            @Param("userId") java.util.UUID userId,
            @Param("cursorCreatedAt") java.time.Instant cursorCreatedAt,
            @Param("cursorId") java.util.UUID cursorId,
            Pageable pageable);
}