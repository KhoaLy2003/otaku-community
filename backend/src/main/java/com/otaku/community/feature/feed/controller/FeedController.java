package com.otaku.community.feature.feed.controller;

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
import org.springframework.web.bind.annotation.*;

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
    //@PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get home feed", description = "Get personalized home feed for authenticated user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Home feed retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public ResponseEntity<ApiResponse<FeedResponse>> getHomeFeed(
            @Parameter(description = "Cursor for pagination") @RequestParam(required = false) String cursor,
            @Parameter(description = "Number of posts to return (max 50)") @RequestParam(required = false) Integer limit) {
        
        log.debug("Getting home feed with cursor: {}, limit: {}", cursor, limit);
        
        FeedResponse feed = feedService.getHomeFeed(cursor, limit);
        
        return ResponseEntity.ok(ApiResponse.success(feed));
    }

    @GetMapping("/explore")
    @Operation(summary = "Get explore feed", description = "Get public explore feed with all published posts")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Explore feed retrieved successfully")
    })
    public ResponseEntity<ApiResponse<FeedResponse>> getExploreFeed(
            @Parameter(description = "Cursor for pagination") @RequestParam(required = false) String cursor,
            @Parameter(description = "Number of posts to return (max 50)") @RequestParam(required = false) Integer limit,
            @Parameter(description = "Filter posts by topic IDs") @RequestParam(required = false) List<UUID> topicIds) {
        
        log.debug("Getting explore feed with cursor: {}, limit: {}", cursor, limit);
        
        FeedResponse feed = feedService.getExploreFeed(cursor, limit, topicIds);
        
        return ResponseEntity.ok(ApiResponse.success(feed));
    }
}