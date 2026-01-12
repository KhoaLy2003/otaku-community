package com.otaku.community.feature.interaction.mapper;

import com.otaku.community.feature.interaction.dto.CommentResponse;
import com.otaku.community.feature.interaction.dto.LikeResponse;
import com.otaku.community.feature.interaction.entity.Comment;
import com.otaku.community.feature.user.entity.User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Component
public class InteractionMapper {

    /**
     * Convert Comment entity to CommentResponse DTO
     */
    public CommentResponse toCommentResponse(Comment comment) {
        if (comment == null) {
            return null;
        }

        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .content(comment.getContent())
                .imageUrl(comment.getImageUrl())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .author(comment.getUser() != null ? toResponse(comment.getUser()) : null)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .isEdited(comment.getUpdatedAt() != null && !comment.getUpdatedAt().equals(comment.getCreatedAt()))
                .build();
    }

    public CommentResponse.CommentUserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return new CommentResponse.CommentUserResponse(
                user.getId(),
                user.getUsername(),
                user.getAvatarUrl());
    }

    /**
     * Convert list of Comment entities to list of CommentResponse DTOs
     */
    public List<CommentResponse> toCommentResponseList(List<Comment> comments) {
        if (comments == null) {
            return Collections.emptyList();
        }

        return comments.stream()
                .map(this::toCommentResponse)
                .toList();
    }

    /**
     * Create LikeResponse DTO
     */
    public LikeResponse toLikeResponse(UUID postId, boolean isLiked, long likesCount) {
        return LikeResponse.builder()
                .postId(postId)
                .isLiked(isLiked)
                .likesCount(likesCount)
                .build();
    }
}