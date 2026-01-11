package com.otaku.community.feature.post.entity;

import com.otaku.community.common.entity.BaseEntity;
import com.otaku.community.feature.topic.entity.PostTopic;
import com.otaku.community.feature.topic.entity.Topic;
import com.otaku.community.feature.user.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "posts", indexes = {
        @Index(name = "idx_posts_user_id", columnList = "user_id"),
        @Index(name = "idx_posts_status", columnList = "status"),
        @Index(name = "idx_posts_created_at", columnList = "created_at"),
        @Index(name = "idx_posts_deleted_at", columnList = "deleted_at"),
        @Index(name = "idx_posts_status_created_at", columnList = "status, created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Post extends BaseEntity {

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PostStatus status = PostStatus.DRAFT;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @OneToOne(mappedBy = "post", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private PostStats stats;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<PostMedia> medias = new ArrayList<>();

    /**
     * Checks if the post is published and visible in feeds
     */
    public boolean isPublished() {
        return status == PostStatus.PUBLISHED;
    }

    /**
     * Checks if the post is a draft
     */
    public boolean isDraft() {
        return status == PostStatus.DRAFT;
    }

    /**
     * Publishes the post, making it visible in feeds
     */
    public void publish() {
        this.status = PostStatus.PUBLISHED;
    }

    /**
     * Converts the post back to draft status
     */
    public void makeDraft() {
        this.status = PostStatus.DRAFT;
    }

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostTopic> postTopics = new ArrayList<>();

    public void addTopic(Topic topic) {
        PostTopic pt = PostTopic.create(this, topic);
        postTopics.add(pt);
    }

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostReference> references = new ArrayList<>();

    public void addReference(PostReference reference) {
        reference.setPost(this);
        references.add(reference);
    }
}