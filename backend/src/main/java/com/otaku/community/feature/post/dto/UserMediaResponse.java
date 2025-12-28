package com.otaku.community.feature.post.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMediaResponse {
    private List<PostMediaResponse> media;
    private String nextCursor;
    private boolean hasMore;
}