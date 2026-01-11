package com.otaku.community.feature.post.dto;

import com.otaku.community.feature.post.entity.PostReferenceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostReferenceRequest {
    private PostReferenceType referenceType;
    private Long externalId;
    private String title;
    private String imageUrl;
}
