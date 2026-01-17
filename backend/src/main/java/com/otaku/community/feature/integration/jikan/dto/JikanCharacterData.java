package com.otaku.community.feature.integration.jikan.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JikanCharacterData {

    @JsonProperty("mal_id")
    private Integer malId;
    private String url;
    private JikanImages images;
    private String name;
    private String name_kanji;
    private List<String> nicknames;
    private Integer favorites;
    private String about;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JikanImages {
        private JikanImageType jpg;
        private JikanImageType webp;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JikanImageType {
        @JsonProperty("image_url")
        private String imageUrl;
        @JsonProperty("small_image_url")
        private String smallImageUrl;
        @JsonProperty("large_image_url")
        private String largeImageUrl;
    }
}



