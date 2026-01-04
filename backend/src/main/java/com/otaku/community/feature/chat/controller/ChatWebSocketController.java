package com.otaku.community.feature.chat.controller;

import com.otaku.community.feature.chat.dto.MessageResponse;
import com.otaku.community.feature.chat.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final MessageService messageService;

    /**
     * Handle incoming chat messages via WebSocket
     * Client sends to: /app/chat/send
     */
    @MessageMapping("/chat/send")
    public void handleSendMessage(
            @Payload SendMessageWebSocketRequest request,
            @AuthenticationPrincipal Principal principal) {

        try {
            UUID senderId = UUID.fromString(principal.getName());
            UUID chatId = UUID.fromString(request.getChatId());

            log.debug("[WS][CHAT] Message received from user {} in chat {}", senderId, chatId);

            // Send message via service (handles persistence and delivery)
            MessageResponse response = messageService.sendMessage(
                    chatId,
                    senderId,
                    request.getContent());

            log.debug("[WS][CHAT] Message sent successfully: {}", response.getId());
        } catch (Exception e) {
            log.error("[WS][CHAT] Error handling message send", e);
        }
    }

    /**
     * Handle read receipt via WebSocket
     * Client sends to: /app/chat/read
     */
    @MessageMapping("/chat/read")
    public void handleMarkAsRead(
            @Payload MarkReadWebSocketRequest request,
            @AuthenticationPrincipal Principal principal) {

        try {
            UUID userId = UUID.fromString(principal.getName());
            UUID chatId = UUID.fromString(request.getChatId());

            log.debug("[WS][CHAT] Read receipt received from user {} for chat {}", userId, chatId);

            // Mark messages as read
            messageService.markMessagesAsRead(chatId, userId);

            log.debug("[WS][CHAT] Messages marked as read successfully");
        } catch (Exception e) {
            log.error("[WS][CHAT] Error handling read receipt", e);
        }
    }

    // Inner classes for WebSocket request payloads
    public static class SendMessageWebSocketRequest {
        private String chatId;
        private String content;

        public String getChatId() {
            return chatId;
        }

        public void setChatId(String chatId) {
            this.chatId = chatId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }

    public static class MarkReadWebSocketRequest {
        private String chatId;

        public String getChatId() {
            return chatId;
        }

        public void setChatId(String chatId) {
            this.chatId = chatId;
        }
    }
}

