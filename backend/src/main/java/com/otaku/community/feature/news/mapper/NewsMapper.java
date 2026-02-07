package com.otaku.community.feature.news.mapper;

import com.otaku.community.feature.news.dto.NewsResponse;
import com.otaku.community.feature.news.entity.News;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, uses = com.otaku.community.feature.news.mapper.RssSourceMapper.class)
public interface NewsMapper {
    @Mapping(source = "rssSource", target = "source")
    NewsResponse toResponse(News news);
}
