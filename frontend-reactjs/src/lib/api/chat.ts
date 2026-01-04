import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { Chat, MessageListResponse } from "@/types/chat";

export const chatApi = {
  /**
   * Get user's conversation list
   */
  getChats: async (): Promise<ApiResponse<Chat[]>> => {
    return apiClient.get<ApiResponse<Chat[]>>("/v1/chats");
  },

  /**
   * Get message history for a chat (cursor-based pagination)
   */
  getMessages: async (
    chatId: string,
    cursor?: string,
    limit?: number
  ): Promise<ApiResponse<MessageListResponse>> => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit.toString());

    const queryString = params.toString();
    return apiClient.get<ApiResponse<MessageListResponse>>(
      `/v1/chats/${chatId}/messages${queryString ? `?${queryString}` : ""}`
    );
  },

  /**
   * Delete a message
   */
  deleteMessage: async (
    chatId: string,
    messageId: string
  ): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(
      `/v1/chats/${chatId}/messages/${messageId}`
    );
  },

  /**
   * Create or retrieve a chat with a specific user
   */
  createChat: async (userId: string): Promise<ApiResponse<Chat>> => {
    return apiClient.post<ApiResponse<Chat>>("/v1/chats", { userId });
  },
};
