package com.otaku.community.feature.manga.integration.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JikanMangaData {
    @JsonProperty("mal_id")
    private Integer malId;

    private String title;

    private JikanImages images;

    private String synopsis;
    private Double score;
    private String status;
    private String type;
    private Integer chapters;
    private Integer volumes;
    private List<JikanGenre> genres;
    private List<JikanAuthor> authors;
    private JikanPublished published;

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

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JikanAuthor {
        @JsonProperty("mal_id")
        private Integer malId;
        private String type;
        private String name;
        private String url;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JikanPublished {
        private String from;
        private String to;
        private JikanPublishedProp prop;
        private String string;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JikanPublishedProp {
        private JikanDateProp from;
        private JikanDateProp to;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JikanDateProp {
        private Integer day;
        private Integer month;
        private Integer year;
    }
}
