package com.otaku.community.feature.activity.dto;

import com.otaku.community.feature.activity.entity.ActivityType;
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
public class ActivityLogResponse {
    private UUID id;
    private ActivityType actionType;
    private String metadata;
    private Instant createdAt;
}
