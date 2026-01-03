package com.otaku.community.feature.activity.controller;

import com.otaku.community.common.annotation.CurrentUserId;
import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.activity.dto.ActivityLogResponse;
import com.otaku.community.feature.activity.dto.LoginHistoryResponse;
import com.otaku.community.feature.activity.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/activity")
@RequiredArgsConstructor
@Tag(name = "Activity", description = "Endpoints for user activity and login history")
@SecurityRequirement(name = "bearerAuth")
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping("/login-history")
    @Operation(summary = "Retrieve login history")
    public ResponseEntity<ApiResponse<PageResponse<LoginHistoryResponse>>> getLoginHistory(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @CurrentUserId UUID currentUserId) {
        PageResponse<LoginHistoryResponse> result = activityService.getLoginHistory(page, limit, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Login history retrieved successfully", result));
    }

    @GetMapping("/log")
    @Operation(summary = "Retrieve user activity log")
    public ResponseEntity<ApiResponse<PageResponse<ActivityLogResponse>>> getActivityLog(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @CurrentUserId UUID currentUserId) {
        PageResponse<ActivityLogResponse> result = activityService.getActivityLog(page, limit, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Activity log retrieved successfully", result));
    }
}
