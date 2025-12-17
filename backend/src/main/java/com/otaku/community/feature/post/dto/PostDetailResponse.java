package com.otaku.community.feature.post.dto;

import com.otaku.community.feature.interaction.dto.CommentResponse;
import com.otaku.community.feature.post.entity.PostStatus;
import com.otaku.community.feature.topic.dto.TopicResponse;
import com.otaku.community.feature.user.dto.UserResponse;
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
public class PostDetailResponse {
    private UUID id;
    private String title;
    private String content;
    private String thumbnailUrl;
    private List<PostMediaResponse> media;
    private PostStatus status;
    private PostAuthorResponse author;
    private List<TopicResponse> topics;
    private Integer likeCount;
    private Integer commentCount;
    private Boolean isLikedByCurrentUser;
    private List<CommentResponse> comments;
    private String shareableUrl;
    private Instant createdAt;
    private Instant updatedAt;

    public record PostAuthorResponse(
            UUID id,
            String name,
            String avatar
    ) {
    }
}