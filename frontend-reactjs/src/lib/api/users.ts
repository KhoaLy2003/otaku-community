import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse } from '../../types/api';
import type { User, UserProfile } from '../../types/user';

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  interests?: string[];
  location?: string;
  avatar?: string;
}

export interface UserSyncRequest {
  auth0Id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  name?: string;
  nickname?: string;
  locale?: string;
}

export interface UserSyncResponse {
  id: string;
  auth0Id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  interests: string[];
  location?: string;
  role: string;
  isNewUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export const usersApi = {
  /**
   * Sync user data with backend (replaces Next.js API route)
   */
  syncUser: async (data: UserSyncRequest): Promise<ApiResponse<UserSyncResponse>> => {
    return apiClient.post<ApiResponse<UserSyncResponse>>('/users/sync', data);
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<ApiResponse<UserSyncResponse>> => {
    return apiClient.get<ApiResponse<UserSyncResponse>>('/users/me');
  },

  /**
   * Get user by ID
   */
  getUser: async (id: string): Promise<ApiResponse<UserProfile>> => {
    return apiClient.get<ApiResponse<UserProfile>>(`/users/${id}`);
  },

  /**
   * Get user by username
   */
  getUserByUsername: async (username: string): Promise<ApiResponse<UserProfile>> => {
    return apiClient.get<ApiResponse<UserProfile>>(`/users/username/${username}`);
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
    return apiClient.put<ApiResponse<User>>('/users/me', data);
  },

  /**
   * Follow a user
   */
  followUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(`/users/${id}/follow`);
  },

  /**
   * Unfollow a user
   */
  unfollowUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/users/${id}/follow`);
  },

  /**
   * Get user followers
   */
  getFollowers: async (
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return apiClient.get<ApiResponse<PaginatedResponse<User>>>(
      `/users/${userId}/followers${query ? `?${query}` : ''}`
    );
  },

  /**
   * Get users that a user is following
   */
  getFollowing: async (
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return apiClient.get<ApiResponse<PaginatedResponse<User>>>(
      `/users/${userId}/following${query ? `?${query}` : ''}`
    );
  },
};