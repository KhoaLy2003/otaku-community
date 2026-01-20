package com.otaku.community.feature.interaction.entity;

import com.otaku.community.common.entity.BaseEntity;
import com.otaku.community.feature.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "reactions", uniqueConstraints = {
        @UniqueConstraint(name = "uk_reactions_user_target", columnNames = {"user_id", "target_type", "target_id"})
}, indexes = {
        @Index(name = "idx_reactions_target", columnList = "target_type, target_id"),
        @Index(name = "idx_reactions_user_id", columnList = "user_id"),
        @Index(name = "idx_reactions_type", columnList = "reaction_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reaction extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, length = 20)
    private TargetType targetType;

    @Column(name = "target_id", nullable = false)
    private UUID targetId;

    @Enumerated(EnumType.STRING)
    @Column(name = "reaction_type", nullable = false, length = 20)
    private ReactionType reactionType;

    public enum TargetType {
        POST, COMMENT, TRANSLATION
    }

    public enum ReactionType {
        LIKE, UNLIKE
    }

    /**
     * Checks if this is a like reaction
     */
    public boolean isLike() {
        return reactionType == ReactionType.LIKE;
    }

    /**
     * Checks if this is an unlike reaction
     */
    public boolean isUnlike() {
        return reactionType == ReactionType.UNLIKE;
    }

    /**
     * Checks if this reaction targets a post
     */
    public boolean isPostReaction() {
        return targetType == TargetType.POST;
    }

    /**
     * Checks if this reaction targets a comment
     */
    public boolean isCommentReaction() {
        return targetType == TargetType.COMMENT;
    }
}