import { apiClient } from "./client";
import type { ApiResponse, PaginatedResponse } from "../../types/api";
import type { LoginHistory, ActivityLog } from "../../types/user";

export const activityApi = {
  /**
   * Get login history
   */
  getLoginHistory: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<LoginHistory>>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    return apiClient.get<ApiResponse<PaginatedResponse<LoginHistory>>>(
      `/v1/activity/login-history?${queryParams.toString()}`
    );
  },

  /**
   * Get activity log
   */
  getActivityLog: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<ActivityLog>>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    return apiClient.get<ApiResponse<PaginatedResponse<ActivityLog>>>(
      `/v1/activity/log?${queryParams.toString()}`
    );
  },
};
