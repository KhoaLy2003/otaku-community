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
public class MessageResponse {
    private UUID id;
    private UUID chatId;
    private SenderDTO sender;
    private String content;
    private MessageStatus status;
    private boolean isDeleted;
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

    public enum MessageStatus {
        SENT,
        DELIVERED,
        READ
    }
}

