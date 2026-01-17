package com.otaku.community.feature.favorite.entity;

import com.otaku.community.common.entity.BaseEntity;
import com.otaku.community.feature.post.entity.PostReferenceType;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_favorites", indexes = {
        @Index(name = "idx_user_favorites_user_id", columnList = "user_id"),
        @Index(name = "idx_user_favorites_user_type", columnList = "user_id, type")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_favorites_user_type_external_id", columnNames = {"user_id", "type",
                "external_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFavorite extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private PostReferenceType type;

    @Column(name = "external_id", nullable = false)
    private Long externalId;

    @Column(name = "title", nullable = false, length = 512)
    private String title;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "note", length = 500)
    private String note;
}
