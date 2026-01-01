import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { Notification } from "@/types/notification";

export interface PageResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UnreadCountResponse {
  count: number;
}

export const notificationApi = {
  /**
   * Get notifications (paginated)
   */
  getNotifications: async (
    page = 0,
    limit = 10
  ): Promise<ApiResponse<PageResponse<Notification>>> => {
    return apiClient.get<ApiResponse<PageResponse<Notification>>>(
      `/notifications?page=${page}&limit=${limit}`
    );
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<ApiResponse<UnreadCountResponse>> => {
    return apiClient.get<ApiResponse<UnreadCountResponse>>(
      `/notifications/unread-count`
    );
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.patch<ApiResponse<null>>(
      `/notifications/${id}/read`
    );
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    return apiClient.patch<ApiResponse<null>>(
      `/notifications/read-all`
    );
  },
};