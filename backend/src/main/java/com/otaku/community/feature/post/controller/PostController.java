package com.otaku.community.feature.post.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.post.dto.*;
import com.otaku.community.feature.post.service.impl.PostMediaServiceImpl;
import com.otaku.community.feature.post.entity.PostStatus;
import com.otaku.community.feature.post.service.impl.PostServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @PostMapping(consumes = "multipart/form-data")
    //@PreAuthorize("isAuthenticated()")
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
            @Parameter(description = "Topic IDs") @RequestParam(value = "topicIds", required = false) List<UUID> topicIds) {
        log.info("Creating new post with title: {} and {} files", title, files != null ? files.size() : 0);
        
        // Create basic post first
        CreatePostRequest request = CreatePostRequest.builder()
                .title(title)
                .content(content)
                .status(PostStatus.valueOf(status.toUpperCase()))
                .topicIds(topicIds)
                .build();
        
        PostResponse response = postServiceImpl.createPost(request);
        
        // Upload files if provided
        if (files != null && !files.isEmpty()) {
            List<PostMediaResponse> mediaResponses = postMediaServiceImpl.uploadPostMedia(response.getId(), files);
            response.setMedia(mediaResponses);
        }
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Post created successfully", response));
    }

    @PutMapping("/{postId}")
    //@PreAuthorize("isAuthenticated()")
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
        log.info("Updating post with ID: {}", postId);
        
        PostResponse response = postServiceImpl.updatePost(postId, request);
        return ResponseEntity.ok(ApiResponse.success("Post updated successfully", response));
    }

    @DeleteMapping("/{postId}")
    //@PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete a post", description = "Soft deletes a post owned by the current user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not post owner"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @Parameter(description = "Post ID") @PathVariable UUID postId) {
        log.info("Deleting post with ID: {}", postId);
        
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
        log.info("Retrieving detailed post information for ID: {}", postId);
        
        PostDetailResponse response = postServiceImpl.getPostDetail(postId);
        return ResponseEntity.ok(ApiResponse.success("Post details retrieved successfully", response));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get posts by user", description = "Retrieves posts by a specific user with pagination")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Posts retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getPostsByUser(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @Parameter(description = "Post status filter") @RequestParam(required = false) PostStatus status,
            @Parameter(description = "Page number (1-based)") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "Page size (max 20)") @RequestParam(defaultValue = "20") int size) {
        log.info("Retrieving posts for user: {} with status: {} - page: {}, size: {}", userId, status, page, size);
        
        // Limit page size to 20
        size = Math.min(size, 20);
        
        // Convert to 0-based page for Spring Data
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PostResponse> posts;
        
        if (status != null) {
            posts = postServiceImpl.getPostsByUserAndStatus(userId, status, pageable);
        } else {
            posts = postServiceImpl.getPostsByUser(userId, pageable);
        }
        
        PageResponse<PostResponse> response = PageResponse.of(
                posts.getContent(),
                page,
                posts.getSize(),
                posts.getTotalElements()
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{postId}/publish")
    //@PreAuthorize("isAuthenticated()")
    @Operation(summary = "Publish a post", description = "Publishes a draft post, making it visible in feeds")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post published successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not post owner"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<PostResponse>> publishPost(
            @Parameter(description = "Post ID") @PathVariable UUID postId) {
        log.info("Publishing post with ID: {}", postId);
        
        PostResponse response = postServiceImpl.publishPost(postId);
        return ResponseEntity.ok(ApiResponse.success("Post published successfully", response));
    }

    @PostMapping("/{postId}/draft")
    //@PreAuthorize("isAuthenticated()")
    @Operation(summary = "Convert post to draft", description = "Converts a published post back to draft status")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post converted to draft successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not post owner"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<PostResponse>> makeDraft(
            @Parameter(description = "Post ID") @PathVariable UUID postId) {
        log.info("Converting post to draft with ID: {}", postId);
        
        PostResponse response = postServiceImpl.makeDraft(postId);
        return ResponseEntity.ok(ApiResponse.success("Post converted to draft successfully", response));
    }

    @GetMapping("/{postId}/owner")
    //@PreAuthorize("isAuthenticated()")
    @Operation(summary = "Check post ownership", description = "Checks if the current user owns the specified post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Ownership check completed"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public ResponseEntity<ApiResponse<Boolean>> isPostOwner(
            @Parameter(description = "Post ID") @PathVariable UUID postId) {
        log.info("Checking ownership for post with ID: {}", postId);
        
        boolean isOwner = postServiceImpl.isPostOwner(postId);
        return ResponseEntity.ok(ApiResponse.success(isOwner));
    }

    // ===== MEDIA ENDPOINTS =====

    @PostMapping("/{postId}/media/upload")
    //@PreAuthorize("isAuthenticated()")
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
        log.info("Uploading {} media files for post {}", files.size(), postId);
        
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
    //@PreAuthorize("isAuthenticated()")
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
        log.info("Adding {} media items for post {}", mediaRequests.size(), postId);
        
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
        log.info("Retrieving media for post {}", postId);
        
        List<PostMediaResponse> responses = postMediaServiceImpl.getPostMedia(postId);
        return ResponseEntity.ok(ApiResponse.success("Media retrieved successfully", responses));
    }

    @PutMapping("/{postId}/media/order")
    //@PreAuthorize("isAuthenticated()")
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
        log.info("Updating media order for post {}", postId);
        
        // Verify post ownership
        if (!postServiceImpl.isPostOwner(postId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied - not post owner"));
        }
        
        List<PostMediaResponse> responses = postMediaServiceImpl.updateMediaOrder(postId, mediaIds);
        return ResponseEntity.ok(ApiResponse.success("Media order updated successfully", responses));
    }

    @DeleteMapping("/{postId}/media/{mediaId}")
    //@PreAuthorize("isAuthenticated()")
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
        log.info("Deleting media {} from post {}", mediaId, postId);
        
        // Verify post ownership
        if (!postServiceImpl.isPostOwner(postId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied - not post owner"));
        }
        
        postMediaServiceImpl.deletePostMedia(postId, mediaId);
        return ResponseEntity.ok(ApiResponse.success("Media deleted successfully", null));
    }
}