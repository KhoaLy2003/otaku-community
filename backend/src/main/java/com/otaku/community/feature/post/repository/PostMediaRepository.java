package com.otaku.community.feature.post.repository;

import com.otaku.community.feature.post.entity.PostMedia;
import org.springframework.data.jpa.repository.JpaRepository;
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
     * Find media by post ID and media type
     */
    List<PostMedia> findByPostIdAndMediaType(UUID postId, PostMedia.MediaType mediaType);

    /**
     * Count media items for a post
     */
    long countByPostId(UUID postId);

    /**
     * Delete all media for a specific post
     */
    void deleteByPostId(UUID postId);

    /**
     * Check if a post has any media
     */
    boolean existsByPostId(UUID postId);
}