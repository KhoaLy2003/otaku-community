package com.otaku.community.feature.manga.dto.translation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslationDetailResponse {
    private UUID translationId;
    private String name;
    private String translator;
    private String translatorAvatar;
    private Instant publishedAt;
    private String status;
    private String notes;
    private Instant createdAt;
    private UUID chapterId;
    private BigDecimal chapterNumber;
    private String chapterTitle;
    private Integer mangaId; // mal_id
    private String mangaTitle;
    private TranslationStatsResponse stats;
    private List<TranslationPageResponse> pages;
}
