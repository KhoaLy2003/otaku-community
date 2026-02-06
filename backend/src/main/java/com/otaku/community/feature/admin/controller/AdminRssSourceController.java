package com.otaku.community.feature.admin.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.news.dto.CreateRssSourceRequest;
import com.otaku.community.feature.news.dto.RssFeedTestResult;
import com.otaku.community.feature.news.dto.RssSourceResponse;
import com.otaku.community.feature.news.dto.UpdateRssSourceRequest;
import com.otaku.community.feature.admin.service.RssSourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/rss-sources")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin RSS Sources", description = "Admin endpoints for managing RSS sources")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRssSourceController {

    private final RssSourceService rssSourceService;

    @GetMapping
    @Operation(summary = "Get all RSS sources")
    public ResponseEntity<ApiResponse<List<RssSourceResponse>>> getAllSources() {
        return ResponseEntity.ok(ApiResponse.success(rssSourceService.getAllSources()));
    }

    @PostMapping
    @Operation(summary = "Create a new RSS source")
    public ResponseEntity<ApiResponse<RssSourceResponse>> createSource(
            @Valid @RequestBody CreateRssSourceRequest request) {
        return ResponseEntity.ok(ApiResponse.success(rssSourceService.createSource(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an RSS source")
    public ResponseEntity<ApiResponse<RssSourceResponse>> updateSource(@PathVariable UUID id,
                                                                       @Valid @RequestBody UpdateRssSourceRequest request) {
        return ResponseEntity.ok(ApiResponse.success(rssSourceService.updateSource(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an RSS source")
    public ResponseEntity<ApiResponse<Void>> deleteSource(@PathVariable UUID id) {
        rssSourceService.deleteSource(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{id}/sync")
    @Operation(summary = "Manually trigger sync for an RSS source")
    public ResponseEntity<ApiResponse<Void>> syncSource(@PathVariable UUID id) {
        rssSourceService.syncSource(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/test")
    @Operation(summary = "Test an RSS feed URL")
    public ResponseEntity<ApiResponse<RssFeedTestResult>> testSource(@RequestBody Map<String, String> payload) {
        String url = payload.get("url");
        if (url == null || url.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("URL is required"));
        }
        return ResponseEntity.ok(ApiResponse.success(rssSourceService.testSource(url)));
    }
}
