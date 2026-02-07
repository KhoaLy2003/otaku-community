package com.otaku.community.feature.feed.dto;

import com.otaku.community.common.dto.post.PostResponseRecord;
import com.otaku.community.feature.news.dto.NewsResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedResponse {
    private List<PostResponseRecord> posts;
    private String postCursor;
    private boolean hasMorePosts;

    private List<NewsResponse> news;
    private String newsCursor;
    private boolean hasMoreNews;

    private int totalPosts;
    private int totalNews;
}