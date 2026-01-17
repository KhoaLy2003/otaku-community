package com.otaku.community.feature.favorite.controller;

import com.otaku.community.common.annotation.CurrentUserId;
import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.favorite.dto.CreateFavoriteRequest;
import com.otaku.community.feature.favorite.dto.FavoriteResponse;
import com.otaku.community.feature.favorite.dto.UpdateFavoriteRequest;
import com.otaku.community.feature.favorite.service.UserFavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
@Tag(name = "User Favorites", description = "Endpoints for managing user favorite anime/manga")
@RequiredArgsConstructor
public class UserFavoriteController {

    private final UserFavoriteService userFavoriteService;

    @PostMapping()
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add a favorite", description = "Add an anime or manga to your favorites list")
    public ResponseEntity<ApiResponse<FavoriteResponse>> addFavorite(
            @Valid @RequestBody CreateFavoriteRequest request,
            @CurrentUserId UUID userId) {

        FavoriteResponse response = userFavoriteService.addFavorite(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Added to favorites", response));
    }

    @DeleteMapping("/{favoriteId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Remove a favorite", description = "Remove an item from your favorites list")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @PathVariable UUID favoriteId,
            @CurrentUserId UUID userId) {

        userFavoriteService.removeFavorite(userId, favoriteId);
        return ResponseEntity.ok(ApiResponse.success("Removed from favorites successfully", null));
    }

    @PutMapping("/{favoriteId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update a favorite", description = "Update the note for a favorite item")
    public ResponseEntity<ApiResponse<FavoriteResponse>> updateFavorite(
            @PathVariable UUID favoriteId,
            @Valid @RequestBody UpdateFavoriteRequest request,
            @CurrentUserId UUID userId) {

        FavoriteResponse response = userFavoriteService.updateFavorite(userId, favoriteId, request);
        return ResponseEntity.ok(ApiResponse.success("Favorite updated successfully", response));
    }

    @GetMapping()
    @Operation(summary = "Get user favorites", description = "Get list of favorite anime/manga for a user")
    public ResponseEntity<ApiResponse<PageResponse<FavoriteResponse>>> getUserFavorites(
            @CurrentUserId UUID userId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {

        PageResponse<FavoriteResponse> response = userFavoriteService.getUserFavorites(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Favorites retrieved successfully", response));
    }
}
