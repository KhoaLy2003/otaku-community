import { apiClient } from "./client";
import type {
  ApiResponse,
  CursorPaginatedResponse,
  PaginatedResponse,
} from "../../types/api";
import type {
  Post,
  PostWithDetails,
  PostMedia,
  PostStatus,
  FeedPost,
  PostReferenceRequest,
} from "../../types/post";
import type { UserListItem } from "../../types/user";

export interface CreatePostRequest {
  title: string;
  content?: string;
  status?: PostStatus;
  topicIds?: string[];
  files?: File[];
  references?: PostReferenceRequest[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  status?: PostStatus;
  topicIds?: string[];
  references?: PostReferenceRequest[];
}

export interface MediaItemRequest {
  url: string;
  type: "IMAGE" | "VIDEO" | "GIF";
}

export interface UserMediaResponse {
  media: PostMedia[];
  nextCursor?: string;
  hasMore: boolean;
}

export const postsApi = {
  /**
   * Create a new post with file uploads
   */
  createPost: async (data: CreatePostRequest): Promise<ApiResponse<Post>> => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.content) formData.append("content", data.content);
    if (data.status) formData.append("status", data.status);

    if (data.topicIds) {
      data.topicIds.forEach((id) => {
        formData.append("topicIds", id);
      });
    }

    if (data.files) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    if (data.references) {
      formData.append("referencesJson", JSON.stringify(data.references));
    }

    return apiClient.post<ApiResponse<Post>>("/posts", formData);
  },

  /**
   * Update an existing post
   */
  updatePost: async (
    postId: string,
    data: UpdatePostRequest
  ): Promise<ApiResponse<Post>> => {
    return apiClient.put<ApiResponse<Post>>(`/posts/${postId}`, data);
  },

  /**
   * Delete a post
   */
  deletePost: async (postId: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(`/posts/${postId}`);
  },

  /**
   * Get Detailed Post Information
   */
  getPostDetails: async (
    postId: string
  ): Promise<ApiResponse<PostWithDetails>> => {
    return apiClient.get<ApiResponse<PostWithDetails>>(
      `/posts/${postId}/detail`
    );
  },

  /**
   * Get Posts by User
   */
  getPostsByUser: async (
    username: string,
    params?: {
      cursor?: string;
      limit?: number;
    }
  ): Promise<ApiResponse<CursorPaginatedResponse<FeedPost>>> => {
    const queryParams = new URLSearchParams();
    if (params?.cursor) queryParams.append("cursor", params.cursor);
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const query = queryParams.toString();
    return apiClient.get<ApiResponse<CursorPaginatedResponse<FeedPost>>>(
      `/posts/user/${username}${query ? `?${query}` : ""}`
    );
  },

  /**
   * Get User Media
   */
  getUserMedia: async (
    username: string,
    params?: {
      cursor?: string;
      limit?: number;
    }
  ): Promise<ApiResponse<UserMediaResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.cursor) queryParams.append("cursor", params.cursor);
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const query = queryParams.toString();
    return apiClient.get<ApiResponse<UserMediaResponse>>(
      `/posts/user/${username}/media${query ? `?${query}` : ""}`
    );
  },

  /**
   * Publish a Post
   */
  publishPost: async (postId: string): Promise<ApiResponse<Post>> => {
    return apiClient.post<ApiResponse<Post>>(`/posts/${postId}/publish`);
  },

  /**
   * Convert Post to Draft
   */
  draftPost: async (postId: string): Promise<ApiResponse<Post>> => {
    return apiClient.post<ApiResponse<Post>>(`/posts/${postId}/draft`);
  },

  /**
   * Check Post Ownership
   */
  checkPostOwnership: async (postId: string): Promise<ApiResponse<boolean>> => {
    return apiClient.get<ApiResponse<boolean>>(`/posts/${postId}/owner`);
  },

  /**
   * Upload Media Files for a Post
   */
  uploadMedia: async (
    postId: string,
    files: File[]
  ): Promise<ApiResponse<PostMedia[]>> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return apiClient.post<ApiResponse<PostMedia[]>>(
      `/posts/${postId}/media/upload`,
      formData
    );
  },

  /**
   * Add Media from URLs
   */
  addMediaFromUrls: async (
    postId: string,
    mediaItems: MediaItemRequest[]
  ): Promise<ApiResponse<PostMedia[]>> => {
    return apiClient.post<ApiResponse<PostMedia[]>>(
      `/posts/${postId}/media`,
      mediaItems
    );
  },

  /**
   * Get Post Media
   */
  getPostMedia: async (postId: string): Promise<ApiResponse<PostMedia[]>> => {
    return apiClient.get<ApiResponse<PostMedia[]>>(`/posts/${postId}/media`);
  },

  /**
   * Update Media Order
   */
  updateMediaOrder: async (
    postId: string,
    mediaIds: string[]
  ): Promise<ApiResponse<PostMedia[]>> => {
    return apiClient.put<ApiResponse<PostMedia[]>>(
      `/posts/${postId}/media/order`,
      mediaIds
    );
  },

  /**
   * Delete Post Media
   */
  deletePostMedia: async (
    postId: string,
    mediaId: string
  ): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(
      `/posts/${postId}/media/${mediaId}`
    );
  },

  /**
   * Get users who liked a post
   */
  getPostLikes: async (
    postId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<PaginatedResponse<UserListItem>>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const query = queryParams.toString();
    return apiClient.get<ApiResponse<PaginatedResponse<UserListItem>>>(
      `/posts/${postId}/likes${query ? `?${query}` : ""}`
    );
  },
};
