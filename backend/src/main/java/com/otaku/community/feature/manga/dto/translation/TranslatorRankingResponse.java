package com.otaku.community.feature.manga.dto.translation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslatorRankingResponse {
    private UUID userId;
    private String username;
    private String avatarUrl;
    private String groupName;
    private Long totalViews;
    private Long totalLikes;
    private Long totalComments;
    private Long totalTranslations;
    private Double score;
    private Integer rank;
}
