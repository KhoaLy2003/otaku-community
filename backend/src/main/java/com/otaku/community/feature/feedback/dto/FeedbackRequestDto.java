package com.otaku.community.feature.feedback.dto;

import com.otaku.community.feature.feedback.entity.FeedbackPriority;
import com.otaku.community.feature.feedback.entity.FeedbackTargetType;
import com.otaku.community.feature.feedback.entity.FeedbackType;
import com.otaku.community.feature.feedback.entity.ReportReason;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequestDto {

    @NotNull
    private FeedbackType type;

    private String title;

    @NotBlank
    private String content;

    private FeedbackTargetType targetType;

    private String targetId;

    private FeedbackPriority priority;

    private ReportReason reason;

    private String reporterEmail;

    private String reporterName;

    private boolean anonymous = false;
}
