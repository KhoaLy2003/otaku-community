package com.otaku.community.feature.manga.mapper;

import com.otaku.community.feature.manga.dto.manga.MangaAuthorDto;
import com.otaku.community.feature.manga.dto.manga.MangaDatePropDto;
import com.otaku.community.feature.manga.dto.manga.MangaDto;
import com.otaku.community.feature.manga.dto.manga.MangaPublishedDto;
import com.otaku.community.feature.manga.integration.dto.JikanMangaData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface MangaMapper {

    @Mapping(target = "externalId", source = "malId")
    @Mapping(target = "imageUrl", source = "images.jpg.largeImageUrl")
    @Mapping(target = "genres", qualifiedByName = "mapGenres")
    @Mapping(target = "status", qualifiedByName = "normalizeStatus")
    @Mapping(target = "type", qualifiedByName = "normalizeType")
    @Mapping(target = "authors", qualifiedByName = "mapAuthors")
    @Mapping(target = "published", qualifiedByName = "mapPublished")
    MangaDto toDto(JikanMangaData source);

    @Named("mapGenres")
    default List<String> mapGenres(List<JikanMangaData.JikanGenre> genres) {
        if (genres == null) {
            return Collections.emptyList();
        }
        return genres.stream()
                .map(JikanMangaData.JikanGenre::getName)
                .toList();
    }

    @Named("mapAuthors")
    default List<MangaAuthorDto> mapAuthors(List<JikanMangaData.JikanAuthor> authors) {
        if (authors == null) {
            return Collections.emptyList();
        }
        return authors.stream()
                .map(author -> {
                    MangaAuthorDto dto = new MangaAuthorDto();
                    dto.setMalId(author.getMalId());
                    dto.setType(author.getType());
                    dto.setName(author.getName());
                    dto.setUrl(author.getUrl());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Named("mapPublished")
    default MangaPublishedDto mapPublished(JikanMangaData.JikanPublished published) {
        if (published == null) {
            return null;
        }

        MangaPublishedDto dto = new MangaPublishedDto();
        dto.setFrom(published.getFrom());
        dto.setTo(published.getTo());
        dto.setString(published.getString());

        if (published.getProp() != null) {
            MangaPublishedDto.PropDto propDto = new MangaPublishedDto.PropDto();

            if (published.getProp().getFrom() != null) {
                MangaDatePropDto fromDto = new MangaDatePropDto();
                fromDto.setDay(published.getProp().getFrom().getDay());
                fromDto.setMonth(published.getProp().getFrom().getMonth());
                fromDto.setYear(published.getProp().getFrom().getYear());
                propDto.setFrom(fromDto);
            }

            if (published.getProp().getTo() != null) {
                MangaDatePropDto toDto = new MangaDatePropDto();
                toDto.setDay(published.getProp().getTo().getDay());
                toDto.setMonth(published.getProp().getTo().getMonth());
                toDto.setYear(published.getProp().getTo().getYear());
                propDto.setTo(toDto);
            }

            dto.setProp(propDto);
        }

        return dto;
    }

    @Named("normalizeStatus")
    default String normalizeStatus(String status) {
        if (status == null)
            return "Unknown";
        if (status.equalsIgnoreCase("Publishing"))
            return "Publishing";
        if (status.equalsIgnoreCase("Finished"))
            return "Finished";
        return status;
    }

    @Named("normalizeType")
    default String normalizeType(String type) {
        if (type == null)
            return "Unknown";
        // Manga, Novel, One-shot, etc.
        return type;
    }
}
