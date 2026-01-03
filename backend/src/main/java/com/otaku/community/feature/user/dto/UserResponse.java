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
public class UserResponse {
    private UUID id;
    private String username;
    private String email;
    private String avatarUrl;
    private String coverImageUrl;
    private String bio;
    private String[] interests;
    private String location;
    private ProfileVisibility profileVisibility;
    private Instant createdAt;
}
