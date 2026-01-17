package com.otaku.community.feature.favorite.repository;

import com.otaku.community.feature.favorite.entity.UserFavorite;
import com.otaku.community.feature.post.entity.PostReferenceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, UUID> {

    Page<UserFavorite> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    boolean existsByUserIdAndTypeAndExternalId(UUID userId, PostReferenceType type, Long externalId);

    Optional<UserFavorite> findByIdAndUserId(UUID id, UUID userId);
}
