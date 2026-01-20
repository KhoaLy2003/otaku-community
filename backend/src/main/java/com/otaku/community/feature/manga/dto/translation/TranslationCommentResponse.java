package com.otaku.community.feature.manga.dto.translation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslationCommentResponse {
    private UUID id;
    private UUID userId;
    private String username;
    private String avatarUrl;
    private String content;
    private String imageUrl;
    private Instant createdAt;
    private List<TranslationCommentResponse> replies;
}
