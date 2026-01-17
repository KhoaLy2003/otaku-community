package com.otaku.community.feature.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedUpdateNotification {
    private Integer newPostsCount;
    private Instant timestamp;
    private String message;
}
