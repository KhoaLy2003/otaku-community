package com.otaku.community.feature.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.otaku.community.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_main_favorites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMainFavorite extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "favorite_type", nullable = false)
    private FavoriteType favoriteType;

    @Column(name = "favorite_id", nullable = false)
    private Integer favoriteId;

    @Column(name = "favorite_name", nullable = false)
    private String favoriteName;

    @Column(name = "favorite_image_url")
    private String favoriteImageUrl;

    @Column(name = "favorite_reason", length = 200)
    private String favoriteReason;

    public enum FavoriteType {
        ANIME, MANGA, CHARACTER
    }
}
