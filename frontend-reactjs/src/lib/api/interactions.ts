import { apiClient } from "./client";
import type { ApiResponse } from "../../types/api";

export interface LikeResponse {
  postId: string;
  liked: boolean;
  likeCount: number;
}

export const interactionsApi = {
  /**
   * Like a post
   */
  likePost: async (postId: string): Promise<ApiResponse<LikeResponse>> => {
    return apiClient.post<ApiResponse<LikeResponse>>("/interactions/likes", {
      postId,
    });
  },

  /**
   * Unlike a post
   */
  unlikePost: async (postId: string): Promise<ApiResponse<LikeResponse>> => {
    return apiClient.delete<ApiResponse<LikeResponse>>(
      `/interactions/likes/${postId}`
    );
  },

  /**
   * Get like status for a post
   */
  getLikeStatus: async (postId: string): Promise<ApiResponse<LikeResponse>> => {
    return apiClient.get<ApiResponse<LikeResponse>>(
      `/interactions/likes/${postId}`
    );
  },
};
