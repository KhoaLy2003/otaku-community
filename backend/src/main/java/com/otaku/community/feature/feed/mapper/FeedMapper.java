package com.otaku.community.feature.feed.mapper;

import com.otaku.community.feature.feed.dto.FeedResponse;
import com.otaku.community.feature.post.entity.Post;
import org.springframework.stereotype.Component;

@Component
public class FeedMapper {
    public FeedResponse.FeedPostResponse toFeedPostResponse(Post post) {
        return new FeedResponse.FeedPostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getMedias() != null && !post.getMedias().isEmpty()
                        ? post.getMedias().get(0).getMediaUrl()
                        : null,
                new FeedResponse.FeedAuthorResponse(
                        post.getUser().getId(),
                        post.getUser().getUsername(),
                        post.getUser().getAvatarUrl()
                ),
                post.getCreatedAt(),
                post.getStats().getLikeCount(),
                post.getStats().getCommentCount()
        );
    }
}
