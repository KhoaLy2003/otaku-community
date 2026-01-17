package com.otaku.community.feature.user.repository;

import com.otaku.community.feature.user.entity.ProfileVisibility;
import com.otaku.community.feature.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByAuth0Id(String auth0Id);

    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL AND u.username = :username")
    Optional<User> findByUsernameAndNotDeleted(@Param("username") String username);

    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL AND LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<User> searchByUsername(@Param("query") String query, Pageable pageable);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    List<User> findAllByIdIn(Set<UUID> ids);

    @Query("SELECT u.id FROM User u WHERE u.id != :authorId AND u.deletedAt IS NULL " +
            "AND (u.role != :userRole OR u.profileVisibility != :publicVisibility)")
    List<UUID> findUserIdsForBroadFanout(
            @Param("authorId") UUID authorId,
            @Param("userRole") User.UserRole userRole,
            @Param("publicVisibility") ProfileVisibility publicVisibility);
}
