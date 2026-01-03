package com.otaku.community.feature.user.dto;

import com.otaku.community.feature.user.entity.ProfileVisibility;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdatePrivacyRequest {
    @NotNull(message = "Profile visibility is required")
    private ProfileVisibility profileVisibility;
}
