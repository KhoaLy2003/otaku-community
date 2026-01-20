package com.otaku.community.feature.manga.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "translation_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslationStats {

    @Id
    private UUID translationId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "translation_id")
    private Translation translation;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Long viewCount = 0L;

    @Column(name = "upvote_count", nullable = false)
    @Builder.Default
    private Integer upvoteCount = 0;

    @Column(name = "comment_count", nullable = false)
    @Builder.Default
    private Integer commentCount = 0;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
