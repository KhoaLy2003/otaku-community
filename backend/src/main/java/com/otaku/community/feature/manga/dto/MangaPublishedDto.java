package com.otaku.community.feature.manga.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MangaPublishedDto {
    private String from;
    private String to;
    private PropDto prop;
    private String string;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PropDto {
        private MangaDatePropDto from;
        private MangaDatePropDto to;
    }
}
