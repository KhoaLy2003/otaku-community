package com.otaku.community.feature.manga.dto.manga;

import com.otaku.community.feature.manga.dto.chapter.ChapterResponse;
import com.otaku.community.feature.post.dto.PostResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MangaDto {
    private UUID id;
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
    private List<ChapterResponse> chapterList;
}
