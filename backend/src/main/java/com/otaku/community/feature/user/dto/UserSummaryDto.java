package com.otaku.community.feature.user.dto;

import com.otaku.community.feature.user.entity.ProfileVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDto {
    private UUID id;
    private String username;
    private String avatarUrl;
    private String bio;
    private Boolean isFollowing;
    private ProfileVisibility profileVisibility;
}
