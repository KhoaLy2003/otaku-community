package com.otaku.community.feature.news.mapper;

import com.otaku.community.feature.news.dto.NewsResponse;
import com.otaku.community.feature.news.entity.News;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface NewsMapper {
    NewsResponse toResponse(News news);
}
