package com.otaku.community.feature.integration.jikan.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JikanSingleResponse {
    private JikanAnimeData data;
}
