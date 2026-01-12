package com.otaku.community.feature.interaction.entity;

import com.otaku.community.common.entity.BaseEntity;
import com.otaku.community.feature.post.entity.Post;
import com.otaku.community.feature.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "comments", indexes = {
        @Index(name = "idx_comments_post_id", columnList = "post_id"),
        @Index(name = "idx_comments_user_id", columnList = "user_id"),
        @Index(name = "idx_comments_created_at", columnList = "created_at"),
        @Index(name = "idx_comments_deleted_at", columnList = "deleted_at"),
        @Index(name = "idx_comments_parent_id", columnList = "parent_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends BaseEntity {

    @Column(name = "content", length = 1000)
    private String content;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parent_id", nullable = false)
    private Comment parent;

    /**
     * Updates the comment content while preserving creation timestamp
     */
    /**
     * Updates the comment content and image while preserving creation timestamp
     */
    public void updateComment(String newContent, String newImageUrl) {
        this.content = newContent;
        this.imageUrl = newImageUrl;
    }
}