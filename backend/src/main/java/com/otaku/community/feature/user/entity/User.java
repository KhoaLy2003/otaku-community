package com.otaku.community.feature.user.entity;

import com.otaku.community.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(name = "uk_users_auth0_id", columnNames = "auth0_id"),
        @UniqueConstraint(name = "uk_users_email", columnNames = "email"),
        @UniqueConstraint(name = "uk_users_username", columnNames = "username")
}, indexes = {
        @Index(name = "idx_users_email", columnList = "email"),
        @Index(name = "idx_users_username", columnList = "username"),
        @Index(name = "idx_users_deleted_at", columnList = "deleted_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(name = "auth0_id", nullable = false, unique = true)
    private String auth0Id;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = "cover_image_url", columnDefinition = "TEXT")
    private String coverImageUrl;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "interests", columnDefinition = "TEXT[]")
    private String[] interests;

    @Column(name = "location", length = 100)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    @Builder.Default
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    @Column(name = "profile_visibility", nullable = true, length = 20)
    @Builder.Default
    private ProfileVisibility profileVisibility = ProfileVisibility.PUBLIC;

    @Column(name = "group_name", length = 100)
    private String groupName;

    @Column(name = "is_locked", nullable = false)
    @Builder.Default
    private boolean isLocked = false;

    @Column(name = "total_manga_views", nullable = false, columnDefinition = "bigint default 0")
    @Builder.Default
    private Long totalMangaViews = 0L;

    @Column(name = "total_manga_upvotes", nullable = false, columnDefinition = "bigint default 0")
    @Builder.Default
    private Long totalMangaUpvotes = 0L;

    @Column(name = "total_translations", nullable = false, columnDefinition = "bigint default 0")
    @Builder.Default
    private Long totalTranslations = 0L;

    public enum UserRole {
        USER, ADMIN
    }

    public enum UserStatus {
        ACTIVE, LOCKED, BANNED
    }

    public UserStatus getStatus() {
        if (getDeletedAt() != null) {
            return UserStatus.BANNED;
        }
        return isLocked ? UserStatus.LOCKED : UserStatus.ACTIVE;
    }
}
