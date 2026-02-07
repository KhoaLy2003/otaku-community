package com.otaku.community.feature.feed.controller;

import com.otaku.community.common.annotation.CurrentUserId;
import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.feed.dto.FeedResponse;
import com.otaku.community.feature.feed.service.FeedService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Feed", description = "Feed management endpoints")
public class FeedController {

    private final FeedService feedService;

    @GetMapping("/home")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get home feed", description = "Get personalized home feed for authenticated user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Home feed retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public ResponseEntity<ApiResponse<FeedResponse>> getHomeFeed(
            @Parameter(description = "Post cursor for pagination") @RequestParam(required = false) String postCursor,
            @Parameter(description = "News cursor for pagination") @RequestParam(required = false) String newsCursor,
            @Parameter(description = "Number of posts/news to return") @RequestParam(required = false) Integer limit,
            @CurrentUserId UUID currentUserId) {

        log.debug("Getting home feed with postCursor: {}, newsCursor: {}, limit: {}", postCursor, newsCursor, limit);

        FeedResponse feed = feedService.getHomeFeed(postCursor, newsCursor, limit, currentUserId);

        return ResponseEntity.ok(ApiResponse.success(feed));
    }

    @GetMapping("/explore")
    @Operation(summary = "Get explore feed", description = "Get public explore feed with all published posts")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Explore feed retrieved successfully")
    })
    public ResponseEntity<ApiResponse<FeedResponse>> getExploreFeed(
            @Parameter(description = "Post cursor for pagination") @RequestParam(required = false) String postCursor,
            @Parameter(description = "News cursor for pagination") @RequestParam(required = false) String newsCursor,
            @Parameter(description = "Number of items to return") @RequestParam(required = false) Integer limit,
            @Parameter(description = "Filter posts by topic IDs") @RequestParam(required = false) List<UUID> topicIds,
            @CurrentUserId UUID currentUserId) {

        log.debug("Getting explore feed with postCursor: {}, newsCursor: {}, limit: {}", postCursor, newsCursor, limit);

        FeedResponse feed = feedService.getExploreFeed(postCursor, newsCursor, limit, topicIds, currentUserId);

        return ResponseEntity.ok(ApiResponse.success(feed));
    }
}