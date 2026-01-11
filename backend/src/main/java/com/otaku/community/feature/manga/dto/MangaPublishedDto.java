package com.otaku.community.feature.manga.dto;

import lombok.Data;

@Data
public class MangaPublishedDto {
    private String from;
    private String to;
    private PropDto prop;
    private String string;

    @Data
    public static class PropDto {
        private MangaDatePropDto from;
        private MangaDatePropDto to;
    }
}
