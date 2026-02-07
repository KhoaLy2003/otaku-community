package com.otaku.community.feature.feedback.controller;

import com.otaku.community.common.annotation.CurrentUserId;
import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.feedback.dto.FeedbackRequestDto;
import com.otaku.community.feature.feedback.dto.FeedbackResponseDto;
import com.otaku.community.feature.feedback.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/feedbacks")
@RequiredArgsConstructor
@Tag(name = "Feedback", description = "Feedback and Report management endpoints")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    @Operation(summary = "Submit feedback or report", description = "Allows both authenticated and anonymous users to submit feedback")
    public ResponseEntity<ApiResponse<FeedbackResponseDto>> submitFeedback(
            @CurrentUserId UUID userId,
            @Valid @RequestBody FeedbackRequestDto dto) {
        FeedbackResponseDto response = feedbackService.createFeedback(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Feedback submitted successfully", response));
    }
}
