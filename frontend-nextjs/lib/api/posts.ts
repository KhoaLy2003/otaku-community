import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Post } from '@/types/post'

export interface CreatePostData {
  content: string
  images?: string[]
  topicIds: string[]
}

export const postsApi = {
  getPosts: async (params?: {
    page?: number
    limit?: number
    topicId?: string
    userId?: string
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.topicId) queryParams.append('topicId', params.topicId)
    if (params?.userId) queryParams.append('userId', params.userId)

    const query = queryParams.toString()
    return apiClient.get<ApiResponse<PaginatedResponse<Post>>>(
      `/posts${query ? `?${query}` : ''}`
    )
  },

  getPost: async (id: string) => {
    return apiClient.get<ApiResponse<Post>>(`/posts/${id}`)
  },

  createPost: async (data: CreatePostData) => {
    return apiClient.post<ApiResponse<Post>>('/posts', data)
  },

  updatePost: async (id: string, data: Partial<CreatePostData>) => {
    return apiClient.put<ApiResponse<Post>>(`/posts/${id}`, data)
  },

  deletePost: async (id: string) => {
    return apiClient.delete<ApiResponse<void>>(`/posts/${id}`)
  },

  likePost: async (id: string) => {
    return apiClient.post<ApiResponse<void>>(`/posts/${id}/like`)
  },

  unlikePost: async (id: string) => {
    return apiClient.delete<ApiResponse<void>>(`/posts/${id}/like`)
  },
}



