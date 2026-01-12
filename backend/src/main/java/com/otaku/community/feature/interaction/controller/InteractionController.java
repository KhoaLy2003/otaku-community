package com.otaku.community.feature.interaction.controller;

import com.otaku.community.common.annotation.CurrentUserId;
import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.interaction.dto.CommentResponse;
import com.otaku.community.feature.interaction.dto.CreateCommentRequest;
import com.otaku.community.feature.interaction.dto.LikeRequest;
import com.otaku.community.feature.interaction.dto.LikeResponse;
import com.otaku.community.feature.interaction.dto.UpdateCommentRequest;
import com.otaku.community.feature.interaction.service.InteractionService;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Interactions", description = "Post interactions (likes and comments)")
public class InteractionController {

    private final InteractionService interactionService;

    // ===== LIKE ENDPOINTS =====

    @PostMapping("/likes")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Like a post", description = "Add a like to a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Post liked successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Post already liked or invalid request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<LikeResponse>> likePost(
            @Valid @RequestBody LikeRequest request,
            @CurrentUserId UUID interactionUserId) {

        LikeResponse response = interactionService.likePost(request.getPostId(), interactionUserId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Post liked successfully", response));
    }

    @DeleteMapping("/likes/{postId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Unlike a post", description = "Remove a like from a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post unliked successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Post not liked or invalid request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<LikeResponse>> unlikePost(
            @Parameter(description = "Post ID") @PathVariable UUID postId,
            @CurrentUserId UUID interactionUserId) {

        LikeResponse response = interactionService.unlikePost(postId, interactionUserId);

        return ResponseEntity.ok(ApiResponse.success("Post unliked successfully", response));
    }

    @GetMapping("/likes/{postId}")
    @Operation(summary = "Get like status", description = "Get like status for a post (works for both authenticated and guest users)")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Like status retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<LikeResponse>> getLikeStatus(
            @Parameter(description = "Post ID") @PathVariable UUID postId,
            @CurrentUserId UUID interactionUserId) {
        LikeResponse response = interactionService.getLikeStatus(postId, interactionUserId);

        return ResponseEntity.ok(ApiResponse.success("Like status retrieved successfully", response));
    }

    // ===== COMMENT ENDPOINTS =====

    @PostMapping("/comments")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a comment", description = "Add a comment to a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Comment created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid comment data"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @Valid @RequestBody CreateCommentRequest request) {

        CommentResponse response = interactionService.createComment(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment created successfully", response));
    }

    @PostMapping(value = "/comments", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a comment with image", description = "Add a comment (text and/or image) to a post")
    public ResponseEntity<ApiResponse<CommentResponse>> createCommentMultipart(
            @RequestParam("postId") UUID postId,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "parentId", required = false) UUID parentId,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file) {

        CreateCommentRequest request = new CreateCommentRequest(postId, content, null, parentId);
        CommentResponse response = interactionService.createComment(request, file);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment created successfully", response));
    }

    @PutMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update a comment", description = "Update user's own comment")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Comment updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid comment data"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Not authorized to update this comment"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Comment not found")
    })
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @Parameter(description = "Comment ID") @PathVariable UUID commentId,
            @Valid @RequestBody UpdateCommentRequest request,
            @CurrentUserId UUID interactionUserId) {

        CommentResponse response = interactionService.updateComment(commentId, request, interactionUserId);

        return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", response));
    }

    @PutMapping(value = "/comments/{commentId}", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update a comment with image", description = "Update user's own comment (text and/or image)")
    public ResponseEntity<ApiResponse<CommentResponse>> updateCommentMultipart(
            @PathVariable UUID commentId,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @CurrentUserId UUID interactionUserId) {

        UpdateCommentRequest request = new UpdateCommentRequest(content, null);
        CommentResponse response = interactionService.updateComment(commentId, request, interactionUserId,
                file);

        return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", response));
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete a comment", description = "Delete user's own comment (soft delete)")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Comment deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Not authorized to delete this comment"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Comment not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @Parameter(description = "Comment ID") @PathVariable UUID commentId,
            @CurrentUserId UUID interactionUserId) {

        interactionService.deleteComment(commentId, interactionUserId);

        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }

    @GetMapping("/posts/{postId}/comments")
    @Operation(summary = "Get post comments", description = "Get all comments for a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Comments retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getPostComments(
            @Parameter(description = "Post ID") @PathVariable UUID postId) {

        List<CommentResponse> response = interactionService.getCommentsByPost(postId);
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved successfully", response));
    }
}