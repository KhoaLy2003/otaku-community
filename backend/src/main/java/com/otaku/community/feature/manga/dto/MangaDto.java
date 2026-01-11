package com.otaku.community.feature.manga.dto;

import com.otaku.community.feature.post.dto.PostResponse;
import lombok.Data;

import java.util.List;

@Data
public class MangaDto {
    private Integer externalId;
    private String title;
    private String imageUrl;
    private String synopsis;
    private Double score;
    private String status;
    private String type;
    private Integer chapters;
    private Integer volumes;
    private String favorites;
    private List<String> genres;
    private List<MangaAuthorDto> authors;
    private MangaPublishedDto published;
    private List<PostResponse> relatedPosts;
}
