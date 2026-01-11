package com.otaku.community.feature.anime.integration.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JikanAnimeData {
    @JsonProperty("mal_id")
    private Integer malId;

    private String title;

    private JikanImages images;

    private String synopsis;
    private Double score;
    private String status;
    private String type;
    private Integer episodes;
    private String season;
    private Integer year;
    private String source;
    private String rating;
    private String duration;
    private List<JikanGenre> genres;

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

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JikanGenre {
        @JsonProperty("mal_id")
        private Integer malId;
        private String type;
        private String name;
        private String url;
    }
}
