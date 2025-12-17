package com.otaku.community.feature.post.service;

import com.otaku.community.feature.post.entity.PostStats;
import com.otaku.community.feature.post.repository.PostStatsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostStatsService {

    private final PostStatsRepository postStatsRepository;

    /**
     * Initialize stats for a new post
     */
    @Transactional
    public PostStats initializePostStats(UUID postId) {
        log.debug("Initializing stats for post {}", postId);
        
        PostStats stats = PostStats.builder()
                .postId(postId)
                .build();
        
        return postStatsRepository.save(stats);
    }

    /**
     * Get or create stats for a post
     */
    @Transactional
    public PostStats getOrCreatePostStats(UUID postId) {
        return postStatsRepository.findByPostId(postId)
                .orElseGet(() -> initializePostStats(postId));
    }

    /**
     * Increment like count
     */
    @Transactional
    public void incrementLikeCount(UUID postId) {
        PostStats stats = getOrCreatePostStats(postId);
        stats.incrementLikeCount();
        postStatsRepository.save(stats);
        log.debug("Incremented like count for post {}", postId);
    }

    /**
     * Decrement like count
     */
    @Transactional
    public void decrementLikeCount(UUID postId) {
        PostStats stats = getOrCreatePostStats(postId);
        stats.decrementLikeCount();
        postStatsRepository.save(stats);
        log.debug("Decremented like count for post {}", postId);
    }

    /**
     * Increment comment count
     */
    @Transactional
    public void incrementCommentCount(UUID postId) {
        PostStats stats = getOrCreatePostStats(postId);
        stats.incrementCommentCount();
        postStatsRepository.save(stats);
        log.debug("Incremented comment count for post {}", postId);
    }

    /**
     * Decrement comment count
     */
    @Transactional
    public void decrementCommentCount(UUID postId) {
        PostStats stats = getOrCreatePostStats(postId);
        stats.decrementCommentCount();
        postStatsRepository.save(stats);
        log.debug("Decremented comment count for post {}", postId);
    }

    /**
     * Increment view count
     */
    @Transactional
    public void incrementViewCount(UUID postId) {
        PostStats stats = getOrCreatePostStats(postId);
        stats.incrementViewCount();
        postStatsRepository.save(stats);
        log.debug("Incremented view count for post {}", postId);
    }

    /**
     * Increment share count
     */
    @Transactional
    public void incrementShareCount(UUID postId) {
        PostStats stats = getOrCreatePostStats(postId);
        stats.incrementShareCount();
        postStatsRepository.save(stats);
        log.debug("Incremented share count for post {}", postId);
    }

    /**
     * Get stats for a post
     */
    @Transactional(readOnly = true)
    public PostStats getPostStats(UUID postId) {
        return postStatsRepository.findByPostId(postId)
                .orElse(PostStats.builder().postId(postId).build());
    }
}