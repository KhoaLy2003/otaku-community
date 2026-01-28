package com.otaku.community.feature.manga.entity;

import com.otaku.community.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "chapters", indexes = {
        @Index(name = "idx_chapter_manga_id", columnList = "manga_id"),
        @Index(name = "idx_chapter_number", columnList = "chapter_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chapter extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manga_id", nullable = false, foreignKey = @ForeignKey(name = "fk_chapters_mangas"))
    private Manga manga;

    @Column(name = "chapter_number", nullable = false, precision = 10, scale = 2)
    private BigDecimal chapterNumber;

    @Column(name = "title")
    private String title;
}
