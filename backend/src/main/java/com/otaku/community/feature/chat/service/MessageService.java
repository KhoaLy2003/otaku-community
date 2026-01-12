package com.otaku.community.feature.chat.service;

import com.otaku.community.common.dto.CursorInfo;
import com.otaku.community.common.exception.BadRequestException;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.common.util.PaginationUtils;
import com.otaku.community.feature.chat.dto.MessageListResponse;
import com.otaku.community.feature.chat.dto.MessageResponse;
import com.otaku.community.feature.chat.entity.Chat;
import com.otaku.community.feature.chat.entity.Message;
import com.otaku.community.feature.chat.repository.ChatRepository;
import com.otaku.community.feature.chat.repository.MessageRepository;
import com.otaku.community.feature.notification.entity.Notification;
import com.otaku.community.feature.notification.listener.NotificationEventListener;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final ChatService chatService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Send a message
     */
    @Transactional
    public MessageResponse sendMessage(UUID chatId, UUID senderId, String content) {
        // Validate chat access
        Chat chat = chatService.getChatById(chatId, senderId);

        // Determine receiver
        UUID receiverId = chat.getUserAId().equals(senderId)
                ? chat.getUserBId()
                : chat.getUserAId();

        // Validate content
        if (content == null || content.trim().isEmpty()) {
            throw new BadRequestException("Message content cannot be empty");
        }

        // Sanitize content (basic - can be enhanced)
        String sanitizedContent = content.trim();
        if (sanitizedContent.length() > 5000) {
            throw new BadRequestException("Message content cannot exceed 5000 characters");
        }

        // Create message
        Message message = Message.builder()
                .chatId(chatId)
                .senderId(senderId)
                .content(sanitizedContent)
                .status(Message.MessageStatus.SENT)
                .isDeleted(false)
                .build();

        Message savedMessage = messageRepository.save(message);

        // Get sender info
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", senderId));

        // Build response
        MessageResponse response = MessageResponse.builder()
                .id(savedMessage.getId())
                .chatId(savedMessage.getChatId())
                .sender(MessageResponse.SenderDTO.builder()
                        .id(sender.getId())
                        .username(sender.getUsername())
                        .avatarUrl(sender.getAvatarUrl())
                        .build())
                .content(savedMessage.getContent())
                .status(MessageResponse.MessageStatus.valueOf(savedMessage.getStatus().name()))
                .isDeleted(savedMessage.isDeleted())
                .createdAt(savedMessage.getCreatedAt())
                .build();

        // Try to deliver via WebSocket (if user is online)
        try {
            // Send to Receiver
            messagingTemplate.convertAndSendToUser(
                    receiverId.toString(),
                    "/queue/chat",
                    response);

            // Send to Sender (so their UI updates immediately with the official message)
            messagingTemplate.convertAndSendToUser(
                    senderId.toString(),
                    "/queue/chat",
                    response);

            // Update status to DELIVERED
            savedMessage.setStatus(Message.MessageStatus.DELIVERED);
            messageRepository.save(savedMessage);
            response.setStatus(MessageResponse.MessageStatus.DELIVERED);

            // Send Notification to Receiver
            eventPublisher.publishEvent(
                    new NotificationEventListener.NotificationEvent(
                            receiverId,
                            senderId,
                            Notification.NotificationType.MESSAGE,
                            chatId,
                            Notification.TargetType.CHAT,
                            "sent you a message"));
        } catch (Exception e) {
            log.warn("Failed to deliver message via WebSocket, will be delivered when user comes online", e);
            // Status remains SENT, will be delivered when user connects
        }

        return response;
    }

    /**
     * Get messages with cursor-based pagination
     */
    @Transactional(readOnly = true)
    public MessageListResponse getMessages(UUID chatId, String cursor, Integer limit, UUID userId) {
        // Validate chat access
        chatService.validateChatAccess(chatId, userId);

        int pageSize = PaginationUtils.validateAndGetPageSize(limit);
        CursorInfo cursorInfo = PaginationUtils.parseCursor(cursor);

        Pageable pageable = PageRequest.of(0, pageSize + 1);

        List<Message> messages;
        if (cursorInfo.createdAt() == null) {
            // First page
            messages = messageRepository.findByChatIdAndNotDeletedOrderByCreatedAt(
                    chatId, pageable).getContent();
        } else {
            // Subsequent pages
            messages = messageRepository.findByChatIdAndCreatedAtBeforeAndIdBeforeOrderByCreatedAt(
                    chatId,
                    cursorInfo.createdAt(),
                    cursorInfo.id(),
                    pageable);
        }

        boolean hasMore = messages.size() > pageSize;
        if (hasMore) {
            messages = messages.subList(0, pageSize);
        }

        // Map to response
        List<MessageResponse> messageResponses = messages.stream()
                .map(this::mapToResponse)
                .toList();

        String nextCursor = null;
        if (hasMore && !messages.isEmpty()) {
            nextCursor = PaginationUtils.generateCursor(messages.get(messages.size() - 1));
        }

        return MessageListResponse.builder()
                .messages(messageResponses)
                .nextCursor(nextCursor)
                .hasMore(hasMore)
                .totalCount(messageResponses.size())
                .build();
    }

    /**
     * Mark messages as read
     */
    @Transactional
    public void markMessagesAsRead(UUID chatId, UUID userId) {
        chatService.validateChatAccess(chatId, userId);

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat", "id", chatId));

        // Get all unread messages where user is receiver
        List<Message> unreadMessages = messageRepository.findUnreadMessages(chatId, userId);

        // Update status to READ
        for (Message message : unreadMessages) {
            message.setStatus(Message.MessageStatus.READ);
            messageRepository.save(message);
        }

        // Notify sender that messages were read
        UUID senderId = chat.getUserAId().equals(userId) ? chat.getUserBId() : chat.getUserAId();
        try {
            messagingTemplate.convertAndSendToUser(
                    senderId.toString(),
                    "/queue/chat",
                    new ReadReceiptEvent(chatId, userId));
        } catch (Exception e) {
            log.warn("Failed to send read receipt via WebSocket", e);
        }
    }

    /**
     * Soft delete a message
     */
    @Transactional
    public void deleteMessage(UUID messageId, UUID userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message", "id", messageId));

        if (!message.getSenderId().equals(userId)) {
            throw new AccessDeniedException("You can only delete your own messages");
        }

        if (message.isDeleted()) {
            return; // Already deleted
        }

        message.setDeleted(true);
        message.setDeletedAt(Instant.now());
        messageRepository.save(message);

        // Notify other participant
        Chat chat = chatRepository.findById(message.getChatId())
                .orElseThrow(() -> new ResourceNotFoundException("Chat", "id", message.getChatId()));

        UUID receiverId = chat.getUserAId().equals(userId) ? chat.getUserBId() : chat.getUserAId();
        try {
            // Notify receiver
            messagingTemplate.convertAndSendToUser(
                    receiverId.toString(),
                    "/queue/chat",
                    new MessageDeletedEvent(messageId, message.getChatId()));

            // Notify sender (deleter) so their UI updates
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/chat",
                    new MessageDeletedEvent(messageId, message.getChatId()));
        } catch (Exception e) {
            log.warn("Failed to send deletion notification via WebSocket", e);
        }
    }

    // TODO: remove

    /**
     * Deliver offline messages when user comes online
     */
    @Transactional
    public void deliverOfflineMessages(UUID userId) {
        List<Message> undeliveredMessages = messageRepository.findUndeliveredMessagesForUser(userId);

        for (Message message : undeliveredMessages) {
            try {
                User sender = userRepository.findById(message.getSenderId())
                        .orElse(null);

                MessageResponse response = MessageResponse.builder()
                        .id(message.getId())
                        .chatId(message.getChatId())
                        .sender(sender != null ? MessageResponse.SenderDTO.builder()
                                .id(sender.getId())
                                .username(sender.getUsername())
                                .avatarUrl(sender.getAvatarUrl())
                                .build() : null)
                        .content(message.getContent())
                        .status(MessageResponse.MessageStatus.DELIVERED)
                        .isDeleted(message.isDeleted())
                        .createdAt(message.getCreatedAt())
                        .build();

                messagingTemplate.convertAndSendToUser(
                        userId.toString(),
                        "/queue/chat",
                        response);

                // Update status
                message.setStatus(Message.MessageStatus.DELIVERED);
                messageRepository.save(message);
            } catch (Exception e) {
                log.warn("Failed to deliver offline message {}", message.getId(), e);
            }
        }
    }

    private MessageResponse mapToResponse(Message message) {
        User sender = userRepository.findById(message.getSenderId())
                .orElse(null);

        return MessageResponse.builder()
                .id(message.getId())
                .chatId(message.getChatId())
                .sender(sender != null ? MessageResponse.SenderDTO.builder()
                        .id(sender.getId())
                        .username(sender.getUsername())
                        .avatarUrl(sender.getAvatarUrl())
                        .build() : null)
                .content(message.isDeleted() ? "This message was deleted" : message.getContent())
                .status(MessageResponse.MessageStatus.valueOf(message.getStatus().name()))
                .isDeleted(message.isDeleted())
                .createdAt(message.getCreatedAt())
                .build();
    }

    // Inner classes for WebSocket events
    private static class ReadReceiptEvent {
        public final String eventType = "CHAT_MESSAGE_READ";
        public UUID chatId;
        public UUID readBy;

        public ReadReceiptEvent(UUID chatId, UUID readBy) {
            this.chatId = chatId;
            this.readBy = readBy;
        }
    }

    private static class MessageDeletedEvent {
        public final String eventType = "CHAT_MESSAGE_DELETED";
        public UUID messageId;
        public UUID chatId;

        public MessageDeletedEvent(UUID messageId, UUID chatId) {
            this.messageId = messageId;
            this.chatId = chatId;
        }
    }
}
