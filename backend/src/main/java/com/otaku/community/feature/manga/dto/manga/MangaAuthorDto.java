package com.otaku.community.feature.manga.dto.manga;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MangaAuthorDto {
    private Integer malId;
    private String type;
    private String name;
    private String url;
}
