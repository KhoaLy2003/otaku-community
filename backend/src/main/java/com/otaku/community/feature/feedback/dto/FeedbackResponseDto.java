package com.otaku.community.feature.feedback.dto;

import com.otaku.community.feature.feedback.entity.FeedbackPriority;
import com.otaku.community.feature.feedback.entity.FeedbackStatus;
import com.otaku.community.feature.feedback.entity.FeedbackTargetType;
import com.otaku.community.feature.feedback.entity.FeedbackType;
import com.otaku.community.feature.feedback.entity.ReportReason;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponseDto {
    private UUID id;
    private FeedbackType type;
    private String title;
    private String content;
    private FeedbackTargetType targetType;
    private String targetId;
    private FeedbackStatus status;
    private FeedbackPriority priority;
    private ReportReason reason;
    private String moderatorNotes;
    private UUID moderatorId;
    private String moderatorName;
    private UUID reporterId;
    private String reporterName;
    private String reporterEmail;
    private boolean isAnonymous;
    private Instant createdAt;
    private Instant updatedAt;
}
