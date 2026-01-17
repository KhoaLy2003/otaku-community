package com.otaku.community.feature.anime.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CharacterDto {
    private int malId;
    private String name;
    private String imageUrl;
    private String about;
    private Integer favorites;
}
