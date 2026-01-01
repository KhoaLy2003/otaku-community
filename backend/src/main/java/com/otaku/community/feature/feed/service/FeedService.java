package com.otaku.community.feature.feed.service;

import com.otaku.community.common.dto.CursorInfo;
import com.otaku.community.common.util.PaginationUtils;
import com.otaku.community.feature.feed.dto.FeedResponse;
import com.otaku.community.feature.feed.entity.UserFeed;
import com.otaku.community.feature.feed.mapper.FeedMapper;
import com.otaku.community.feature.feed.repository.UserFeedRepository;
import com.otaku.community.feature.interaction.entity.Reaction;
import com.otaku.community.feature.interaction.repository.ReactionRepository;
import com.otaku.community.feature.post.entity.Post;
import com.otaku.community.feature.post.entity.PostStatus;
import com.otaku.community.feature.post.repository.PostRepository;
import com.otaku.community.feature.user.entity.UserFollow;
import com.otaku.community.feature.user.repository.UserFollowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class FeedService {

    private final PostRepository postRepository;
    private final UserFeedRepository userFeedRepository;
    private final FeedMapper feedMapper;
    private final UserFollowRepository userFollowRepository;
    private final ReactionRepository reactionRepository;

    /**
     * Get home feed for authenticated user (followed users and topics)
     * Strategy:
     * 1. Check `user_feed` table (Fan-out on Write cache).
     * 2. If empty (new user/no follows), fallback to Explore Feed (Fan-out on
     * Read).
     */
    public FeedResponse getHomeFeed(String cursor, Integer limit, UUID currentUserId) {
        log.debug("Getting home feed for user: {}", currentUserId);

        int pageSize = PaginationUtils.validateAndGetPageSize(limit);
        Pageable pageable = PageRequest.of(0, pageSize + 1,
                Sort.by(Sort.Direction.DESC, "score", "createdAt"));

        // 1. Try to fetch from pre-computed feed
        Slice<UserFeed> userFeedSlice;
        if (cursor == null) {
            userFeedSlice = userFeedRepository.findAllByUserId(currentUserId, pageable);
        } else {
            // Next pages – dùng cursor-based query
            CursorInfo cursorInfo = PaginationUtils.parseCursor(cursor);

            userFeedSlice = userFeedRepository.findHomeFeedByCursor(
                    currentUserId,
                    cursorInfo.createdAt(),
                    cursorInfo.id(),
                    pageable);
        }

        if (userFeedSlice.isEmpty()) {
            log.debug("User {} has empty feed, falling back to Explore Feed", currentUserId);
            return getExploreFeed(cursor, limit, null, currentUserId);
        }

        List<UserFeed> feedEntries = userFeedSlice.getContent();

        // 3. Hydrate posts (Filter on Read for consistency)
        List<UUID> postIds = feedEntries.stream().map(UserFeed::getPostId).toList();
        List<Post> posts = postRepository.findAllById(postIds);

        var postMap = posts.stream().collect(Collectors.toMap(Post::getId, p -> p));
        List<Post> orderedPosts = new ArrayList<>();

        for (UserFeed entry : feedEntries) {
            Post post = postMap.get(entry.getPostId());
            // Filter out deleted or non-published posts (Lazy Filtering)
            if (post != null && post.getStatus() == PostStatus.PUBLISHED && post.getDeletedAt() == null) {
                orderedPosts.add(post);
            }
        }

        // 4. Handle Pagination
        return getFeedResponse(pageSize, orderedPosts, currentUserId);
    }

    private FeedResponse getFeedResponse(int pageSize, List<Post> orderedPosts, UUID currentUserId) {
        boolean hasMore = orderedPosts.size() > pageSize;
        if (hasMore) {
            orderedPosts = orderedPosts.subList(0, pageSize);
        }

        String nextCursor = hasMore && !orderedPosts.isEmpty()
                ? PaginationUtils.generateCursor(orderedPosts.get(orderedPosts.size() - 1))
                : null;

        // Determine which posts are liked by the current user
        Set<UUID> likedPostIds = new HashSet<>();
        if (currentUserId != null && !orderedPosts.isEmpty()) {
            List<UUID> postIds = orderedPosts.stream().map(Post::getId).toList();
            likedPostIds = reactionRepository.findLikedTargetIds(
                    currentUserId,
                    Reaction.TargetType.POST,
                    Reaction.ReactionType.LIKE,
                    postIds);
        }

        final Set<UUID> finalLikedPostIds = likedPostIds;

        return FeedResponse.builder()
                .posts(orderedPosts.stream()
                        .map(post -> feedMapper.toFeedPostResponse(post, finalLikedPostIds.contains(post.getId())))
                        .toList())
                .nextCursor(nextCursor)
                .hasMore(hasMore)
                .build();
    }

    /**
     * Get explore feed (all published posts)
     */
    public FeedResponse getExploreFeed(String cursor, Integer limit, List<UUID> topicIds, UUID currentUserId) {
        log.debug("Getting explore feed with cursor: {}, limit: {}", cursor, limit);

        int pageSize = PaginationUtils.validateAndGetPageSize(limit);
        CursorInfo cursorInfo = PaginationUtils.parseCursor(cursor);

        List<Post> posts = getPublishedPostsWithCursor(cursorInfo, pageSize + 1, topicIds);

        return getFeedResponse(pageSize, posts, currentUserId);
    }

    /**
     * Fan-out on Write trigger: Distribute post to followers' feeds.
     * Called asynchronously after post creation.
     */
    @Transactional
    public void fanOutToFollowers(Post post) {
        log.debug("Fan-out triggered for post: {}", post.getId());

        // 1. Find all followers of the post's author
        List<UserFollow> follows = userFollowRepository.findAllByFollowedId(post.getUserId());
        List<UUID> followerIds = follows.stream()
                .map(UserFollow::getFollowerId)
                .toList();

        if (followerIds.isEmpty()) {
            log.debug("No followers to fan-out to for user: {}", post.getUserId());
            return;
        }

        log.debug("Fan-out to {} followers", followerIds.size());
        // 2. Create feed entries for each follower
        List<UserFeed> feedEntries = followerIds.stream()
                .map(followerId -> UserFeed.builder()
                        .userId(followerId)
                        .postId(post.getId())
                        .authorId(post.getUserId())
                        .score((double) post.getCreatedAt().toEpochMilli()) // Use post creation time for score
                        .reason("FOLLOW")
                        .createdAt(Instant.now())
                        .build())
                .toList();

        // 3. Save all new feed entries
        userFeedRepository.saveAll(feedEntries);
    }

    /**
     * Backfill the feed when a user follows someone.
     * Fetches the last 20 posts from the followed user and adds them to the
     * follower's feed.
     */
    @Transactional
    public void backfillFeed(UUID followerId, UUID followedId) {
        log.debug("Backfilling feed for follower: {} from followed user: {}", followerId, followedId);

        // 1. Fetch recent posts from the followed user
        Pageable pageable = PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Post> recentPosts = postRepository.findByUserIdAndStatusAndNotDeleted(
                followedId, PostStatus.PUBLISHED, pageable).getContent();

        // 2. Insert into user_feed
        List<UserFeed> feedEntries = recentPosts.stream().map(post -> UserFeed.builder()
                .userId(followerId)
                .postId(post.getId())
                .authorId(followedId) // The person they followed is the author
                .score((double) System.currentTimeMillis()) // Simple chronological score for now
                .reason("FOLLOW")
                .createdAt(Instant.now())
                .build()).toList();

        userFeedRepository.saveAll(feedEntries);
    }

    /**
     * Remove feed entries when a user unfollows someone.
     */
    @Transactional
    public void removeFeedEntries(UUID followerId, UUID followedId) {
        log.debug("Removing feed entries for follower: {} from unfollowed user: {}", followerId, followedId);
        userFeedRepository.deleteByUserIdAndAuthorId(followerId, followedId);
    }

    /**
     * Get published posts with cursor-based pagination
     */
    private List<Post> getPublishedPostsWithCursor(CursorInfo cursorInfo, int limit, List<UUID> topicIds) {
        Pageable pageable = PageRequest.of(0, limit,
                Sort.by(Sort.Direction.DESC, "createdAt", "id"));

        List<UUID> safeTopicIds = (topicIds == null || topicIds.isEmpty()) ? null : topicIds;

        if (cursorInfo.createdAt() == null) {
            // First page
            return postRepository.findByStatusAndNotDeletedWithTopics(PostStatus.PUBLISHED, safeTopicIds, pageable)
                    .getContent();
        } else {
            // Subsequent pages with cursor
            if (safeTopicIds == null) {
                return postRepository.findPublishedPostsAfterCursor(
                        cursorInfo.createdAt(), cursorInfo.id(), pageable);
            }
            return postRepository.findPublishedPostsAfterCursorWithTopics(
                    cursorInfo.createdAt(), cursorInfo.id(), safeTopicIds, pageable);
        }
    }
}
