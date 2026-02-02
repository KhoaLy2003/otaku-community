package com.otaku.community.feature.manga.entity;

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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "translations", indexes = {
        @Index(name = "idx_translation_chapter_id", columnList = "chapter_id"),
        @Index(name = "idx_translation_translator_id", columnList = "translator_id"),
        @Index(name = "idx_translation_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Translation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "translator_id", nullable = false)
    private User translator;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private TranslationStatus status = TranslationStatus.DRAFT;

    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private boolean isVerified = false;

    @Column(name = "published_at")
    private Instant publishedAt;

    public enum TranslationStatus {
        DRAFT, PUBLISHED, HIDDEN, DELETED
    }
}
