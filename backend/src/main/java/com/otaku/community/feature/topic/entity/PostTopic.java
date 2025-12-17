package com.otaku.community.feature.topic.entity;

import com.otaku.community.feature.post.entity.Post;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "post_topics", indexes = {
        @Index(name = "idx_post_topics_post_id", columnList = "post_id"),
        @Index(name = "idx_post_topics_topic_id", columnList = "topic_id"),
        @Index(name = "idx_post_topics_created_at", columnList = "created_at")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_post_topics_post_topic", columnNames = {"post_id", "topic_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class PostTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    /**
     * Creates a new PostTopic association
     */
    public static PostTopic create(Post post, Topic topic) {
        return PostTopic.builder()
                .post(post)
                .topic(topic)
                .build();
    }
}