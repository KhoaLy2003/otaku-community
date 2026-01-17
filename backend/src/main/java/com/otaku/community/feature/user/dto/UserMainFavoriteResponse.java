package com.otaku.community.feature.user.dto;

import com.otaku.community.feature.user.entity.UserMainFavorite;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMainFavoriteResponse {
    private UserMainFavorite.FavoriteType favoriteType;
    private Integer favoriteId;
    private String favoriteName;
    private String favoriteImageUrl;
    private String favoriteReason;
}
