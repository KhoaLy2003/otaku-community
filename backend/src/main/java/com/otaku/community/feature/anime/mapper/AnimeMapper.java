package com.otaku.community.feature.anime.mapper;

import com.otaku.community.feature.anime.dto.AnimeCharacterDto;
import com.otaku.community.feature.anime.dto.AnimeDto;
import com.otaku.community.feature.anime.integration.dto.JikanAnimeData;
import com.otaku.community.feature.anime.integration.dto.JikanCharactersResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface AnimeMapper {

    @Mapping(target = "externalId", source = "malId")
    @Mapping(target = "imageUrl", source = "images.jpg.largeImageUrl")
    @Mapping(target = "genres", qualifiedByName = "mapGenres")
    @Mapping(target = "status", qualifiedByName = "normalizeStatus")
    @Mapping(target = "type", qualifiedByName = "normalizeType")
    AnimeDto toDto(JikanAnimeData source);

    @Named("mapGenres")
    default List<String> mapGenres(List<JikanAnimeData.JikanGenre> genres) {
        if (genres == null) {
            return Collections.emptyList();
        }
        return genres.stream()
                .map(JikanAnimeData.JikanGenre::getName)
                .collect(Collectors.toList());
    }

    @Named("normalizeStatus")
    default String normalizeStatus(String status) {
        if (status == null)
            return "Unknown";
        if (status.equalsIgnoreCase("Currently Airing"))
            return "Airing";
        if (status.equalsIgnoreCase("Finished Airing"))
            return "Finished";
        return status;
    }

    @Named("normalizeType")
    default String normalizeType(String type) {
        if (type == null)
            return "Unknown";
        // TV, Movie, OVA are usually standard in Jikan, maybe case sensitivity?
        return type;
    }

    default List<AnimeCharacterDto> toCharacterDtoList(List<JikanCharactersResponse.JikanCharacterData> source) {
        if (source == null) {
            return Collections.emptyList();
        }
        return source.stream()
                .map(this::toCharacterDto)
                .collect(Collectors.toList());
    }

    default AnimeCharacterDto toCharacterDto(JikanCharactersResponse.JikanCharacterData data) {
        if (data == null)
            return null;

        return AnimeCharacterDto.builder()
                .malId(data.getCharacter().getMalId())
                .name(data.getCharacter().getName())
                .imageUrl(data.getCharacter().getImages().getJpg().getImageUrl())
                .role(data.getRole())
                .voiceActors(toVoiceActorDtoList(data.getVoiceActors()))
                .build();
    }

    default List<AnimeCharacterDto.VoiceActorDto> toVoiceActorDtoList(
            List<JikanCharactersResponse.VoiceActorInfo> voiceActors) {
        if (voiceActors == null) {
            return Collections.emptyList();
        }
        return voiceActors.stream()
                .map(this::toVoiceActorDto)
                .collect(Collectors.toList());
    }

    default AnimeCharacterDto.VoiceActorDto toVoiceActorDto(JikanCharactersResponse.VoiceActorInfo info) {
        if (info == null)
            return null;

        return AnimeCharacterDto.VoiceActorDto.builder()
                .name(info.getPerson().getName())
                .imageUrl(info.getPerson().getImages().getJpg().getImageUrl())
                .language(info.getLanguage())
                .build();
    }
}
