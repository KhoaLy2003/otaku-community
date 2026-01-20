package com.otaku.community.feature.manga.dto.translation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslationPageResponse {
    private UUID id;
    private Integer pageIndex;
    private String imageUrl;
    private Integer width;
    private Integer height;
}
