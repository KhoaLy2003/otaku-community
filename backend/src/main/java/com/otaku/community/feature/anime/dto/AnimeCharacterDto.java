package com.otaku.community.feature.anime.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnimeCharacterDto {
    private Integer malId;
    private String name;
    private String imageUrl;
    private String role;
    private List<VoiceActorDto> voiceActors;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VoiceActorDto {
        private String name;
        private String imageUrl;
        private String language;
    }
}
