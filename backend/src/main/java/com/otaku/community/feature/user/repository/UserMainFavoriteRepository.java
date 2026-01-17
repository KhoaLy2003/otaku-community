package com.otaku.community.feature.user.repository;

import com.otaku.community.feature.user.entity.UserMainFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserMainFavoriteRepository extends JpaRepository<UserMainFavorite, UUID> {
    Optional<UserMainFavorite> findByUserId(UUID userId);
}
