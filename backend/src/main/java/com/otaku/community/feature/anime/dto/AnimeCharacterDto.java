package com.otaku.community.feature.anime.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AnimeCharacterDto {
    private Integer malId;
    private String name;
    private String imageUrl;
    private String role;
    private List<VoiceActorDto> voiceActors;

    @Data
    @Builder
    public static class VoiceActorDto {
        private String name;
        private String imageUrl;
        private String language;
    }
}
