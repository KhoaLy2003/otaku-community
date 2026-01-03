package com.otaku.community.feature.user.dto;

import com.otaku.community.feature.user.entity.ProfileVisibility;
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
public class UserSyncResponse {
    private UUID id;
    private String auth0Id;
    private String username;
    private String email;
    private String avatarUrl;
    private String bio;
    private String[] interests;
    private String location;
    private ProfileVisibility profileVisibility;
    private String coverImageUrl;
    private String role;
    private boolean isNewUser;
    private long unreadNotificationCount;
    private Instant createdAt;
    private Instant updatedAt;
}