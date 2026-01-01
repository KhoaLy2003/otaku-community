package com.otaku.community.feature.user.controller;

import com.otaku.community.common.annotation.CurrentUserId;
import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.notification.service.NotificationService;
import com.otaku.community.feature.user.dto.UpdateUserRequest;
import com.otaku.community.feature.user.dto.UserProfileResponse;
import com.otaku.community.feature.user.dto.UserResponse;
import com.otaku.community.feature.user.dto.UserSummaryDto;
import com.otaku.community.feature.user.dto.UserSyncRequest;
import com.otaku.community.feature.user.dto.UserSyncResponse;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.service.UserFollowService;
import com.otaku.community.feature.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

    private final UserService userService;
    private final UserFollowService userFollowService;
    private final NotificationService notificationService;

    @GetMapping("/username/{username}")
    @Operation(summary = "Get user profile by username", description = "Retrieves a user's public profile by their username")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserProfileByUsername(username)));
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update user profile", description = "Updates the authenticated user's profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateUser(request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @GetMapping("/search")
    @Operation(summary = "Search users", description = "Searches for users by username")
    public ResponseEntity<PageResponse<UserResponse>> searchUsers(
            @RequestParam String q,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {

        return ResponseEntity.ok(userService.searchUsers(q, page, limit));
    }

    @PostMapping("/sync")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Sync user with Auth0", description = "Synchronizes user data between Auth0 and the database")
    public ResponseEntity<ApiResponse<UserSyncResponse>> syncUser(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UserSyncRequest request) {

        // Verify the auth0Id matches the JWT subject
        String jwtSubject = jwt.getSubject();
        if (!jwtSubject.equals(request.getAuth0Id())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Auth0 ID mismatch"));
        }

        // Check if this is a new user
        boolean isNewUser = userService.findByAuth0IdOptional(request.getAuth0Id()).isEmpty();

        UserSyncResponse response = userService.syncUserFromAuth0(
                request.getAuth0Id(),
                request.getEmail(),
                request.getUsername(),
                request.getAvatarUrl());
        response.setNewUser(isNewUser);
        response.setUnreadNotificationCount(notificationService.getUnreadCount(response.getId()).getCount());

        return ResponseEntity.ok(ApiResponse.success(
                isNewUser ? "User created successfully" : "User synchronized successfully",
                response));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user", description = "Gets the currently authenticated user's profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UserResponse response = userService.getCurrentUserResponse();
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", response));
    }

    // --- Follow Endpoints ---

    @PostMapping("/{id}/follow")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Follow user", description = "Follows a user")
    public ResponseEntity<ApiResponse<Void>> followUser(@CurrentUserId UUID currentUserId, @PathVariable UUID id) {
        userFollowService.followUser(currentUserId, id);
        return ResponseEntity.ok(ApiResponse.success("User followed successfully", null));
    }

    @DeleteMapping("/{id}/follow")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Unfollow user", description = "Unfollows a user")
    public ResponseEntity<ApiResponse<Void>> unfollowUser(@CurrentUserId UUID currentUserId, @PathVariable UUID id) {
        userFollowService.unfollowUser(currentUserId, id);
        return ResponseEntity.ok(ApiResponse.success("User unfollowed successfully", null));
    }

    @GetMapping("/{id}/followers")
    @Operation(summary = "Get followers list", description = "Retrieves a paginated list of followers for a user")
    public ResponseEntity<ApiResponse<PageResponse<UserSummaryDto>>> getFollowers(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal Jwt jwt) {

        UUID currentUserId = null;
        if (jwt != null) {
            currentUserId = userService.findByAuth0IdOptional(jwt.getSubject())
                    .map(User::getId)
                    .orElse(null);
        }

        PageResponse<UserSummaryDto> response = userFollowService.getFollowersWithStatus(
                id, currentUserId, page, limit);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/following")
    @Operation(summary = "Get following list", description = "Retrieves a paginated list of users that the specified user is following")
    public ResponseEntity<ApiResponse<PageResponse<UserSummaryDto>>> getFollowing(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal Jwt jwt) {

        UUID currentUserId = null;
        if (jwt != null) {
            currentUserId = userService.findByAuth0IdOptional(jwt.getSubject())
                    .map(User::getId)
                    .orElse(null);
        }

        PageResponse<UserSummaryDto> response = userFollowService.getFollowingWithStatus(
                id, currentUserId, page, limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
