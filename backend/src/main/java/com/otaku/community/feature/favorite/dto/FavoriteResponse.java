package com.otaku.community.feature.favorite.dto;

import com.otaku.community.feature.post.entity.PostReferenceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteResponse {

    private UUID id;
    private PostReferenceType type;
    private Long externalId;
    private String title;
    private String imageUrl;
    private String note;
    private Instant createdAt;
    private Instant updatedAt;
}
