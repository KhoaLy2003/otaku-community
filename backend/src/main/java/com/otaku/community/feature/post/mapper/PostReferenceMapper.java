package com.otaku.community.feature.post.mapper;

import com.otaku.community.feature.post.dto.PostReferenceRequest;
import com.otaku.community.feature.post.dto.PostReferenceResponse;
import com.otaku.community.feature.post.entity.PostReference;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PostReferenceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "post", ignore = true)
    @Mapping(target = "autoLinked", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    PostReference toEntity(PostReferenceRequest request);

    PostReferenceResponse toResponse(PostReference reference);
}
