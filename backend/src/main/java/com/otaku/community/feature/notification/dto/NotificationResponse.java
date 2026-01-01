package com.otaku.community.feature.notification.dto;

import com.otaku.community.feature.notification.entity.Notification;
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
public class NotificationResponse {
    private UUID id;
    private Notification.NotificationType notificationType;
    private SenderDTO sender;
    private UUID targetId;
    private Notification.TargetType targetType;
    private String preview;
    private Boolean isRead;
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SenderDTO {
        private UUID id;
        private String username;
        private String avatarUrl;
    }
}
