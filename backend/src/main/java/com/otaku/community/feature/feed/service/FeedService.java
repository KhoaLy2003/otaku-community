package com.otaku.community.feature.feed.service;

import com.otaku.community.feature.feed.dto.FeedResponse;
import com.otaku.community.feature.feed.mapper.FeedMapper;
import com.otaku.community.feature.post.entity.Post;
import com.otaku.community.feature.post.entity.PostStatus;
import com.otaku.community.feature.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class FeedService {

    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 50;

    private final PostRepository postRepository;
    private final FeedMapper feedMapper;

    // TODO: Implement once user following system is in place
    /**
     * Get home feed for authenticated user (followed users and topics)
     * Currently returns empty feed until user following is implemented
     */
    public FeedResponse getHomeFeed(String cursor, Integer limit) {
        log.debug("Getting home feed for user: {}");
        
        // For now, return empty feed as per requirements
        return FeedResponse.builder()
                .posts(List.of())
                .nextCursor(null)
                .hasMore(false)
                .build();
    }

    /**
     * Get explore feed (all published posts)
     */
    public FeedResponse getExploreFeed(String cursor, Integer limit, List<UUID> topicIds) {
        log.debug("Getting explore feed with cursor: {}, limit: {}", cursor, limit);
        
        int pageSize = validateAndGetPageSize(limit);
        CursorInfo cursorInfo = parseCursor(cursor);
        
        List<Post> posts = getPublishedPostsWithCursor(cursorInfo, pageSize + 1, topicIds);
        
        boolean hasMore = posts.size() > pageSize;
        if (hasMore) {
            posts = posts.subList(0, pageSize);
        }
        
        String nextCursor = hasMore && !posts.isEmpty() ? 
            generateCursor(posts.get(posts.size() - 1)) : null;
        
        return FeedResponse.builder()
                .posts(posts.stream().map(feedMapper::toFeedPostResponse).toList())
                .nextCursor(nextCursor)
                .hasMore(hasMore)
                .build();
    }

    /**
     * Validate and normalize page size
     */
    private int validateAndGetPageSize(Integer limit) {
        if (limit == null || limit <= 0) {
            return DEFAULT_PAGE_SIZE;
        }
        return Math.min(limit, MAX_PAGE_SIZE);
    }

    /**
     * Parse cursor string into cursor info
     */
    private CursorInfo parseCursor(String cursor) {
        if (cursor == null || cursor.isBlank()) {
            return new CursorInfo(null, null);
        }

        try {
            String decoded = new String(Base64.getDecoder().decode(cursor), StandardCharsets.UTF_8);
            String[] parts = decoded.split(":", 2);

            long epochMillis = Long.parseLong(parts[0]);
            Instant createdAt = Instant.ofEpochMilli(epochMillis);
            UUID postId = UUID.fromString(parts[1]);

            return new CursorInfo(createdAt, postId);
        } catch (Exception e) {
            log.warn("Invalid cursor format: {}", cursor, e);
            return new CursorInfo(null, null);
        }
    }

    /**
     * Generate cursor from post
     */
    private String generateCursor(Post post) {
        String cursorData = post.getCreatedAt().toEpochMilli()
                + ":" + post.getId();
        return Base64.getEncoder().encodeToString(cursorData.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Get published posts with cursor-based pagination
     */
    private List<Post> getPublishedPostsWithCursor(CursorInfo cursorInfo, int limit, List<UUID> topicIds) {
        Pageable pageable = PageRequest.of(0, limit, 
            Sort.by(Sort.Direction.DESC, "createdAt", "id"));

        List<UUID> safeTopicIds =
                (topicIds == null || topicIds.isEmpty()) ? null : topicIds;

        if (cursorInfo.createdAt() == null) {
            // First page
            return postRepository.findByStatusAndNotDeletedWithTopics(PostStatus.PUBLISHED, safeTopicIds, pageable)
                    .getContent();
        } else {
            // Subsequent pages with cursor
            if (safeTopicIds == null) {
                return postRepository.findPublishedPostsAfterCursor(
                        cursorInfo.createdAt(), cursorInfo.postId(), pageable);
            }
            return postRepository.findPublishedPostsAfterCursorWithTopics(
                cursorInfo.createdAt(), cursorInfo.postId(), safeTopicIds, pageable);
        }
    }

    /**
     * Cursor information record
     */
    private record CursorInfo(Instant createdAt, UUID postId) {}
}