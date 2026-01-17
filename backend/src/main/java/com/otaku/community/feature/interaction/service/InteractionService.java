package com.otaku.community.feature.interaction.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.exception.BadRequestException;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.feature.activity.entity.ActivityTargetType;
import com.otaku.community.feature.activity.entity.ActivityType;
import com.otaku.community.feature.activity.event.ActivityEvent;
import com.otaku.community.feature.interaction.dto.CommentResponse;
import com.otaku.community.feature.interaction.dto.CreateCommentRequest;
import com.otaku.community.feature.interaction.dto.LikeResponse;
import com.otaku.community.feature.interaction.dto.UpdateCommentRequest;
import com.otaku.community.feature.interaction.entity.Comment;
import com.otaku.community.feature.interaction.entity.Reaction;
import com.otaku.community.feature.interaction.mapper.InteractionMapper;
import com.otaku.community.feature.interaction.repository.CommentRepository;
import com.otaku.community.feature.interaction.repository.ReactionRepository;
import com.otaku.community.feature.media.dto.MediaUploadResponse;
import com.otaku.community.feature.media.service.MediaService;
import com.otaku.community.feature.notification.entity.Notification;
import com.otaku.community.feature.notification.listener.NotificationEventListener;
import com.otaku.community.feature.post.entity.Post;
import com.otaku.community.feature.post.entity.PostStats;
import com.otaku.community.feature.post.repository.PostRepository;
import com.otaku.community.feature.post.service.PostStatsService;
import com.otaku.community.feature.user.dto.UserSummaryResponse;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.service.UserFollowService;
import com.otaku.community.feature.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InteractionService {

    private final ReactionRepository reactionRepository;
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final PostStatsService postStatsService;
    private final InteractionMapper interactionMapper;
    private final UserService userService;
    private final UserFollowService userFollowService;
    private final MediaService mediaService;
    private final ApplicationEventPublisher eventPublisher;

    // ===== LIKE OPERATIONS =====

    /**
     * Like a post
     */
    @Transactional
    public LikeResponse likePost(UUID postId, UUID interactionUserId) {
        log.debug("User attempting to like post {}", postId);

        // Check if already liked
        if (reactionRepository.existsByUserIdAndTargetTypeAndTargetId(
                interactionUserId, Reaction.TargetType.POST, postId)) {
            throw new BadRequestException("Post is already liked by user");
        }

        // Create reaction record
        Reaction reaction = Reaction.builder()
                .userId(interactionUserId)
                .targetType(Reaction.TargetType.POST)
                .targetId(postId)
                .reactionType(Reaction.ReactionType.LIKE)
                .build();

        reactionRepository.save(reaction);

        // Update stats
        postStatsService.incrementLikeCount(postId);
        PostStats stats = postStatsService.getPostStats(postId);

        log.debug("User {} liked post {}", interactionUserId, postId);
        eventPublisher.publishEvent(new ActivityEvent(interactionUserId, ActivityType.LIKE_POST,
                ActivityTargetType.POST, postId.toString(), "Post ID: " + postId));

        // Publish Notification Event
        postRepository.findById(postId).ifPresent(post -> {
            if (!post.getUserId().equals(interactionUserId)) {
                eventPublisher.publishEvent(
                        new NotificationEventListener.NotificationEvent(
                                post.getUserId(),
                                interactionUserId,
                                Notification.NotificationType.LIKE,
                                postId,
                                Notification.TargetType.POST,
                                "liked your post"));
            }
        });

        return interactionMapper.toLikeResponse(postId, true, stats.getLikeCount().longValue());
    }

    /**
     * Unlike a post
     */
    @Transactional
    public LikeResponse unlikePost(UUID postId, UUID interactionUserId) {
        log.debug("User attempting to unlike post {}", postId);

        // Check if like exists
        if (!reactionRepository.existsByUserIdAndTargetTypeAndTargetId(
                interactionUserId, Reaction.TargetType.POST, postId)) {
            throw new BadRequestException("Post is not liked by user");
        }

        // Remove reaction record
        reactionRepository.deleteByUserIdAndTargetTypeAndTargetId(interactionUserId, Reaction.TargetType.POST, postId);

        // Update stats
        postStatsService.decrementLikeCount(postId);
        PostStats stats = postStatsService.getPostStats(postId);

        log.debug("User {} unliked post {}", interactionUserId, postId);
        eventPublisher.publishEvent(new ActivityEvent(interactionUserId, ActivityType.UNLIKE_POST,
                ActivityTargetType.POST, postId.toString(), "Post ID: " + postId));
        return interactionMapper.toLikeResponse(postId, false, stats.getLikeCount().longValue());
    }

    /**
     * Get like status for a post and user
     */
    @Transactional(readOnly = true)
    public LikeResponse getLikeStatus(UUID postId, UUID interactionUserId) {
        boolean isLiked = interactionUserId != null
                && reactionRepository.existsByUserIdAndTargetTypeAndTargetId(interactionUserId,
                Reaction.TargetType.POST, postId);

        PostStats stats = postStatsService.getPostStats(postId);
        return interactionMapper.toLikeResponse(postId, isLiked, stats.getLikeCount().longValue());
    }

    /**
     * Get like status for any post (published or draft) - used for post details
     */
    @Transactional(readOnly = true)
    public LikeResponse getLikeStatusForAnyPost(UUID postId, UUID userId) {
        boolean isLiked = userId != null
                && reactionRepository.existsByUserIdAndTargetTypeAndTargetId(userId, Reaction.TargetType.POST, postId);

        PostStats stats = postStatsService.getPostStats(postId);
        return interactionMapper.toLikeResponse(postId, isLiked, stats.getLikeCount().longValue());
    }

    /**
     * Get paginated users who liked a post
     */
    @Transactional(readOnly = true)
    public PageResponse<UserSummaryResponse> getPostLikes(UUID postId, UUID currentUserId, int page, int limit) {
        log.debug("Fetching likes for post {}", postId);

        // Verify post exists
        postRepository.findByIdAndNotDeleted(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Reaction> likesPage = reactionRepository.findByTargetTypeAndTargetIdAndReactionTypeOrderByCreatedAtDesc(
                Reaction.TargetType.POST, postId, Reaction.ReactionType.LIKE, pageable);

        if (likesPage.isEmpty()) {
            return PageResponse.of(Collections.emptyList(), page, limit, 0);
        }

        List<UUID> userIds = likesPage.getContent().stream()
                .map(Reaction::getUserId)
                .toList();

        return userFollowService.getUsersWithStatus(userIds, currentUserId, page, limit, likesPage.getTotalElements());
    }

    // ===== COMMENT OPERATIONS =====

    /**
     * Create a comment on a post with an optional image
     */
    @Transactional
    public CommentResponse createComment(CreateCommentRequest request,
                                         org.springframework.web.multipart.MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            MediaUploadResponse uploadResponse = mediaService.uploadMedia(file);
            request.setImageUrl(uploadResponse.getUrl());
        }
        return createComment(request);
    }

    /**
     * Create a comment on a post
     */
    @Transactional
    public CommentResponse createComment(CreateCommentRequest request) {
        log.debug("Creating comment on post {}", request.getPostId());

        // Verify post exists and is published
        Post post = getPublishedPost(request.getPostId());

        User user = userService.findByAuth0Id();

        Comment parentComment = commentRepository.findByIdAndUserId(request.getParentId(), user.getId())
                .orElse(null);

        // Validate that either content or image is present
        if ((request.getContent() == null || request.getContent().trim().isEmpty()) &&
                (request.getImageUrl() == null || request.getImageUrl().trim().isEmpty())) {
            throw new BadRequestException("Common content or image is required");
        }

        // Create comment
        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .content(request.getContent() != null ? request.getContent().trim() : null)
                .imageUrl(request.getImageUrl())
                .parent(parentComment)
                .build();

        comment = commentRepository.save(comment);

        // Update stats
        postStatsService.incrementCommentCount(request.getPostId());

        log.debug("User created comment {} on post {}", comment.getId(), request.getPostId());
        eventPublisher.publishEvent(
                new ActivityEvent(user.getId(), ActivityType.CREATE_COMMENT, ActivityTargetType.COMMENT,
                        comment.getId().toString(),
                        "Post title: " + post.getTitle() + ", Comment content: " + comment.getContent()));

        // Publish Notification Event
        if (!post.getUserId().equals(user.getId())) {
            eventPublisher.publishEvent(
                    new NotificationEventListener.NotificationEvent(
                            post.getUserId(),
                            user.getId(),
                            Notification.NotificationType.COMMENT,
                            post.getId(),
                            Notification.TargetType.POST,
                            "commented on your post"));
        }

        return interactionMapper.toCommentResponse(comment);
    }

    /**
     * Update a comment with an optional image
     */
    @Transactional
    public CommentResponse updateComment(UUID commentId, UpdateCommentRequest request, UUID interactionUserId,
                                         org.springframework.web.multipart.MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            MediaUploadResponse uploadResponse = mediaService.uploadMedia(file);
            request.setImageUrl(uploadResponse.getUrl());
        }
        return updateComment(commentId, request, interactionUserId);
    }

    /**
     * Update a comment (user can only update their own comments)
     */
    @Transactional
    public CommentResponse updateComment(UUID commentId, UpdateCommentRequest request, UUID interactionUserId) {
        log.debug("User updating comment {}", commentId);

        // Find comment and verify ownership
        Comment comment = commentRepository.findByIdAndUserId(commentId, interactionUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found or access denied"));

        // Validate that either content or image is present
        if ((request.getContent() == null || request.getContent().trim().isEmpty()) &&
                (request.getImageUrl() == null || request.getImageUrl().trim().isEmpty())) {
            throw new BadRequestException("Common content or image is required");
        }

        // Update content
        comment.updateComment(
                request.getContent() != null ? request.getContent().trim() : null,
                request.getImageUrl());
        comment = commentRepository.save(comment);

        log.debug("User {} updated comment {}", interactionUserId, commentId);
        eventPublisher.publishEvent(new ActivityEvent(interactionUserId, ActivityType.UPDATE_COMMENT,
                ActivityTargetType.COMMENT, commentId.toString(), "Post title: " + comment.getPost().getTitle()));
        return interactionMapper.toCommentResponse(comment);
    }

    /**
     * Delete a comment (soft delete)
     */
    @Transactional
    public void deleteComment(UUID commentId, UUID interactionUserId) {
        log.debug("User deleting comment {}", commentId);

        // Find comment and verify ownership
        Comment comment = commentRepository.findByIdAndUserId(commentId, interactionUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found or access denied"));

        // Soft delete the comment
        comment.softDelete();
        commentRepository.save(comment);

        // Update stats
        postStatsService.decrementCommentCount(comment.getPost().getId());

        log.debug("User {} deleted comment {}", interactionUserId, commentId);
        eventPublisher.publishEvent(new ActivityEvent(interactionUserId, ActivityType.DELETE_COMMENT,
                ActivityTargetType.COMMENT, commentId.toString(), "Post title: " + comment.getPost().getTitle()));
    }

    /**
     * Get all comments for a post
     */
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByPost(UUID postId) {
        // Verify post exists and is not soft deleted
        if (!postRepository.findByIdAndNotDeleted(postId).isPresent()) {
            throw new ResourceNotFoundException("Post not found");
        }

        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        return interactionMapper.toCommentResponseList(comments);
    }

    // ===== HELPER METHODS =====

    /**
     * Get a published post or throw exception
     */
    private Post getPublishedPost(UUID postId) {
        return postRepository.findById(postId)
                .filter(post -> post.getDeletedAt() == null) // Not soft deleted
                .filter(Post::isPublished) // Must be published
                .orElseThrow(() -> new ResourceNotFoundException("Post not found or not published"));
    }
}