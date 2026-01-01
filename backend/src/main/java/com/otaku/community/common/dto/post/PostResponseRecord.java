package com.otaku.community.common.dto.post;

import java.time.Instant;
import java.util.UUID;

public record PostResponseRecord(
        UUID id,
        String title,
        String content,
        String image,
        PostAuthorRecord author,
        Instant createdAt,
        Integer likesCount,
        Integer commentCount,
        Boolean isLiked) {
}
