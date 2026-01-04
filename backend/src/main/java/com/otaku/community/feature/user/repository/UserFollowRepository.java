package com.otaku.community.feature.user.repository;

import com.otaku.community.feature.user.entity.UserFollow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, UUID> {

    boolean existsByFollowerIdAndFollowedId(UUID followerId, UUID followedId);

    void deleteByFollowerIdAndFollowedId(UUID followerId, UUID followedId);

    Page<UserFollow> findAllByFollowerId(UUID followerId, Pageable pageable);

    List<UserFollow> findAllByFollowerId(UUID followerId);

    Page<UserFollow> findAllByFollowedId(UUID followedId, Pageable pageable);

    // For fan-out (batch processing might be needed for large scale, but Slice/List
    // works for MVP)
    List<UserFollow> findAllByFollowedId(UUID followedId);

    long countByFollowerId(UUID followerId);

    long countByFollowedId(UUID followedId);

    @Query("SELECT uf.followedId FROM UserFollow uf WHERE uf.followerId = :followerId AND uf.followedId IN :followedIds")
    Set<UUID> findFollowedIdsByFollowerIdAndFollowedIdsIn(@Param("followerId") UUID followerId,
                                                          @Param("followedIds") java.util.Collection<UUID> followedIds);
}
