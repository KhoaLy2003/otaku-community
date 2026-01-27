package com.otaku.community.feature.manga.controller;

import com.otaku.community.common.annotation.CurrentUserId;
import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.manga.dto.translation.CreateUploadJobRequest;
import com.otaku.community.feature.manga.dto.translation.UploadJobResponse;
import com.otaku.community.feature.manga.service.UploadJobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Upload Job", description = "Manga translation upload management APIs")
public class UploadJobController {

    private final UploadJobService uploadJobService;

    @PostMapping("/translations/upload-jobs")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create upload job", description = "Initialize a new translation upload process")
    public ResponseEntity<ApiResponse<UploadJobResponse>> createUploadJob(@RequestBody CreateUploadJobRequest request,
                                                                          @CurrentUserId UUID userId) {
        UploadJobResponse response = uploadJobService.createUploadJob(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Upload job created successfully", response));
    }

    @PostMapping("/upload-jobs/{id}/pages/batch")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload pages batch", description = "Upload multiple manga pages to an active job")
    public ResponseEntity<ApiResponse<UploadJobResponse>> uploadPagesBatch(
            @PathVariable UUID id,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "startPageIndex", required = false) Integer startPageIndex,
            @CurrentUserId UUID userId) {
        UploadJobResponse response = uploadJobService.uploadPagesBatch(id, files, startPageIndex, userId);
        return ResponseEntity.ok(ApiResponse.success("Batch upload started successfully", response));
    }

    @GetMapping("/upload-jobs/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get upload job status", description = "Track the progress of an upload job")
    public ResponseEntity<ApiResponse<UploadJobResponse>> getJobStatus(@PathVariable UUID id) {
        UploadJobResponse response = uploadJobService.getJobStatus(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/upload-jobs/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Cancel upload job", description = "Cancel an active upload job and cleanup")
    public ResponseEntity<ApiResponse<UploadJobResponse>> cancelJob(@PathVariable UUID id, @CurrentUserId UUID userId) {
        UploadJobResponse response = uploadJobService.cancelJob(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Upload job cancelled successfully", response));
    }
}
