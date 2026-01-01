package com.otaku.community.feature.topic.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.topic.dto.TopicRequest;
import com.otaku.community.feature.topic.dto.TopicResponse;
import com.otaku.community.feature.topic.dto.UpdateTopicRequest;
import com.otaku.community.feature.topic.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@Tag(name = "Topics", description = "Topic management operations")
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new topic", description = "Creates a new topic. Admin access required.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Topic created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin access required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Topic name already exists")
    })
    public ResponseEntity<ApiResponse<TopicResponse>> createTopic(@Valid @RequestBody TopicRequest request) {
        TopicResponse response = topicService.createTopic(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Topic created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all topics", description = "Retrieves all active topics with post counts")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Topics retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<TopicResponse>>> getAllTopics() {
        List<TopicResponse> topics = topicService.getAllTopics();
        return ResponseEntity.ok(ApiResponse.success("Topics retrieved successfully", topics));
    }

    @GetMapping("/default")
    @Operation(summary = "Get default topics", description = "Retrieves system-defined default topics")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Default topics retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<TopicResponse>>> getDefaultTopics() {
        List<TopicResponse> topics = topicService.getDefaultTopics();
        return ResponseEntity.ok(ApiResponse.success("Default topics retrieved successfully", topics));
    }

    @GetMapping("/search")
    @Operation(summary = "Search topics", description = "Search topics by name with pagination")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Topics search completed successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<TopicResponse>>> searchTopics(
            @Parameter(description = "Search query") @RequestParam String query,
            @Parameter(description = "Page number (1-based)") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "20") int limit) {

        PageResponse<TopicResponse> response = topicService.searchTopics(query, page, limit);
        return ResponseEntity.ok(ApiResponse.success("Topics search completed successfully", response));
    }

    @GetMapping("/{topicId}")
    @Operation(summary = "Get topic by ID", description = "Retrieves a specific topic by its ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Topic retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Topic not found")
    })
    public ResponseEntity<ApiResponse<TopicResponse>> getTopicById(
            @Parameter(description = "Topic ID") @PathVariable UUID topicId) {
        TopicResponse response = topicService.getTopicById(topicId);
        return ResponseEntity.ok(ApiResponse.success("Topic retrieved successfully", response));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get topic by slug", description = "Retrieves a specific topic by its slug")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Topic retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Topic not found")
    })
    public ResponseEntity<ApiResponse<TopicResponse>> getTopicBySlug(
            @Parameter(description = "Topic slug") @PathVariable String slug) {
        TopicResponse response = topicService.getTopicBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Topic retrieved successfully", response));
    }

    @PutMapping("/{topicId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update topic", description = "Updates an existing topic. Admin access required.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Topic updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin access required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Topic not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Topic name already exists")
    })
    public ResponseEntity<ApiResponse<TopicResponse>> updateTopic(
            @Parameter(description = "Topic ID") @PathVariable UUID topicId,
            @Valid @RequestBody UpdateTopicRequest request) {
        TopicResponse response = topicService.updateTopic(topicId, request);
        return ResponseEntity.ok(ApiResponse.success("Topic updated successfully", response));
    }

    @DeleteMapping("/{topicId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete topic", description = "Soft deletes a topic and removes all post associations. Admin access required.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Topic deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin access required"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Topic not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteTopic(
            @Parameter(description = "Topic ID") @PathVariable UUID topicId) {
        topicService.deleteTopic(topicId);
        return ResponseEntity.ok(ApiResponse.success("Topic deleted successfully", null));
    }

    @GetMapping("/post/{postId}")
    @Operation(summary = "Get topics by post ID", description = "Retrieves all topics associated with a specific post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post topics retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<TopicResponse>>> getTopicsByPostId(
            @Parameter(description = "Post ID") @PathVariable UUID postId) {
        List<TopicResponse> topics = topicService.getTopicsByPostId(postId);
        return ResponseEntity.ok(ApiResponse.success("Post topics retrieved successfully", topics));
    }
}