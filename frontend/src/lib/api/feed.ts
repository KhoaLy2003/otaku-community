import { apiClient } from "./client";
import type { ApiResponse } from "../../types/api";
import type { UnifiedFeedResponse } from "../../types/feed";

export interface GetFeedRequest {
  postCursor?: string;
  newsCursor?: string;
  limit?: number;
  topicIds?: string[];
}

export type FeedResponse = UnifiedFeedResponse;

export const feedApi = {
  /**
   * Get explore feed
   */
  getExploreFeed: async (
    params?: GetFeedRequest,
  ): Promise<ApiResponse<FeedResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.postCursor) queryParams.append("postCursor", params.postCursor);
    if (params?.newsCursor) queryParams.append("newsCursor", params.newsCursor);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.topicIds) {
      params.topicIds.forEach((id) => queryParams.append("topicIds", id));
    }
    const query = queryParams.toString();
    return apiClient.get<ApiResponse<FeedResponse>>(
      `/feed/explore${query ? `?${query}` : ""}`,
    );
  },

  /**
   * Get home feed
   */
  getHomeFeed: async (
    params?: GetFeedRequest,
  ): Promise<ApiResponse<FeedResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.postCursor) queryParams.append("postCursor", params.postCursor);
    if (params?.newsCursor) queryParams.append("newsCursor", params.newsCursor);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    const query = queryParams.toString();
    return apiClient.get<ApiResponse<FeedResponse>>(
      `/feed/home${query ? `?${query}` : ""}`,
    );
  },
};
