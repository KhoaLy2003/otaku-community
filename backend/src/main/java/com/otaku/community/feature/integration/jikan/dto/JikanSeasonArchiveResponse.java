package com.otaku.community.feature.integration.jikan.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JikanSeasonArchiveResponse {
    private List<SeasonArchiveData> data;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SeasonArchiveData {
        private Integer year;
        private List<String> seasons;
    }
}
