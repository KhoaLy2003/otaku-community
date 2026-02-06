package com.otaku.community.feature.news.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.news.dto.NewsResponse;
import com.otaku.community.feature.news.dto.RssSourceResponse;
import com.otaku.community.feature.news.entity.NewsCategory;
import com.otaku.community.feature.admin.service.RssSourceService;
import com.otaku.community.feature.news.service.NewsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "News", description = "News RSS feed management endpoints")
public class NewsController {

    private final NewsService newsService;
    private final RssSourceService rssSourceService;

    @GetMapping
    @Operation(summary = "Get paginated news", description = "Retrieves a paginated list of news articles with optional source and category filters")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "News retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<NewsResponse>>> getNews(
            @Parameter(description = "Filter by source id") @RequestParam(required = false) UUID sourceId,
            @Parameter(description = "Filter by category") @RequestParam(required = false) NewsCategory category,
            @Parameter(description = "Page number (1-indexed)") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int limit) {
        log.debug("Retrieving news (page: {}, limit: {}, sourceId: {}, category: {})", page, limit, sourceId, category);

        PageResponse<NewsResponse> response = newsService.getNews(sourceId, category, page, limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get news by ID", description = "Retrieves detailed information for a specific news article")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "News article found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "News article not found")
    })
    public ResponseEntity<ApiResponse<NewsResponse>> getNewsById(
            @Parameter(description = "News article ID") @PathVariable UUID id) {
        log.debug("Retrieving news article with ID: {}", id);

        NewsResponse response = newsService.getNewsById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/sources")
    @Operation(summary = "Get enabled RSS sources", description = "Retrieves enabled RSS sources ordered by priority")
    public ResponseEntity<ApiResponse<List<RssSourceResponse>>> getEnabledSources() {
        return ResponseEntity.ok(ApiResponse.success(rssSourceService.getEnabledSources()));
    }
}

