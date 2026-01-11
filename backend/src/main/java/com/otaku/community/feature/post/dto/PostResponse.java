package com.otaku.community.feature.post.dto;

import com.otaku.community.common.dto.post.PostAuthorRecord;
import com.otaku.community.feature.post.entity.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private UUID id;
    private String title;
    private String content;
    private List<PostMediaResponse> media;
    private PostStatus status;
    private UUID userId;
    private PostAuthorRecord author;
    private Integer likesCount;
    private Integer commentCount;
    private List<PostReferenceResponse> references;
    private Instant createdAt;
    private Instant updatedAt;
}