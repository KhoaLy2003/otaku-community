package com.otaku.community.feature.post.dto;

import com.otaku.community.feature.post.entity.PostStatus;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePostRequest {

    @Size(max = 255, message = "Post title cannot exceed 255 characters")
    private String title;

    private String content;

    private List<PostMediaRequest> mediaItems;

    private List<UUID> topicIds;

    private PostStatus status;
}