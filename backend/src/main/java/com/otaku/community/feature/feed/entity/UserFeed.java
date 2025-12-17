package com.otaku.community.feature.feed.entity;

import com.otaku.community.feature.post.entity.Post;
import com.otaku.community.feature.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_feed",
       indexes = {
           @Index(name = "idx_user_feed_user_score", columnList = "user_id, score DESC"),
           @Index(name = "idx_user_feed_created_at", columnList = "created_at")
       })
@IdClass(UserFeedId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFeed {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Id
    @Column(name = "post_id")
    private UUID postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", insertable = false, updatable = false)
    private Post post;

//    @Column(name = "author_id", nullable = false)
//    private UUID authorId;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "author_id", insertable = false, updatable = false)
//    private User author;

    @Column(name = "score", nullable = false)
    private Float score;

    @Enumerated(EnumType.STRING)
    @Column(name = "reason", nullable = false, length = 20)
    private FeedReason reason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public enum FeedReason {
        FRIEND, FOLLOW, GROUP, PAGE
    }

    /**
     * Checks if this feed entry is from a friend
     */
    public boolean isFromFriend() {
        return reason == FeedReason.FRIEND;
    }

    /**
     * Checks if this feed entry is from a followed user
     */
    public boolean isFromFollowedUser() {
        return reason == FeedReason.FOLLOW;
    }

    /**
     * Checks if this feed entry is from a group
     */
    public boolean isFromGroup() {
        return reason == FeedReason.GROUP;
    }

    /**
     * Checks if this feed entry is from a page
     */
    public boolean isFromPage() {
        return reason == FeedReason.PAGE;
    }
}