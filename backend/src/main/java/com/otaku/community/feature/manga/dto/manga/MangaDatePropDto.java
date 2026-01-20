package com.otaku.community.feature.manga.dto.manga;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MangaDatePropDto {
    private Integer day;
    private Integer month;
    private Integer year;
}
