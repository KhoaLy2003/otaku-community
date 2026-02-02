package com.otaku.community.feature.user.repository;

import com.otaku.community.feature.user.entity.ProfileVisibility;
import com.otaku.community.feature.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
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

    @Query("SELECT u.id FROM User u WHERE u.id != :authorId AND u.deletedAt IS NULL")
    List<UUID> findAllUserIdsExcept(@Param("authorId") UUID authorId);

    @Modifying
    @Query("UPDATE User u SET u.totalMangaViews = u.totalMangaViews + 1 WHERE u.id = :id")
    void incrementTotalMangaViews(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE User u SET u.totalMangaUpvotes = u.totalMangaUpvotes + :delta WHERE u.id = :id")
    void updateTotalMangaUpvotes(@Param("id") UUID id, @Param("delta") int delta);

    @Modifying
    @Query("UPDATE User u SET u.totalTranslations = u.totalTranslations + :delta WHERE u.id = :id")
    void updateTotalTranslations(@Param("id") UUID id, @Param("delta") int delta);

    @Query("SELECT u.id as userId, u.username as username, u.avatarUrl as avatarUrl, u.groupName as groupName, " +
            "SUM(s.viewCount) as totalViews, SUM(s.upvoteCount) as totalLikes, SUM(s.commentCount) as totalComments, "
            +
            "COUNT(t.id) as totalTranslations " +
            "FROM User u JOIN Translation t ON u.id = t.translator.id JOIN TranslationStats s ON t.id = s.translationId "
            +
            "WHERE t.publishedAt >= :since AND t.deletedAt IS NULL AND t.status = 'PUBLISHED' " +
            "GROUP BY u.id, u.username, u.avatarUrl, u.groupName " +
            "ORDER BY (SUM(s.upvoteCount) * 10 + SUM(s.viewCount) + SUM(s.commentCount) * 5) DESC")
    List<Object[]> findTranslatorsByStatsInPeriod(@Param("since") Instant since, Pageable pageable);

    @Query("""
                SELECT u.id as userId,
                       u.username as username,
                       u.avatarUrl as avatarUrl,
                       u.groupName as groupName,
                       SUM(s.viewCount) as totalViews,
                       SUM(s.upvoteCount) as totalLikes,
                       SUM(s.commentCount) as totalComments,
                       COUNT(t.id) as totalTranslations
                FROM User u
                    JOIN Translation t ON u.id = t.translator.id
                    JOIN TranslationStats s ON t.id = s.translationId
                WHERE t.deletedAt IS NULL
                  AND t.status = 'PUBLISHED'
                GROUP BY u.id, u.username, u.avatarUrl, u.groupName
                ORDER BY (SUM(s.upvoteCount) * 10
                        + SUM(s.viewCount)
                        + SUM(s.commentCount) * 5) DESC
            """)
    List<Object[]> findAllTimeTranslators(Pageable pageable);

    @Query("SELECT u.id as userId, u.username as username, u.avatarUrl as avatarUrl, u.groupName as groupName, " +
            "u.totalMangaViews as totalViews, u.totalMangaUpvotes as totalLikes, u.totalTranslations as totalTranslations "
            +
            "FROM User u WHERE u.deletedAt IS NULL AND (u.totalMangaViews > 0 OR u.totalMangaUpvotes > 0 OR u.totalTranslations > 0) "
            +
            "ORDER BY (u.totalMangaUpvotes * 10 + u.totalMangaViews) DESC")
    List<Object[]> findAllTimeTranslatorsV2(Pageable pageable);

    @Query(value = "SELECT rank FROM (" +
            "SELECT id, (total_manga_upvotes * 10 + total_manga_views) as score, " +
            "RANK() OVER (ORDER BY (total_manga_upvotes * 10 + total_manga_views) DESC) as rank " +
            "FROM users WHERE deleted_at IS NULL" +
            ") r WHERE r.id = :userId", nativeQuery = true)
    Optional<Integer> findUserRank(@Param("userId") UUID userId);
}
