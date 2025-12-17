import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Topic } from '@/types/topic'

export const topicsApi = {
  getTopics: async (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const query = queryParams.toString()
    return apiClient.get<ApiResponse<PaginatedResponse<Topic>>>(
      `/topics${query ? `?${query}` : ''}`
    )
  },

  getTopic: async (id: string) => {
    return apiClient.get<ApiResponse<Topic>>(`/topics/${id}`)
  },

  getTopicBySlug: async (slug: string) => {
    return apiClient.get<ApiResponse<Topic>>(`/topics/slug/${slug}`)
  },

  followTopic: async (id: string) => {
    return apiClient.post<ApiResponse<void>>(`/topics/${id}/follow`)
  },

  unfollowTopic: async (id: string) => {
    return apiClient.delete<ApiResponse<void>>(`/topics/${id}/follow`)
  },
}



