package com.otaku.community.feature.admin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardStatsDto {
    private long totalUsers;
    private long newUsers24h;
    private long pendingReports;
    private long pendingTranslations;
    private long activePosts;
    private long moderationActions;
}
