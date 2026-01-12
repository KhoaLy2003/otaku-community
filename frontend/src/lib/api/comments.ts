import { apiClient } from "./client";
import type { ApiResponse } from "../../types/api";
import type { Comment } from "../../types/comment";

export interface CreateCommentRequest {
  content: string;
  postId: string;
  parentId?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export const commentsApi = {
  /**
   * Create a new comment
   */
  createComment: async (
    data: CreateCommentRequest,
    file?: File
  ): Promise<ApiResponse<Comment>> => {
    if (file) {
      const formData = new FormData();
      formData.append("postId", data.postId);
      formData.append("content", data.content);
      if (data.parentId) formData.append("parentId", data.parentId);
      formData.append("file", file);
      return apiClient.post<ApiResponse<Comment>>(
        `/interactions/comments`,
        formData
      );
    }
    return apiClient.post<ApiResponse<Comment>>(`/interactions/comments`, data);
  },

  /**
   * Update an existing comment
   */
  updateComment: async (
    commentId: string,
    data: UpdateCommentRequest,
    file?: File
  ): Promise<ApiResponse<Comment>> => {
    if (file) {
      const formData = new FormData();
      formData.append("content", data.content);
      formData.append("file", file);
      return apiClient.put<ApiResponse<Comment>>(
        `/interactions/comments/${commentId}`,
        formData
      );
    }
    return apiClient.put<ApiResponse<Comment>>(
      `/interactions/comments/${commentId}`,
      data
    );
  },

  /**
   * Delete a comment
   */
  deleteComment: async (commentId: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(
      `/interactions/comments/${commentId}`
    );
  },
};
