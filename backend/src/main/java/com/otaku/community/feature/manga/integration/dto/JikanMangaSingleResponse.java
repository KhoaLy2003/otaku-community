package com.otaku.community.feature.manga.integration.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JikanMangaSingleResponse {
    private JikanMangaData data;
}
