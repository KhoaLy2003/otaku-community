package com.otaku.community.feature.user.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.user.dto.UpdatePrivacyRequest;
import com.otaku.community.feature.user.dto.UserResponse;
import com.otaku.community.feature.user.service.UserSettingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
@Tag(name = "User Settings", description = "Endpoints for user profile and security settings")
@SecurityRequirement(name = "bearerAuth")
public class UserSettingController {

    private final UserSettingService userSettingService;

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update avatar and cover image", description = "Allows user to upload new avatar and cover images")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfileImages(
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam(value = "cover", required = false) MultipartFile cover) {
        UserResponse result = userSettingService.updateProfileImages(avatar, cover);
        return ResponseEntity.ok(ApiResponse.success("Profile images updated successfully", result));
    }

    @PutMapping("/privacy")
    @Operation(summary = "Update profile visibility setting")
    public ResponseEntity<ApiResponse<UserResponse>> updatePrivacy(
            @Valid @RequestBody UpdatePrivacyRequest request) {
        UserResponse result = userSettingService.updatePrivacy(request);
        return ResponseEntity.ok(ApiResponse.success("Privacy settings updated successfully", result));
    }
}
