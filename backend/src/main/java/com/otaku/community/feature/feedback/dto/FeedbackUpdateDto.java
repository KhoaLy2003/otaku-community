package com.otaku.community.feature.feedback.dto;

import com.otaku.community.feature.feedback.entity.FeedbackPriority;
import com.otaku.community.feature.feedback.entity.FeedbackStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackUpdateDto {
    private FeedbackStatus status;
    private FeedbackPriority priority;
    private String moderatorNotes;
}
