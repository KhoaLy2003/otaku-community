package com.otaku.community.feature.chat.dto;

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
public class ChatResponse {
    private UUID id;
    private ParticipantDTO participant;
    private MessagePreviewDTO lastMessage;
    private long unreadCount;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantDTO {
        private UUID id;
        private String username;
        private String avatarUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessagePreviewDTO {
        private UUID id;
        private String content;
        private Instant createdAt;
        private MessageStatus status;
    }

    public enum MessageStatus {
        SENT,
        DELIVERED,
        READ
    }
}

