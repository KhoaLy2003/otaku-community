package com.otaku.community.feature.news.mapper;

import com.otaku.community.feature.news.dto.CreateRssSourceRequest;
import com.otaku.community.feature.news.dto.RssSourceResponse;
import com.otaku.community.feature.news.dto.UpdateRssSourceRequest;
import com.otaku.community.feature.news.entity.RssSource;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface RssSourceMapper {

    RssSourceResponse toResponse(RssSource rssSource);

    RssSource toEntity(CreateRssSourceRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(UpdateRssSourceRequest request, @MappingTarget RssSource rssSource);
}
