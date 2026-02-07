package com.otaku.community.feature.news.dto;

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
public class RssSourceResponse {
    private UUID id;
    private String name;
    private String url;
    private Integer priority;
    private boolean enabled;
    private Instant lastSyncAt;
    private String lastSyncStatus;
    private Instant createdAt;
    private Instant updatedAt;
}
