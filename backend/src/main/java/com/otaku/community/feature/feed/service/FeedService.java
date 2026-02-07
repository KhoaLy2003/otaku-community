package com.otaku.community.feature.feed.service;

import com.otaku.community.common.dto.CursorInfo;
import com.otaku.community.common.util.PaginationUtils;
import com.otaku.community.feature.feed.dto.FeedResponse;
import com.otaku.community.feature.feed.entity.UserFeed;
import com.otaku.community.feature.feed.mapper.FeedMapper;
import com.otaku.community.feature.feed.repository.UserFeedRepository;
import com.otaku.community.feature.interaction.entity.Reaction;
import com.otaku.community.feature.interaction.repository.ReactionRepository;
import com.otaku.community.feature.news.entity.News;
import com.otaku.community.feature.news.repository.NewsRepository;
import com.otaku.community.feature.post.entity.Post;
import com.otaku.community.feature.post.entity.PostStatus;
import com.otaku.community.feature.post.repository.PostRepository;
import com.otaku.community.feature.user.entity.ProfileVisibility;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.entity.UserFollow;
import com.otaku.community.feature.user.repository.UserFollowRepository;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
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
    private final UserRepository userRepository;
    private final NewsRepository newsRepository;

    @Value("${app.feed.posts-limit:10}")
    private int defaultPostsLimit;

    @Value("${app.feed.news-limit:5}")
    private int defaultNewsLimit;

    /**
     * Get home feed for authenticated user (followed users and topics)
     * Strategy:
     * 1. Check `user_feed` table (Fan-out on Write cache).
     * 2. If empty (new user/no follows), fallback to Explore Feed (Fan-out on
     * Read).
     */
    public FeedResponse getHomeFeed(String postCursor, String newsCursor, Integer limit, UUID currentUserId) {
        log.debug("Getting home feed for user: {}", currentUserId);

        int postsLimit = limit != null ? limit : defaultPostsLimit;
        int newsLimit = defaultNewsLimit;

        // 1. Fetch Posts
        List<Post> posts = new ArrayList<>();
        boolean hasMorePosts = false;
        String nextPostCursor = "END";

        if (!"END".equals(postCursor)) {
            Pageable postPageable = PageRequest.of(0, postsLimit + 1,
                    Sort.by(Sort.Direction.DESC, "score", "createdAt"));
            Slice<UserFeed> userFeedSlice;
            if (postCursor == null) {
                userFeedSlice = userFeedRepository.findAllByUserId(currentUserId, postPageable);
            } else {
                CursorInfo postCursorInfo = PaginationUtils.parseCursor(postCursor);
                userFeedSlice = userFeedRepository.findHomeFeedByCursor(currentUserId, postCursorInfo.createdAt(),
                        postCursorInfo.id(), postPageable);
            }

            if (!userFeedSlice.isEmpty()) {
                List<UUID> postIds = userFeedSlice.getContent().stream().map(UserFeed::getPostId).toList();
                List<Post> hydratedPosts = postRepository.findAllById(postIds);
                var postMap = hydratedPosts.stream().collect(Collectors.toMap(Post::getId, p -> p));
                for (UserFeed entry : userFeedSlice.getContent()) {
                    Post post = postMap.get(entry.getPostId());
                    if (post != null && post.getStatus() == PostStatus.PUBLISHED && post.getDeletedAt() == null) {
                        posts.add(post);
                    }
                }
            }

            hasMorePosts = posts.size() > postsLimit;
            if (hasMorePosts) {
                posts = posts.subList(0, postsLimit);
                nextPostCursor = PaginationUtils.generateCursor(posts.get(posts.size() - 1));
            }
        }

        // 2. Fallback to Explore if home feed is empty
        if (posts.isEmpty() && postCursor == null) {
            log.debug("User {} has empty home feed posts, falling back to Explore", currentUserId);
            return getExploreFeed(null, newsCursor, limit, null, currentUserId);
        }

        // 3. Fetch News separately
        List<News> newsList = new ArrayList<>();
        boolean hasMoreNews = false;
        String nextNewsCursor = "END";
        if (!"END".equals(newsCursor)) {
            newsList = fetchNewsWithCursor(newsCursor, newsLimit);
            hasMoreNews = newsList.size() > newsLimit;
            if (hasMoreNews) {
                newsList = newsList.subList(0, newsLimit);
                News lastNews = newsList.get(newsList.size() - 1);
                nextNewsCursor = PaginationUtils.generateCursor(lastNews.getPublishedAt(), lastNews.getId());
            }
        }

        return buildFeedResponse(posts, nextPostCursor, hasMorePosts, newsList, nextNewsCursor, hasMoreNews,
                currentUserId);
    }

    private List<News> fetchNewsWithCursor(String newsCursor, int limit) {
        Pageable newsPageable = PageRequest.of(0, limit + 1);
        CursorInfo newsCursorInfo = PaginationUtils.parseCursor(newsCursor);
        if (newsCursorInfo.createdAt() == null) {
            return newsRepository.findLatestNews(newsPageable);
        } else {
            return newsRepository.findNewsAfterCursor(newsCursorInfo.createdAt(), newsCursorInfo.id(), newsPageable);
        }
    }

    private FeedResponse buildFeedResponse(List<Post> posts, String postCursor, boolean hasMorePosts,
                                           List<News> news, String newsCursor, boolean hasMoreNews, UUID currentUserId) {

        // Hydrate liked posts
        Set<UUID> likedPostIds = new HashSet<>();
        if (currentUserId != null && !posts.isEmpty()) {
            likedPostIds = reactionRepository.findLikedTargetIds(
                    currentUserId, Reaction.TargetType.POST, Reaction.ReactionType.LIKE,
                    posts.stream().map(Post::getId).toList());
        }

        final Set<UUID> finalLikedPostIds = likedPostIds;

        return FeedResponse.builder()
                .posts(posts.stream().map(p -> feedMapper.toFeedPostResponse(p, finalLikedPostIds.contains(p.getId())))
                        .toList())
                .postCursor(postCursor)
                .hasMorePosts(hasMorePosts)
                .news(news.stream().map(feedMapper.getNewsMapper()::toResponse).toList())
                .newsCursor(newsCursor)
                .hasMoreNews(hasMoreNews)
                .totalPosts(posts.size())
                .totalNews(news.size())
                .build();
    }

    public FeedResponse getExploreFeed(String postCursor, String newsCursor, Integer limit, List<UUID> topicIds,
                                       UUID currentUserId) {
        log.debug("Getting explore feed. postCursor: {}, newsCursor: {}", postCursor, newsCursor);

        int postsLimit = limit != null ? limit : defaultPostsLimit;
        int newsLimit = defaultNewsLimit;

        // Fetch Posts
        List<Post> posts = new ArrayList<>();
        boolean hasMorePosts = false;
        String nextPostCursor = "END";

        if (!"END".equals(postCursor)) {
            CursorInfo postCursorInfo = PaginationUtils.parseCursor(postCursor);
            posts = getPublishedPostsWithCursor(postCursorInfo, postsLimit + 1, topicIds);
            hasMorePosts = posts.size() > postsLimit;
            if (hasMorePosts) {
                posts = posts.subList(0, postsLimit);
                nextPostCursor = PaginationUtils.generateCursor(posts.get(posts.size() - 1));
            }
        }

        // Fetch News (only if no topics or topics empty, as news doesn't have topic
        // yet)
        List<News> newsList = new ArrayList<>();
        boolean hasMoreNews = false;
        String nextNewsCursor = "END";

        if (!"END".equals(newsCursor) && (topicIds == null || topicIds.isEmpty())) {
            newsList = fetchNewsWithCursor(newsCursor, newsLimit);
            hasMoreNews = newsList.size() > newsLimit;
            if (hasMoreNews) {
                newsList = newsList.subList(0, newsLimit);
                News lastNews = newsList.get(newsList.size() - 1);
                nextNewsCursor = PaginationUtils.generateCursor(lastNews.getPublishedAt(), lastNews.getId());
            }
        }

        return buildFeedResponse(posts, nextPostCursor, hasMorePosts, newsList, nextNewsCursor, hasMoreNews,
                currentUserId);
    }

    /**
     * Fan-out on Write trigger: Distribute post to followers and other eligible
     * users.
     * Made asynchronous to avoid blocking post creation flow.
     */
    @Async
    @Transactional
    public void fanOutToFollowers(Post post) {
        log.debug("Fan-out triggered for post: {} (author: {})", post.getId(), post.getUserId());

        // 1. Get follower IDs
        List<UserFollow> follows = userFollowRepository.findAllByFollowedId(post.getUserId());
        Set<UUID> followerIds = follows.stream()
                .map(UserFollow::getFollowerId)
                .collect(Collectors.toSet());

        // 2. Get global fanout target IDs (For MVP, exclude PUBLIC users with USER
        // role)
        List<UUID> broadUserIds = userRepository.findUserIdsForBroadFanout(
                post.getUserId(), User.UserRole.USER, ProfileVisibility.PUBLIC);

        // 3. Merge targets (Union of followers and broad targets)
        Set<UUID> targetUserIds = new HashSet<>(followerIds);
        targetUserIds.addAll(broadUserIds);

        // Ensure author is never included in fan-out
        targetUserIds.remove(post.getUserId());

        if (targetUserIds.isEmpty()) {
            log.debug("No users to fan-out to for post: {}", post.getId());
            return;
        }

        log.debug("Fan-out to {} users (Followers: {}, Broad Eligible: {})",
                targetUserIds.size(), followerIds.size(), broadUserIds.size());

        // 4. Create feed entries
        List<UserFeed> feedEntries = targetUserIds.stream()
                .map(targetId -> UserFeed.builder()
                        .userId(targetId)
                        .postId(post.getId())
                        .authorId(post.getUserId())
                        .score((double) post.getCreatedAt().toEpochMilli())
                        .reason(followerIds.contains(targetId) ? "FOLLOW" : "GLOBAL")
                        .createdAt(Instant.now())
                        .build())
                .toList();

        // 5. Save all new feed entries
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
