package com.otaku.community.feature.admin.controller;

import com.otaku.community.common.annotation.CurrentUserId;
import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.admin.service.AdminService;
import com.otaku.community.feature.report.entity.Report;
import com.otaku.community.feature.report.entity.ReportStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
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
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReportController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Report>>> getReports(
            @RequestParam(required = false) ReportStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getReports(status, pageable)));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<Void>> resolveReport(
            @PathVariable UUID id,
            @RequestParam ReportStatus status,
            @RequestParam(required = false) String notes,
            @CurrentUserId UUID moderatorId) {
        adminService.resolveReport(id, status, notes, moderatorId);
        return ResponseEntity.ok(ApiResponse.success("Report resolved successfully", null));
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
