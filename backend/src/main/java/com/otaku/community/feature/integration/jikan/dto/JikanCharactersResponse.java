package com.otaku.community.feature.integration.jikan.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JikanCharactersResponse {
    private List<JikanCharacterData> data;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JikanCharacterData {
        private CharacterInfo character;
        private String role;
        @JsonProperty("voice_actors")
        private List<VoiceActorInfo> voiceActors;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CharacterInfo {
        @JsonProperty("mal_id")
        private Integer malId;
        private String url;
        private CharacterImages images;
        private String name;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CharacterImages {
        private JpgImage jpg;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JpgImage {
        @JsonProperty("image_url")
        private String imageUrl;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VoiceActorInfo {
        private Person person;
        private String language;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Person {
        @JsonProperty("mal_id")
        private Integer malId;
        private String name;
        private CharacterImages images;
    }
}
