package com.otaku.community.feature.post.mapper;

import com.otaku.community.feature.post.dto.PostMediaRequest;
import com.otaku.community.feature.post.dto.PostMediaResponse;
import com.otaku.community.feature.post.entity.PostMedia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMediaMapper {

    /**
     * Convert list of PostMedia entities to response DTOs
     */
    List<PostMediaResponse> toResponseList(List<PostMedia> postMediaList);

    /**
     * Convert PostMediaRequest to PostMedia entity
     */
    //@Mapping(target = "id", ignore = true)
    @Mapping(target = "postId", ignore = true)
    @Mapping(target = "post", ignore = true)
    @Mapping(target = "orderIndex", ignore = true)
    //@Mapping(target = "createdAt", ignore = true)
    //@Mapping(target = "updatedAt", ignore = true)
    //@Mapping(target = "deletedAt", ignore = true)
    PostMedia toEntity(PostMediaRequest request);

    /**
     * Convert list of PostMediaRequest to PostMedia entities
     */
    List<PostMedia> toEntityList(List<PostMediaRequest> requests);
}