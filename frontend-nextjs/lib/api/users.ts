import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { User, UserProfile } from '@/types/user'

export interface UpdateProfileData {
  username?: string
  bio?: string
  interests?: string[]
  location?: string
  avatar?: string
}

export const usersApi = {
  getUser: async (id: string) => {
    return apiClient.get<ApiResponse<UserProfile>>(`/users/${id}`)
  },

  updateProfile: async (data: UpdateProfileData) => {
    return apiClient.put<ApiResponse<User>>('/users/me', data)
  },

  followUser: async (id: string) => {
    return apiClient.post<ApiResponse<void>>(`/users/${id}/follow`)
  },

  unfollowUser: async (id: string) => {
    return apiClient.delete<ApiResponse<void>>(`/users/${id}/follow`)
  },

  getFollowers: async (userId: string, params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const query = queryParams.toString()
    return apiClient.get<ApiResponse<PaginatedResponse<User>>>(
      `/users/${userId}/followers${query ? `?${query}` : ''}`
    )
  },

  getFollowing: async (userId: string, params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const query = queryParams.toString()
    return apiClient.get<ApiResponse<PaginatedResponse<User>>>(
      `/users/${userId}/following${query ? `?${query}` : ''}`
    )
  },
}



