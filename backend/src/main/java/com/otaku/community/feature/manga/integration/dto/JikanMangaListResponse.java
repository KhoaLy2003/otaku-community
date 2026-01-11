package com.otaku.community.feature.manga.integration.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JikanMangaListResponse {
    private List<JikanMangaData> data;
    private JikanPagination pagination;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JikanPagination {
        @JsonProperty("last_visible_page")
        private Integer lastVisiblePage;

        @JsonProperty("has_next_page")
        private Boolean hasNextPage;

        @JsonProperty("current_page")
        private Integer currentPage;

        private JikanItems items;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JikanItems {
        private Integer count;
        private Long total;
        @JsonProperty("per_page")
        private Integer perPage;
    }
}
