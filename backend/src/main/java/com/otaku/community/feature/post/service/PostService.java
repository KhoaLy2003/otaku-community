package com.otaku.community.feature.post.service;

import com.otaku.community.common.dto.CursorInfo;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.dto.post.PostAuthorRecord;
import com.otaku.community.common.dto.post.PostResponseRecord;
import com.otaku.community.common.exception.BadRequestException;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.common.logging.LogExecutionTime;
import com.otaku.community.common.util.PaginationUtils;
import com.otaku.community.feature.activity.entity.ActivityTargetType;
import com.otaku.community.feature.activity.entity.ActivityType;
import com.otaku.community.feature.activity.event.ActivityEvent;
import com.otaku.community.feature.feed.service.FeedUpdateService;
import com.otaku.community.feature.interaction.dto.CommentResponse;
import com.otaku.community.feature.interaction.entity.Reaction;
import com.otaku.community.feature.interaction.repository.ReactionRepository;
import com.otaku.community.feature.interaction.service.InteractionService;
import com.otaku.community.feature.post.dto.CreatePostRequest;
import com.otaku.community.feature.post.dto.PostDetailResponse;
import com.otaku.community.feature.post.dto.PostMediaResponse;
import com.otaku.community.feature.post.dto.PostReferenceRequest;
import com.otaku.community.feature.post.dto.PostResponse;
import com.otaku.community.feature.post.dto.UpdatePostRequest;
import com.otaku.community.feature.post.dto.UserPostResponse;
import com.otaku.community.feature.post.entity.Post;
import com.otaku.community.feature.post.entity.PostReference;
import com.otaku.community.feature.post.entity.PostReferenceType;
import com.otaku.community.feature.post.entity.PostStats;
import com.otaku.community.feature.post.entity.PostStatus;
import com.otaku.community.feature.post.event.PostCreatedEvent;
import com.otaku.community.feature.post.mapper.PostMapper;
import com.otaku.community.feature.post.mapper.PostReferenceMapper;
import com.otaku.community.feature.post.repository.PostRepository;
import com.otaku.community.feature.topic.dto.TopicResponse;
import com.otaku.community.feature.topic.service.TopicService;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final PostMediaService postMediaService;
    private final PostStatsService postStatsService;
    private final TopicService topicService;
    private final InteractionService interactionService;
    private final UserService userService;
    private final ReactionRepository reactionRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final PostReferenceMapper postReferenceMapper;
    private final FeedUpdateService feedUpdateService;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    /**
     * Creates a new post
     */

    @Transactional
    @LogExecutionTime
    public PostResponse createPost(CreatePostRequest request, UUID userId) {
        log.debug("Creating new post with title: {}", request.getTitle());

        // Validate title is not empty (additional validation beyond @NotBlank)
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Post title cannot be empty");
        }

        // Get current user ID
        User user = userService.findById(userId);

        // Create post entity
        Post post = postMapper.toEntity(request);
        post.setUserId(userId);

        // Initialize post stats
        PostStats stats = PostStats.builder()
                .post(post)
                .build();
        post.setStats(stats);

        // Save post
        Post savedPost = postRepository.save(post);

        // Save post topic
        Set<UUID> newTopicIds = new HashSet<>(request.getTopicIds());
        topicService.associatePostWithTopics(savedPost, newTopicIds);

        // Handle references
        handleReferences(savedPost, request.getReferences());

        savedPost = postRepository.save(savedPost);

        log.debug("Created post with ID: {} for user: {}", savedPost.getId(), userId);
        eventPublisher.publishEvent(new ActivityEvent(userId, ActivityType.CREATE_POST, ActivityTargetType.POST,
                savedPost.getId().toString(), "Post title: " + savedPost.getTitle()));

        // Trigger Fan-out on Write via event (Decoupled and potentially Async)
        eventPublisher.publishEvent(new PostCreatedEvent(savedPost));

        // Notify feed update service for real-time updates (exclude the creator)
        feedUpdateService.notifyNewPost(user.getAuth0Id());

        // Build response with media
        PostResponse response = postMapper.toResponse(savedPost);

        // Set stats
        response.setLikesCount(stats.getLikeCount());
        response.setCommentCount(stats.getCommentCount());
        response.setReferences(savedPost.getReferences().stream()
                .map(postReferenceMapper::toResponse)
                .toList());

        return response;
    }

    /**
     * Updates an existing post
     */
    @Transactional
    public PostResponse updatePost(UUID postId, UpdatePostRequest request) {
        log.debug("Updating post with ID: {}", postId);

        // Find post and verify ownership
        Post post = findPostAndVerifyOwnership(postId);

        // Validate title if provided
        if (request.getTitle() != null && request.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Post title cannot be empty");
        }

        // Update post fields
        postMapper.updateEntity(request, post);

        // Update post topic
        post.getPostTopics().clear();
        postRepository.flush();
        Set<UUID> newTopicIds = new HashSet<>(request.getTopicIds());
        topicService.associatePostWithTopics(post, newTopicIds);

        // Save updated post
        Post updatedPost = postRepository.save(post);

        // Handle references
        handleReferences(updatedPost, request.getReferences());
        updatedPost = postRepository.save(updatedPost);

        log.debug("Updated post with ID: {}", postId);
        eventPublisher.publishEvent(new ActivityEvent(post.getUserId(), ActivityType.UPDATE_POST,
                ActivityTargetType.POST, postId.toString(), "Post ID: " + postId));

        PostResponse response = postMapper.toResponse(updatedPost);
        response.setReferences(updatedPost.getReferences().stream()
                .map(postReferenceMapper::toResponse)
                .toList());
        return response;
    }

    /**
     * Deletes a post (soft delete)
     */
    @Transactional
    public void deletePost(UUID postId) {
        log.debug("Deleting post with ID: {}", postId);

        // Find post and verify ownership
        Post post = findPostAndVerifyOwnership(postId);

        // Soft delete the post
        post.softDelete();
        postRepository.save(post);

        log.debug("Deleted post with ID: {}", postId);
        eventPublisher.publishEvent(new ActivityEvent(post.getUserId(), ActivityType.DELETE_POST,
                ActivityTargetType.POST, postId.toString(), "Post ID: " + postId));
    }

    /**
     * Retrieves detailed post information including comments, topics, and like
     * status
     */
    @Transactional(readOnly = true)
    @LogExecutionTime
    public PostDetailResponse getPostDetail(UUID postId, UUID userId) {
        log.debug("Retrieving detailed post information for ID: {}", postId);

        // Get the post (this handles soft delete check)
        Post post = postRepository.findByIdAndNotDeleted(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        // Get topics associated with this post
        List<TopicResponse> topics = topicService.getTopicsByPostId(postId);

        // Get comments for this post
        List<CommentResponse> comments = interactionService.getCommentsByPost(postId);

        // Get like status for current user
        Boolean isLikedByCurrentUser = null;
        if (userId != null) {
            isLikedByCurrentUser = interactionService.getLikeStatusForAnyPost(postId, userId).isLiked();
        }

        // Generate shareable URL
        String shareableUrl = generateShareableUrl(postId);

        // Get the basic post author response
        PostDetailResponse.PostAuthorResponse postAuthor = new PostDetailResponse.PostAuthorResponse(
                post.getUser().getId(),
                post.getUser().getUsername(),
                post.getUser().getAvatarUrl());

        // Get media
        List<PostMediaResponse> mediaResponses = postMediaService.getPostMedia(postId);

        // Get stats
        PostStats stats = postStatsService.getPostStats(postId);

        // Get thumbnail URL
        String thumbnailUrl = Optional.ofNullable(mediaResponses)
                .orElse(List.of())
                .stream()
                .filter(m -> Objects.equals(m.getOrderIndex(), 0))
                .map(PostMediaResponse::getMediaUrl)
                .findFirst()
                .orElse(null);

        // Build detailed response
        return PostDetailResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .thumbnailUrl(thumbnailUrl)
                .media(mediaResponses)
                .status(post.getStatus())
                .author(postAuthor)
                .topics(topics)
                .likesCount(stats.getLikeCount())
                .commentCount(stats.getCommentCount())
                .isLiked(isLikedByCurrentUser)
                .comments(comments)
                .references(post.getReferences().stream()
                        .map(postReferenceMapper::toResponse)
                        .toList())
                .shareableUrl(shareableUrl)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    /**
     * Generates a shareable URL for a post
     */
    private String generateShareableUrl(UUID postId) {
        return frontendUrl + "/posts/" + postId;
    }

    /**
     * Retrieves posts by user ID
     */

    @Transactional(readOnly = true)
    public Page<PostResponse> getPostsByUser(UUID userId, Pageable pageable) {
        log.debug("Retrieving posts for user: {}", userId);

        Page<Post> posts = postRepository.findByUserIdAndNotDeleted(userId, pageable);
        return posts.map(this::mapToResponseWithStats);
    }

    /**
     * Retrieves posts by user ID and status
     */
    @Transactional(readOnly = true)
    public Page<PostResponse> getPostsByUserAndStatus(UUID userId, PostStatus status, Pageable pageable) {
        log.debug("Retrieving posts for user: {} with status: {}", userId, status);

        Page<Post> posts = postRepository.findByUserIdAndStatusAndNotDeleted(userId, status, pageable);
        return posts.map(this::mapToResponseWithStats);
    }

    @Transactional(readOnly = true)
    public UserPostResponse getPostsByUserName(String userName, PostStatus status, String cursor, Integer limit) {
        log.debug("Retrieving posts for user: {} with status: {}, cursor: {}, limit: {}", userName, status, cursor,
                limit);

        User user = userService.getUserByUsername(userName);
        UUID userId = user.getId();

        int pageSize = PaginationUtils.validateAndGetPageSize(limit);
        CursorInfo cursorInfo = PaginationUtils.parseCursor(cursor);

        List<Post> posts = getPostsByUserWithCursor(userId, status, cursorInfo, pageSize + 1);

        boolean hasMore = posts.size() > pageSize;
        if (hasMore) {
            posts = posts.subList(0, pageSize);
        }

        String nextCursor = hasMore && !posts.isEmpty() ? PaginationUtils.generateCursor(posts.get(posts.size() - 1))
                : null;

        // Determine which posts are liked by the current user
        Set<UUID> likedPostIds = new HashSet<>();
        try {
            User currentUser = userService.findByAuth0Id();
            if (currentUser != null && !posts.isEmpty()) {
                List<UUID> postIds = posts.stream().map(Post::getId).toList();
                likedPostIds = reactionRepository.findLikedTargetIds(
                        currentUser.getId(),
                        Reaction.TargetType.POST,
                        Reaction.ReactionType.LIKE,
                        postIds);
            }
        } catch (Exception e) {
            // Ignored, user might not be authenticated
        }

        final Set<UUID> finalLikedPostIds = likedPostIds;
        List<PostResponseRecord> postResponses = posts.stream()
                .map(post -> toPostResponseRecord(post, finalLikedPostIds.contains(post.getId()))).toList();

        return UserPostResponse.builder()
                .posts(postResponses)
                .nextCursor(nextCursor)
                .hasMore(hasMore)
                .build();
    }

    /**
     * Publishes a draft post
     */
    public PostResponse publishPost(UUID postId) {
        log.debug("Publishing post with ID: {}", postId);

        // Find post and verify ownership
        Post post = findPostAndVerifyOwnership(postId);

        // Publish the post
        post.publish();
        Post publishedPost = postRepository.save(post);

        log.debug("Published post with ID: {}", postId);
        return mapToResponseWithStats(publishedPost);
    }

    /**
     * Converts a published post back to draft
     */
    public PostResponse makeDraft(UUID postId) {
        log.debug("Converting post to draft with ID: {}", postId);

        // Find post and verify ownership
        Post post = findPostAndVerifyOwnership(postId);

        // Make draft
        post.makeDraft();
        Post draftPost = postRepository.save(post);

        log.debug("Converted post to draft with ID: {}", postId);
        return mapToResponseWithStats(draftPost);
    }

    /**
     * Checks if current user owns the specified post
     */
    @Transactional(readOnly = true)
    public boolean isPostOwner(UUID postId) {
        User user = userService.findByAuth0Id();
        UUID userId = user.getId();
        return postRepository.existsByIdAndUserIdAndNotDeleted(postId, userId);
    }

    /**
     * Helper method to find post and verify ownership
     */
    private Post findPostAndVerifyOwnership(UUID postId) {
        Post post = postRepository.findByIdAndNotDeleted(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        User user = userService.findByAuth0Id();
        UUID userId = user.getId();
        if (!post.getUserId().equals(userId)) {
            throw new AccessDeniedException("You don't have permission to modify this post");
        }

        return post;
    }

    /**
     * Helper method to map Post to PostResponse with stats and media
     */
    private PostResponse mapToResponseWithStats(Post post) {
        PostResponse response = postMapper.toResponse(post);

        PostAuthorRecord author = new PostAuthorRecord(
                post.getUser().getId(),
                post.getUser().getUsername(),
                post.getUser().getAvatarUrl());
        response.setAuthor(author);

        // Get media
        List<PostMediaResponse> mediaResponses = postMediaService.getPostMedia(post.getId());
        response.setMedia(mediaResponses);

        // Set stats
        PostStats stats = postStatsService.getPostStats(post.getId());
        response.setLikesCount(stats.getLikeCount());
        response.setCommentCount(stats.getCommentCount());

        return response;
    }

    private PostResponseRecord toPostResponseRecord(Post post, Boolean isLiked) {
        return new PostResponseRecord(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getMedias() != null && !post.getMedias().isEmpty()
                        ? post.getMedias().get(0).getMediaUrl()
                        : null,
                new PostAuthorRecord(
                        post.getUser().getId(),
                        post.getUser().getUsername(),
                        post.getUser().getAvatarUrl()),
                post.getCreatedAt(),
                post.getStats().getLikeCount(),
                post.getStats().getCommentCount(),
                isLiked);
    }

    private List<Post> getPostsByUserWithCursor(UUID userId, PostStatus status, CursorInfo cursorInfo, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt", "id"));

        if (cursorInfo.createdAt() == null) {
            // First page
            if (status != null) {
                return postRepository.findByUserIdAndStatusAndNotDeleted(userId, status, pageable).getContent();
            } else {
                return postRepository.findByUserIdAndNotDeleted(userId, pageable).getContent();
            }
        } else {
            // Subsequent pages with cursor
            if (status != null) {
                return postRepository.findPostsByUserAndStatusAfterCursor(
                        userId, status, cursorInfo.createdAt(), cursorInfo.id(), pageable);
            } else {
                return postRepository.findPostsByUserAfterCursor(
                        userId, cursorInfo.createdAt(), cursorInfo.id(), pageable);
            }
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> getPostsByReference(String type, Long externalId, int page, int limit) {
        log.debug("Retrieving posts for reference: {}/{}", type, externalId);
        PostReferenceType refType = PostReferenceType.valueOf(type.toUpperCase());
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Post> postPage = postRepository.findByReference(refType, externalId, pageable);

        return PageResponse.of(
                postPage.getContent().stream()
                        .map(this::mapToResponseWithStats)
                        .toList(),
                page,
                limit,
                postPage.getTotalElements());
    }

    private void handleReferences(Post post, List<PostReferenceRequest> manualRefs) {
        // Clear existing references if it's an update
        post.getReferences().clear();

        // 1. Process manual references
        if (manualRefs != null) {
            for (var refReq : manualRefs) {
                PostReference ref = postReferenceMapper.toEntity(refReq);
                ref.setPost(post);
                ref.setAutoLinked(false);
                post.addReference(ref);
            }
        }
    }
}