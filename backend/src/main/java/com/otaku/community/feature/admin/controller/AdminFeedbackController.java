package com.otaku.community.feature.admin.controller;

import com.otaku.community.common.annotation.CurrentUserId;
import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.admin.service.AdminService;
import com.otaku.community.feature.feedback.dto.FeedbackResponseDto;
import com.otaku.community.feature.feedback.entity.FeedbackStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/feedbacks")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminFeedbackController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<FeedbackResponseDto>>> getFeedbacks(
            @RequestParam(required = false) FeedbackStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getFeedbacks(status, page, limit)));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<Void>> resolveFeedback(
            @PathVariable UUID id,
            @RequestParam FeedbackStatus status,
            @RequestParam(required = false) String notes,
            @CurrentUserId UUID moderatorId) {
        adminService.resolveFeedback(id, status, notes, moderatorId);
        return ResponseEntity.ok(ApiResponse.success("Feedback resolved successfully", null));
    }

    @PostMapping("/moderate/post/{postId}")
    public ResponseEntity<ApiResponse<Void>> moderatePost(@PathVariable UUID postId, @RequestParam boolean delete) {
        adminService.moderatePost(postId, delete);
        return ResponseEntity.ok(ApiResponse.success("Post moderated successfully", null));
    }

    @PostMapping("/moderate/comment/{commentId}")
    public ResponseEntity<ApiResponse<Void>> moderateComment(@PathVariable UUID commentId,
                                                             @RequestParam boolean delete) {
        adminService.moderateComment(commentId, delete);
        return ResponseEntity.ok(ApiResponse.success("Comment moderated successfully", null));
    }
}
