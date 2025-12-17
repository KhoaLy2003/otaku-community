package com.otaku.community.feature.user.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.user.dto.UpdateUserRequest;
import com.otaku.community.feature.user.dto.UserProfileResponse;
import com.otaku.community.feature.user.dto.UserResponse;
import com.otaku.community.feature.user.dto.UserSyncRequest;
import com.otaku.community.feature.user.dto.UserSyncResponse;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.mapper.UserMapper;
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
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/{id}")
    @Operation(summary = "Get user profile", description = "Retrieves a user's public profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Update user profile", description = "Updates the authenticated user's profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {

        UserResponse response = userService.updateUser(id, request);
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
    //@PreAuthorize("isAuthenticated()")
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

        User syncedUser = userService.syncUserFromAuth0(
                request.getAuth0Id(),
                request.getEmail(),
                request.getUsername(),
                request.getAvatarUrl()
        );

        UserSyncResponse response = userMapper.toSyncResponse(syncedUser);
        response.setNewUser(isNewUser);

        return ResponseEntity.ok(ApiResponse.success(
                isNewUser ? "User created successfully" : "User synchronized successfully",
                response
        ));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Get current user", description = "Gets the currently authenticated user's profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        User user = userService.findByAuth0Id();
        UserResponse response = userMapper.toResponse(user);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", response));
    }
}
