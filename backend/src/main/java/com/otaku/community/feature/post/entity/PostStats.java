package com.otaku.community.feature.post.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "post_stats", indexes = {
        @Index(name = "idx_post_stats_like_count", columnList = "like_count"),
        @Index(name = "idx_post_stats_view_count", columnList = "view_count")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class PostStats {

    @Id
    @Column(name = "post_id")
    private UUID postId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", referencedColumnName = "id", insertable = false, updatable = false,
                foreignKey = @ForeignKey(name = "fk_post_stats_post_id"))
    @MapsId
    private Post post;

    @Column(name = "like_count", nullable = false)
    @Builder.Default
    private Integer likeCount = 0;

    @Column(name = "comment_count", nullable = false)
    @Builder.Default
    private Integer commentCount = 0;

    @Column(name = "share_count", nullable = false)
    @Builder.Default
    private Integer shareCount = 0;

    @Column(name = "reaction_count", nullable = false)
    @Builder.Default
    private Integer reactionCount = 0;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Long viewCount = 0L;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Increments the like count
     */
    public void incrementLikeCount() {
        this.likeCount++;
        this.reactionCount++;
    }

    /**
     * Decrements the like count
     */
    public void decrementLikeCount() {
        if (this.likeCount > 0) {
            this.likeCount--;
            this.reactionCount--;
        }
    }

    /**
     * Increments the comment count
     */
    public void incrementCommentCount() {
        this.commentCount++;
    }

    /**
     * Decrements the comment count
     */
    public void decrementCommentCount() {
        if (this.commentCount > 0) {
            this.commentCount--;
        }
    }

    /**
     * Increments the view count
     */
    public void incrementViewCount() {
        this.viewCount++;
    }

    /**
     * Increments the share count
     */
    public void incrementShareCount() {
        this.shareCount++;
    }
}