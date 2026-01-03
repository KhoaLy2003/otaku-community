package com.otaku.community.feature.activity.dto;

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
public class LoginHistoryResponse {
    private UUID id;
    private String ipAddress;
    private String userAgent;
    private Instant createdAt;
}
