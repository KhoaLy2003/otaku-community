package com.otaku.community.feature.anime.dto;

import com.otaku.community.feature.post.dto.PostResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnimeDto {
    private Integer externalId;
    private String title;
    private String imageUrl;
    private String synopsis;
    private Double score;
    private String status;
    private String type;
    private Integer episodes;
    private List<String> genres;
    private String season;
    private Integer year;
    private String source;
    private String rating;
    private String duration;
    private List<AnimeCharacterDto> characters;
    private List<PostResponse> relatedPosts;
}
