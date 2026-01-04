package com.otaku.community.feature.chat.repository;

import com.otaku.community.feature.chat.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {

    /**
     * Find chat by user pair (normalized: userAId < userBId)
     */
    Optional<Chat> findByUserAIdAndUserBId(UUID userAId, UUID userBId);

    /**
     * Find all chats where the user is either userA or userB
     */
    @Query("""
            SELECT c FROM Chat c
            WHERE c.userAId = :userId OR c.userBId = :userId
            ORDER BY c.createdAt DESC
            """)
    List<Chat> findAllByUserAIdOrUserBId(@Param("userId") UUID userId);
}

