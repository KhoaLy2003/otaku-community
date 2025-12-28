import { apiClient } from "./client";
import type { ApiResponse, CursorPaginatedResponse } from "../../types/api";
import type { FeedPost } from "../../types/post";

export interface GetFeedRequest {
  cursor?: string;
  limit?: number;
  topicIds?: string[];
}

export type FeedResponse = CursorPaginatedResponse<FeedPost>;

export const feedApi = {
  /**
   * Get explore feed
   */
  getExploreFeed: async (
    params?: GetFeedRequest
  ): Promise<ApiResponse<FeedResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.cursor) queryParams.append("cursor", params.cursor);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.topicIds) {
      params.topicIds.forEach((id) => queryParams.append("topicIds", id));
    }
    const query = queryParams.toString();
    return apiClient.get<ApiResponse<FeedResponse>>(
      `/feed/explore${query ? `?${query}` : ""}`
    );
  },

  /**
   * Get home feed
   */
  getHomeFeed: async (
    params?: GetFeedRequest
  ): Promise<ApiResponse<FeedResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.cursor) queryParams.append("cursor", params.cursor);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    const query = queryParams.toString();
    return apiClient.get<ApiResponse<FeedResponse>>(
      `/feed/home${query ? `?${query}` : ""}`
    );
  },
};
