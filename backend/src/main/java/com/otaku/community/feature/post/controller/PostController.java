package com.otaku.community.feature.post.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.otaku.community.common.annotation.CurrentUserId;
import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.interaction.service.InteractionService;
import com.otaku.community.feature.post.dto.CreatePostRequest;
import com.otaku.community.feature.post.dto.PostDetailResponse;
import com.otaku.community.feature.post.dto.PostMediaRequest;
import com.otaku.community.feature.post.dto.PostMediaResponse;
import com.otaku.community.feature.post.dto.PostReferenceRequest;
import com.otaku.community.feature.post.dto.PostResponse;
import com.otaku.community.feature.post.dto.UpdatePostRequest;
import com.otaku.community.feature.post.dto.UserMediaResponse;
import com.otaku.community.feature.post.dto.UserPostResponse;
import com.otaku.community.feature.post.entity.PostStatus;
import com.otaku.community.feature.post.service.impl.PostMediaServiceImpl;
import com.otaku.community.feature.post.service.impl.PostServiceImpl;
import com.otaku.community.feature.user.dto.UserSummaryDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Posts", description = "Post management endpoints")
public class PostController {

    private final PostServiceImpl postServiceImpl;
    private final PostMediaServiceImpl postMediaServiceImpl;
    private final InteractionService interactionService;

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a new post with file uploads", description = "Creates a new post with uploaded media files")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Post created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data or files"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @Parameter(description = "Post title") @RequestParam String title,
            @Parameter(description = "Post content") @RequestParam(required = false) String content,
            @Parameter(description = "Post status") @RequestParam(defaultValue = "DRAFT") String status,
            @Parameter(description = "Media files") @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @Parameter(description = "Topic IDs") @RequestParam(value = "topicIds", required = false) List<UUID> topicIds,
            @Parameter(description = "Post references as JSON string") @RequestParam(value = "referencesJson", required = false) String referencesJson) {
        log.debug("Creating new post with title: {} and {} files", title, files != null ? files.size() : 0);

        List<PostReferenceRequest> references = null;
        if (referencesJson != null && !referencesJson.isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                references = mapper.readValue(referencesJson, new TypeReference<>() {
                });
            } catch (Exception e) {
                log.warn("Failed to parse referencesJson: {}", e.getMessage());
            }
        }

        // Create basic post first
        CreatePostRequest request = CreatePostRequest.builder()
                .title(title)
                .content(content)
                .status(PostStatus.valueOf(status.toUpperCase()))
                .topicIds(topicIds)
                .references(references)
                .build();

        PostResponse response = postServiceImpl.createPost(request);

        // Upload files if provided
        if (files != null && !files.isEmpty()) {
            List<PostMediaResponse> mediaResponses = postMediaServiceImpl.uploadPostMedia(response.getId(),
                    files);
            response.setMedia(mediaResponses);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Post created successfully", response));
    }

    @PutMapping("/{postId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update a post", description = "Updates an existing post owned by the current user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not post owner"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
            @Parameter(description = "Post ID") @PathVariable UUID postId,
            @Valid @RequestBody UpdatePostRequest request) {
        log.debug("Updating post with ID: {}", postId);

        PostResponse response = postServiceImpl.updatePost(postId, request);
        return ResponseEntity.ok(ApiResponse.success("Post updated successfully", response));
    }

    @DeleteMapping("/{postId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete a post", description = "Soft deletes a post owned by the current user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not post owner"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @Parameter(description = "Post ID") @PathVariable UUID postId) {
        log.debug("Deleting post with ID: {}", postId);

        postServiceImpl.deletePost(postId);
        return ResponseEntity.ok(ApiResponse.success("Post deleted successfully", null));
    }

    @GetMapping("/{postId}/detail")
    @Operation(summary = "Get detailed post information", description = "Retrieves complete post details including comments, topics, and like status")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post details retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<PostDetailResponse>> getPostDetail(
            @Parameter(description = "Post ID") @PathVariable UUID postId) {
        log.debug("Retrieving detailed post information for ID: {}", postId);

        PostDetailResponse response = postServiceImpl.getPostDetail(postId);
        return ResponseEntity.ok(ApiResponse.success("Post details retrieved successfully", response));
    }

    @GetMapping("/user/{username}")
    @Operation(summary = "Get posts by user", description = "Retrieves posts by a specific user with cursor-based pagination")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Posts retrieved successfully")
    })
    public ResponseEntity<ApiResponse<UserPostResponse>> getPostsByUser(
            @Parameter(description = "Username") @PathVariable String username,
            @Parameter(description = "Post status filter") @RequestParam(required = false) PostStatus status,
            @Parameter(description = "Cursor for pagination") @RequestParam(required = false) String cursor,
            @Parameter(description = "Page size") @RequestParam(required = false) Integer limit) {
        log.debug("Retrieving posts for user: {} with status: {}, cursor: {}, limit: {}", username, status,
                cursor, limit);

        UserPostResponse response = postServiceImpl.getPostsByUserName(username, status, cursor, limit);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/user/{username}/media")
    @Operation(summary = "Get user media", description = "Retrieves all media uploaded by a specific user with cursor-based pagination")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Media retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<ApiResponse<UserMediaResponse>> getUserMedia(
            @Parameter(description = "Username") @PathVariable String username,
            @Parameter(description = "Cursor for pagination") @RequestParam(required = false) String cursor,
            @Parameter(description = "Page size") @RequestParam(required = false) Integer limit,
            @CurrentUserId UUID userId) {
        log.debug("Retrieving media for user: {} with cursor: {}, limit: {}", username, cursor, limit);

        UserMediaResponse response = postMediaServiceImpl.getUserMedia(userId, cursor, limit);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{postId}/publish")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Publish a post", description = "Publishes a draft post, making it visible in feeds")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post published successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not post owner"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<PostResponse>> publishPost(
            @Parameter(description = "Post ID") @PathVariable UUID postId) {
        log.debug("Publishing post with ID: {}", postId);

        PostResponse response = postServiceImpl.publishPost(postId);
        return ResponseEntity.ok(ApiResponse.success("Post published successfully", response));
    }

    @PostMapping("/{postId}/draft")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Convert post to draft", description = "Converts a published post back to draft status")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post converted to draft successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not post owner"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<PostResponse>> makeDraft(
            @Parameter(description = "Post ID") @PathVariable UUID postId) {
        log.debug("Converting post to draft with ID: {}", postId);

        PostResponse response = postServiceImpl.makeDraft(postId);
        return ResponseEntity.ok(ApiResponse.success("Post converted to draft successfully", response));
    }

    @GetMapping("/{postId}/owner")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Check post ownership", description = "Checks if the current user owns the specified post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Ownership check completed"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public ResponseEntity<ApiResponse<Boolean>> isPostOwner(
            @Parameter(description = "Post ID") @PathVariable UUID postId) {
        log.debug("Checking ownership for post with ID: {}", postId);

        boolean isOwner = postServiceImpl.isPostOwner(postId);
        return ResponseEntity.ok(ApiResponse.success(isOwner));
    }

    @GetMapping("/{postId}/likes")
    @Operation(summary = "Get post likes", description = "Retrieves a paginated list of users who liked the post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Likes retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<PageResponse<UserSummaryDto>>> getPostLikes(
            @Parameter(description = "Post ID") @PathVariable UUID postId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @CurrentUserId UUID currentUserId) {
        log.debug("Retrieving likes for post: {} (page: {}, limit: {})", postId, page, limit);

        PageResponse<UserSummaryDto> response = interactionService.getPostLikes(postId, currentUserId, page,
                limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // ===== MEDIA ENDPOINTS =====

    @PostMapping("/{postId}/media/upload")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload media files for a post", description = "Uploads multiple media files (images, videos, GIFs) for a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Media uploaded successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid file or request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not post owner"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<List<PostMediaResponse>>> uploadPostMedia(
            @Parameter(description = "Post ID") @PathVariable UUID postId,
            @Parameter(description = "Media files to upload") @RequestParam("files") List<MultipartFile> files) {
        log.debug("Uploading {} media files for post {}", files.size(), postId);

        // Verify post ownership
        if (!postServiceImpl.isPostOwner(postId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied - not post owner"));
        }

        List<PostMediaResponse> responses = postMediaServiceImpl.uploadPostMedia(postId, files);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Media uploaded successfully", responses));
    }

    @PostMapping("/{postId}/media")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add media from URLs", description = "Adds media to a post from existing URLs")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Media added successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not post owner"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<List<PostMediaResponse>>> addPostMedia(
            @Parameter(description = "Post ID") @PathVariable UUID postId,
            @Valid @RequestBody List<PostMediaRequest> mediaRequests) {
        log.debug("Adding {} media items for post {}", mediaRequests.size(), postId);

        // Verify post ownership
        if (!postServiceImpl.isPostOwner(postId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied - not post owner"));
        }

        List<PostMediaResponse> responses = postMediaServiceImpl.addPostMediaFromUrls(postId, mediaRequests);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Media added successfully", responses));
    }

    @GetMapping("/{postId}/media")
    @Operation(summary = "Get post media", description = "Retrieves all media for a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Media retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<List<PostMediaResponse>>> getPostMedia(
            @Parameter(description = "Post ID") @PathVariable UUID postId) {
        log.debug("Retrieving media for post {}", postId);

        List<PostMediaResponse> responses = postMediaServiceImpl.getPostMedia(postId);
        return ResponseEntity.ok(ApiResponse.success("Media retrieved successfully", responses));
    }

    // TODO: review
    @PutMapping("/{postId}/media/order")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update media order", description = "Updates the display order of media items in a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Media order updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not post owner"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<List<PostMediaResponse>>> updateMediaOrder(
            @Parameter(description = "Post ID") @PathVariable UUID postId,
            @Parameter(description = "Ordered list of media IDs") @RequestBody List<UUID> mediaIds) {
        log.debug("Updating media order for post {}", postId);

        // Verify post ownership
        if (!postServiceImpl.isPostOwner(postId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied - not post owner"));
        }

        List<PostMediaResponse> responses = postMediaServiceImpl.updateMediaOrder(postId, mediaIds);
        return ResponseEntity.ok(ApiResponse.success("Media order updated successfully", responses));
    }

    @DeleteMapping("/{postId}/media/{mediaId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete post media", description = "Deletes a specific media item from a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Media deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not post owner"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post or media not found")
    })
    public ResponseEntity<ApiResponse<Void>> deletePostMedia(
            @Parameter(description = "Post ID") @PathVariable UUID postId,
            @Parameter(description = "Media ID") @PathVariable UUID mediaId) {
        log.debug("Deleting media {} from post {}", mediaId, postId);

        // Verify post ownership
        if (!postServiceImpl.isPostOwner(postId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied - not post owner"));
        }

        postMediaServiceImpl.deletePostMedia(postId, mediaId);
        return ResponseEntity.ok(ApiResponse.success("Media deleted successfully", null));
    }
}