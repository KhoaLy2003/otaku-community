package com.otaku.community.feature.user.dto;

import com.otaku.community.feature.user.entity.UserMainFavorite;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMainFavoriteRequest {

    @NotNull(message = "Favorite type is required")
    private UserMainFavorite.FavoriteType favoriteType;

    @NotNull(message = "Favorite ID is required")
    private Integer favoriteId;

    @NotNull(message = "Favorite name is required")
    private String favoriteName;

    private String favoriteImageUrl;

    @Size(max = 200, message = "Reason must not exceed 200 characters")
    private String favoriteReason;
}
