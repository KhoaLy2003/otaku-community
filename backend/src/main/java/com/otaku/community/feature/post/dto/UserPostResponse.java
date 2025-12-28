package com.otaku.community.feature.post.dto;

import com.otaku.community.common.dto.post.PostResponseRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPostResponse {
    private List<PostResponseRecord> posts;
    private String nextCursor;
    private boolean hasMore;
    private int totalCount;
}
