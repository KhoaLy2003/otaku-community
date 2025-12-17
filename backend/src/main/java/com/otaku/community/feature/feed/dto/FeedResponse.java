package com.otaku.community.feature.feed.dto;

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
public class FeedResponse {
    private List<FeedPostResponse> posts;
    private String nextCursor;
    private boolean hasMore;
    private int totalCount;

    public FeedResponse(List<FeedPostResponse> posts, String nextCursor, boolean hasMore) {
        this.posts = posts;
        this.nextCursor = nextCursor;
        this.hasMore = hasMore;
        this.totalCount = posts != null ? posts.size() : 0;
    }

    public record FeedPostResponse(
            UUID id,
            String title,
            String content,
            String image,
            FeedAuthorResponse author,
            Instant createdAt,
            Integer likeCount,
            Integer commentCount
    ) {
    }

    public record FeedAuthorResponse(
            UUID id,
            String name,
            String avatar
    ) {
    }
}