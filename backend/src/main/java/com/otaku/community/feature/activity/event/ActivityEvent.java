package com.otaku.community.feature.activity.event;

import com.otaku.community.feature.activity.entity.ActivityTargetType;
import com.otaku.community.feature.activity.entity.ActivityType;

import java.util.UUID;

public record ActivityEvent(
        UUID userId,
        ActivityType action,
        ActivityTargetType targetType,
        String targetId,
        String metadata) {
}
