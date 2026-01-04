package com.otaku.community.feature.chat.repository;

import com.otaku.community.feature.chat.entity.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    /**
     * Find messages by chat ID, excluding deleted messages, ordered by creation date ascending
     */
    @Query("""
            SELECT m FROM Message m
            WHERE m.chatId = :chatId
            AND m.isDeleted = false
            ORDER BY m.createdAt ASC
            """)
    Slice<Message> findByChatIdAndNotDeletedOrderByCreatedAt(
            @Param("chatId") UUID chatId,
            Pageable pageable);

    /**
     * Find messages by chat ID, excluding deleted messages, ordered by creation date descending
     */
    @Query("""
            SELECT m FROM Message m
            WHERE m.chatId = :chatId
            AND m.isDeleted = false
            ORDER BY m.createdAt DESC
            """)
    Slice<Message> findByChatIdAndNotDeletedOrderByCreatedAtDesc(
            @Param("chatId") UUID chatId,
            Pageable pageable);

    /**
     * Find messages by chat ID with cursor-based pagination
     */
    @Query("""
            SELECT m FROM Message m
            WHERE m.chatId = :chatId
            AND m.isDeleted = false
            AND (
                :cursorCreatedAt IS NULL
                OR m.createdAt < :cursorCreatedAt
                OR (m.createdAt = :cursorCreatedAt AND m.id < :cursorMessageId)
            )
            ORDER BY m.createdAt DESC, m.id ASC
            """)
    List<Message> findByChatIdAndCreatedAtBeforeAndIdBeforeOrderByCreatedAt(
            @Param("chatId") UUID chatId,
            @Param("cursorCreatedAt") Instant cursorCreatedAt,
            @Param("cursorMessageId") UUID cursorMessageId,
            Pageable pageable);

    /**
     * Count unread messages for a receiver in a specific chat
     */
    @Query("""
            SELECT COUNT(m) FROM Message m
            WHERE m.chatId = :chatId
            AND m.senderId != :receiverId
            AND m.status != 'READ'
            AND m.isDeleted = false
            """)
    long countUnreadMessagesByChatIdAndReceiverId(
            @Param("chatId") UUID chatId,
            @Param("receiverId") UUID receiverId);

    /**
     * Find undelivered messages for a user (messages where user is receiver and status is SENT)
     */
    @Query("""
            SELECT m FROM Message m
            JOIN Chat c ON m.chatId = c.id
            WHERE (c.userAId = :userId OR c.userBId = :userId)
            AND m.senderId != :userId
            AND m.status = 'SENT'
            AND m.isDeleted = false
            ORDER BY m.createdAt ASC
            """)
    List<Message> findUndeliveredMessagesForUser(@Param("userId") UUID userId);
}

