package com.otaku.community.feature.manga.controller;

import com.otaku.community.common.annotation.CurrentUserId;
import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.manga.dto.translation.PostTranslationCommentRequest;
import com.otaku.community.feature.manga.dto.translation.ReorderPagesRequest;
import com.otaku.community.feature.manga.dto.translation.TranslationCommentResponse;
import com.otaku.community.feature.manga.dto.translation.TranslationDetailResponse;
import com.otaku.community.feature.manga.dto.translation.TranslationResponse;
import com.otaku.community.feature.manga.dto.translation.TranslationStatsResponse;
import com.otaku.community.feature.manga.dto.translation.UpdateTranslationRequest;
import com.otaku.community.feature.manga.dto.translation.UserTranslationsResponse;
import com.otaku.community.feature.manga.service.TranslationService;
import com.otaku.community.feature.manga.service.TranslationSocialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/v1/translations")
@RequiredArgsConstructor
@Tag(name = "Translation", description = "Manga translation management APIs")
public class TranslationController {

    private final TranslationService translationService;
    private final TranslationSocialService socialService;

    @GetMapping("/me")
    @Operation(summary = "Get my translations", description = "Get all translations created by the current user")
    public ResponseEntity<ApiResponse<List<TranslationResponse>>> getMyTranslations(@CurrentUserId UUID userId) {
        List<TranslationResponse> response = translationService.getMyTranslations(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get translation detail", description = "Get metadata and pages for a translation")
    public ResponseEntity<ApiResponse<TranslationDetailResponse>> getTranslation(@PathVariable UUID id) {
        TranslationDetailResponse response = translationService.getTranslationDetail(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    //TODO: review
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update translation", description = "Update metadata for a translation (Owner only)")
    public ResponseEntity<ApiResponse<TranslationResponse>> updateTranslation(@PathVariable UUID id,
                                                                              @RequestBody UpdateTranslationRequest request,
                                                                              @CurrentUserId UUID userId) {
        TranslationResponse response = translationService.updateTranslation(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Translation updated successfully", response));
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Publish translation", description = "Make a draft translation public (Owner only)")
    public ResponseEntity<ApiResponse<TranslationResponse>> publishTranslation(@PathVariable UUID id,
                                                                               @CurrentUserId UUID userId) {
        TranslationResponse response = translationService.publishTranslation(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Translation published successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete translation", description = "Soft-delete a translation (Owner only)")
    public ResponseEntity<ApiResponse<Void>> deleteTranslation(@PathVariable UUID id, @CurrentUserId UUID userId) {
        translationService.deleteTranslation(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Translation deleted successfully", null));
    }

    @PutMapping("/{id}/pages/reorder")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Reorder pages", description = "Change the order of manga pages (Owner only, Draft only)")
    public ResponseEntity<ApiResponse<Void>> reorderPages(@PathVariable UUID id,
                                                          @RequestBody ReorderPagesRequest request,
                                                          @CurrentUserId UUID userId) {
        translationService.reorderPages(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Pages reordered successfully", null));
    }

    // --- Public Translation Endpoints ---

    @GetMapping("/latest")
    @Operation(summary = "Get latest translations", description = "Get recently published translations across all manga")
    public ResponseEntity<ApiResponse<List<TranslationResponse>>> getLatest(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<TranslationResponse> response = socialService.getLatestTranslations(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending translations", description = "Get trending translations based on views and likes")
    public ResponseEntity<ApiResponse<List<TranslationResponse>>> getTrending(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<TranslationResponse> response = socialService.getTrendingTranslations(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/user/{username}")
    @Operation(summary = "Get user translations", description = "Get all translations and aggregate stats for a specific user")
    public ResponseEntity<ApiResponse<UserTranslationsResponse>> getUserTranslations(
            @PathVariable String username) {
        var response = socialService.getUserTranslations(username);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // --- Social Endpoints ---

    @PostMapping("/{id}/views")
    @Operation(summary = "Register view", description = "Increment the view count for a translation")
    public ResponseEntity<ApiResponse<TranslationStatsResponse>> registerView(@PathVariable UUID id) {
        socialService.incrementViewCount(id);
        return ResponseEntity.ok(ApiResponse.success(socialService.getStatsResponse(id)));
    }

    @PostMapping("/{id}/reactions")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Toggle upvote", description = "Add or remove a like from a translation")
    public ResponseEntity<ApiResponse<TranslationStatsResponse>> toggleUpvote(
            @PathVariable UUID id,
            @CurrentUserId UUID userId) {
        socialService.toggleUpvote(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Success", socialService.getStatsResponse(id)));
    }

    @GetMapping("/{id}/like-status")
    @Operation(summary = "Get like status", description = "Check if the current user has liked the translation")
    public ResponseEntity<ApiResponse<Boolean>> getLikeStatus(
            @PathVariable UUID id,
            @CurrentUserId UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(socialService.getLikeStatus(id, userId)));
    }

    @GetMapping("/{id}/comments")
    @Operation(summary = "Get comments", description = "Get paginated comments for a translation")
    public ResponseEntity<ApiResponse<PageResponse<TranslationCommentResponse>>> getComments(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        PageResponse<TranslationCommentResponse> response = socialService.getComments(page, limit, id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Post comment", description = "Post a new comment or reply to a translation")
    public ResponseEntity<ApiResponse<TranslationCommentResponse>> postComment(
            @PathVariable UUID id,
            @CurrentUserId UUID userId,
            @RequestBody PostTranslationCommentRequest request) {
        TranslationCommentResponse response = socialService.postComment(id, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Comment posted successfully", response));
    }
}
