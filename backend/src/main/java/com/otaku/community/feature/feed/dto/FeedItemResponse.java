package com.otaku.community.feature.feed.dto;

import com.otaku.community.common.dto.post.PostResponseRecord;
import com.otaku.community.feature.news.dto.NewsResponse;
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
public class FeedItemResponse {
    private UUID id;
    private FeedItemType type;
    private Instant timestamp;
    private PostResponseRecord post;
    private NewsResponse news;
}
