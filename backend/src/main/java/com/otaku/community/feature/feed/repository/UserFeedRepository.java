package com.otaku.community.feature.feed.repository;

import com.otaku.community.feature.feed.entity.UserFeed;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.UUID;

@Repository
public interface UserFeedRepository extends JpaRepository<UserFeed, UUID> {

    Slice<UserFeed> findAllByUserId(UUID userId, Pageable pageable);

    @Query("""
            SELECT uf
            FROM UserFeed uf
            WHERE uf.userId = :userId
            AND uf.createdAt < :cursorCreatedAt OR (uf.createdAt = :cursorCreatedAt AND uf.postId < :cursorPostId)
            ORDER BY uf.createdAt DESC, uf.postId DESC
            """)
    Slice<UserFeed> findHomeFeedByCursor(
            @Param("userId") UUID userId,
            @Param("cursorCreatedAt") Instant cursorCreatedAt,
            @Param("cursorPostId") UUID cursorPostId,
            Pageable pageable
    );

    void deleteByUserIdAndAuthorId(UUID userId, UUID authorId);
}