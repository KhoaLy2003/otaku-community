package com.otaku.community.feature.chat.controller;

import com.otaku.community.common.annotation.CurrentUserId;
import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.chat.dto.ChatResponse;
import com.otaku.community.feature.chat.dto.CreateChatRequest;
import com.otaku.community.feature.chat.dto.MessageListResponse;
import com.otaku.community.feature.chat.service.ChatService;
import com.otaku.community.feature.chat.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
@Tag(name = "Chat", description = "Chat management APIs")
public class ChatController {

    private final ChatService chatService;
    private final MessageService messageService;

    @GetMapping
    @Operation(summary = "Get user's conversation list", description = "Retrieves all 1:1 conversations for the authenticated user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ChatResponse>>> getChats(@CurrentUserId UUID userId) {
        List<ChatResponse> chats = chatService.getUserChats(userId);
        return ResponseEntity.ok(ApiResponse.success(chats));
    }

    @GetMapping("/{chatId}/messages")
    @Operation(summary = "Get message history", description = "Retrieves message history for a chat using cursor-based pagination")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MessageListResponse>> getMessages(
            @PathVariable UUID chatId,
            @CurrentUserId UUID userId,
            @RequestParam(required = false) String cursor,
            @RequestParam(required = false) Integer limit) {

        MessageListResponse messages = messageService.getMessages(chatId, cursor, limit, userId);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @DeleteMapping("/{chatId}/messages/{messageId}")
    @Operation(summary = "Delete a message", description = "Soft deletes a message sent by the authenticated user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(
            @PathVariable UUID chatId,
            @PathVariable UUID messageId,
            @CurrentUserId UUID userId) {

        messageService.deleteMessage(messageId, userId);
        return ResponseEntity.ok(ApiResponse.success("Message deleted successfully", null));
    }

    @PostMapping
    @Operation(summary = "Start a chat", description = "Creates a new chat or retrieves existing one with the target user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ChatResponse>> createChat(
            @RequestBody CreateChatRequest request,
            @CurrentUserId UUID userId) {
        ChatResponse chat = chatService.createChat(userId, request.getUserId());
        return ResponseEntity.ok(ApiResponse.success(chat));
    }
}
