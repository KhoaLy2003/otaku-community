package com.otaku.community.feature.feed.mapper;

import com.otaku.community.common.dto.post.PostAuthorRecord;
import com.otaku.community.common.dto.post.PostResponseRecord;
import com.otaku.community.feature.news.mapper.NewsMapper;
import com.otaku.community.feature.post.entity.Post;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Getter
public class FeedMapper {

    private final NewsMapper newsMapper;

    public PostResponseRecord toFeedPostResponse(Post post, Boolean isLiked) {
        return new PostResponseRecord(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getMedias() != null && !post.getMedias().isEmpty()
                        ? post.getMedias().get(0).getMediaUrl()
                        : null,
                new PostAuthorRecord(
                        post.getUser().getId(),
                        post.getUser().getUsername(),
                        post.getUser().getAvatarUrl()),
                post.getCreatedAt(),
                post.getStats().getLikeCount(),
                post.getStats().getCommentCount(),
                isLiked);
    }
}
