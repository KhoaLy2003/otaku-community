package com.otaku.community.feature.interaction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {

    private UUID id;
    private UUID postId;
    private String content;
    private String imageUrl;
    private UUID parentId;
    private CommentUserResponse author;
    private Instant createdAt;
    private Instant updatedAt;
    private boolean isEdited;

    /**
     * Check if the comment has been edited
     */
    public boolean getIsEdited() {
        return updatedAt != null && !updatedAt.equals(createdAt);
    }

    public record CommentUserResponse(
            UUID id,
            String name,
            String avatar) {
    }
}