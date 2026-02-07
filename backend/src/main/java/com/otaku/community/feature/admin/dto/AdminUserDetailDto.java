package com.otaku.community.feature.admin.dto;

import com.otaku.community.feature.activity.entity.ActivityLog;
import com.otaku.community.feature.user.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AdminUserDetailDto {
    private UUID id;
    private String username;
    private String email;
    private String avatarUrl;
    private String coverImageUrl;
    private String bio;
    private String location;
    private String[] interests;
    private User.UserRole role;
    private User.UserStatus status;
    private boolean isLocked;
    private Long totalMangaViews;
    private Long totalMangaUpvotes;
    private Long totalTranslations;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant deletedAt;

    private List<ActivityLog> recentActivities;
}
