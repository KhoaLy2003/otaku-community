package com.otaku.community.feature.admin.dto;

import com.otaku.community.feature.user.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class AdminUserListItemDto {
    private UUID id;
    private String username;
    private String email;
    private String avatarUrl;
    private String bio;
    private User.UserRole role;
    private User.UserStatus status;
    private boolean isLocked;
    private Instant createdAt;
}
