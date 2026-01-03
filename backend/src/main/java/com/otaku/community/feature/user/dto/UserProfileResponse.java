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
public class UserProfileResponse {
    private UUID id;
    private String username;
    private String email;
    private String avatarUrl;
    private String coverImageUrl;
    private String bio;
    private String[] interests;
    private String location;
    private ProfileVisibility profileVisibility;
    private Long followersCount;
    private Long followingCount;
    private Long postsCount;
    private Boolean isFollowing;
    private Boolean isRestricted;
    private Instant createdAt;
}
