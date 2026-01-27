package com.otaku.community.feature.manga.entity;

import com.otaku.community.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "mangas", indexes = {
        @Index(name = "idx_manga_mal_id", columnList = "mal_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Manga extends BaseEntity {

    @Column(name = "mal_id", nullable = false, unique = true)
    private Integer malId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "title_en")
    private String titleEn;

    @Column(name = "cover_image", columnDefinition = "TEXT")
    private String coverImage;
}
