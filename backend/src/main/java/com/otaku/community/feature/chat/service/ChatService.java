package com.otaku.community.feature.chat.service;

import com.otaku.community.common.exception.BadRequestException;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.feature.chat.dto.ChatResponse;
import com.otaku.community.feature.chat.entity.Chat;
import com.otaku.community.feature.chat.entity.Message;
import com.otaku.community.feature.chat.repository.ChatRepository;
import com.otaku.community.feature.chat.repository.MessageRepository;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.entity.UserFollow;
import com.otaku.community.feature.user.repository.UserFollowRepository;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final UserFollowRepository userFollowRepository;

    /**
     * Get or create a chat between two users
     * Normalizes user IDs to ensure userAId < userBId
     */
    public Chat getOrCreateChat(UUID userAId, UUID userBId) {
        if (userAId.equals(userBId)) {
            throw new BadRequestException("Cannot create chat with yourself");
        }

        // Normalize: ensure userAId < userBId
        UUID normalizedUserA = userAId.compareTo(userBId) < 0 ? userAId : userBId;
        UUID normalizedUserB = userAId.compareTo(userBId) < 0 ? userBId : userAId;

        return chatRepository.findByUserAIdAndUserBId(normalizedUserA, normalizedUserB)
                .orElse(null);
    }

    /**
     * Get all chats for a user, including empty chats for followed users
     */
    public List<ChatResponse> getUserChats(UUID userId) {
        // 1. Get existing chats
        List<Chat> existingChats = chatRepository.findAllByUserAIdOrUserBId(userId);

        List<ChatResponse> existingChatResponses = existingChats.stream()
                .map(chat -> convertToResponse(chat, userId))
                .toList();

        // 2. Get followed users
        List<UserFollow> follows = userFollowRepository
                .findAllByFollowerId(userId);

        // 3. Identify followed users who don't have a chat yet
        // Collect IDs of users we already have a chat with
        Set<UUID> existingChatPartnerIds = existingChats.stream()
                .map(chat -> chat.getUserAId().equals(userId) ? chat.getUserBId() : chat.getUserAId())
                .collect(Collectors.toSet());

        Set<UUID> newChatUserIds = follows.stream()
                .map(UserFollow::getFollowedId)
                .filter(id -> !existingChatPartnerIds.contains(id))
                .collect(Collectors.toSet());

        List<ChatResponse> newChatResponses = toNewChatResponses(newChatUserIds);

        // Merge resource
        List<ChatResponse> result = new ArrayList<>();
        result.addAll(existingChatResponses);
        result.addAll(newChatResponses);

        // Sort by updatedAt desc (or createdAt if updated is null) - re-sort needed
        // after additions
        result.sort((c1, c2) -> {
            Instant t1 = c1.getUpdatedAt() != null ? c1.getUpdatedAt() : c1.getCreatedAt();
            Instant t2 = c2.getUpdatedAt() != null ? c2.getUpdatedAt() : c2.getCreatedAt();
            return t2.compareTo(t1);
        });

        // 7. Sort
        result.sort((c1, c2) -> {
            if (c1.getId() == null && c2.getId() != null) return 1;
            if (c1.getId() != null && c2.getId() == null) return -1;
            if (c1.getId() == null) return 0;

            Instant t1 = c1.getUpdatedAt();
            Instant t2 = c2.getUpdatedAt();
            return t2.compareTo(t1);
        });

        return result;
    }

    private List<ChatResponse> toNewChatResponses(Set<UUID> targetUserIds) {
        if (targetUserIds.isEmpty()) {
            return List.of();
        }

        Map<UUID, User> userMap = userRepository.findAllByIdIn(targetUserIds)
                .stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        return targetUserIds.stream()
                .map(userMap::get)
                .filter(Objects::nonNull)
                .map(user -> ChatResponse.builder()
                        .id(null)
                        .participant(ChatResponse.ParticipantDTO.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .avatarUrl(user.getAvatarUrl())
                                .build())
                        .lastMessage(null)
                        .unreadCount(0)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build())
                .toList();
    }

    /**
     * Create or retrieve a chat with a specific user
     */
    @Transactional
    public ChatResponse createChat(UUID currentUserId, UUID targetUserId) {
        // Verify target user exists
        userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", targetUserId));

        Chat chat = getOrCreateChat(currentUserId, targetUserId);
        if (Objects.isNull(chat)) {
            UUID normalizedUserA = currentUserId
                    .compareTo(targetUserId) < 0 ? currentUserId : targetUserId;
            UUID normalizedUserB = currentUserId
                    .compareTo(targetUserId) < 0 ? targetUserId : currentUserId;

            Chat newChat = Chat.builder()
                    .userAId(normalizedUserA)
                    .userBId(normalizedUserB)
                    .build();
            chat = chatRepository.save(newChat);
        }
        return convertToResponse(chat, currentUserId);
    }

    private ChatResponse convertToResponse(Chat chat, UUID userId) {
        // Determine the other participant
        UUID otherUserId = chat.getUserAId().equals(userId)
                ? chat.getUserBId()
                : chat.getUserAId();

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", otherUserId));

        // Get last message
        ChatResponse.MessagePreviewDTO lastMessagePreview = null;
        List<Message> lastMessages = messageRepository.findByChatIdAndNotDeletedOrderByCreatedAtDesc(
                chat.getId(),
                PageRequest.of(0, 1)).getContent();

        if (!lastMessages.isEmpty()) {
            Message lastMessage = lastMessages.get(0);
            lastMessagePreview = ChatResponse.MessagePreviewDTO.builder()
                    .id(lastMessage.getId())
                    .content(lastMessage.getContent())
                    .createdAt(lastMessage.getCreatedAt())
                    .status(ChatResponse.MessageStatus.valueOf(lastMessage.getStatus().name()))
                    .build();
        }

        // Get unread count
        long unreadCount = messageRepository.countUnreadMessagesByChatIdAndReceiverId(
                chat.getId(), userId);

        return ChatResponse.builder()
                .id(chat.getId())
                .participant(ChatResponse.ParticipantDTO.builder()
                        .id(otherUser.getId())
                        .username(otherUser.getUsername())
                        .avatarUrl(otherUser.getAvatarUrl())
                        .build())
                .lastMessage(lastMessagePreview)
                .unreadCount(unreadCount)
                .createdAt(chat.getCreatedAt())
                .updatedAt(chat.getUpdatedAt())
                .build();
    }

    /**
     * Get chat by ID with authorization check
     */
    public Chat getChatById(UUID chatId, UUID userId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat", "id", chatId));

        validateChatAccess(chatId, userId);
        return chat;
    }

    /**
     * Validate that user is a participant in the chat
     */
    public void validateChatAccess(UUID chatId, UUID userId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat", "id", chatId));

        boolean isParticipant = chat.getUserAId().equals(userId) || chat.getUserBId().equals(userId);
        if (!isParticipant) {
            throw new AccessDeniedException("You do not have access to this chat");
        }
    }
}
