package com.otaku.community.feature.favorite.mapper;

import com.otaku.community.feature.favorite.dto.CreateFavoriteRequest;
import com.otaku.community.feature.favorite.dto.FavoriteResponse;
import com.otaku.community.feature.favorite.entity.UserFavorite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserFavoriteMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    UserFavorite toEntity(CreateFavoriteRequest request);

    FavoriteResponse toResponse(UserFavorite userFavorite);
}
