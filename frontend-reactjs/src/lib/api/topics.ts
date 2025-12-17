import { apiClient } from './client';
import type { ApiResponse } from '../../types/api';
import type { Topic } from '../../types/topic';

export const topicsApi = {
  /**
   * Get default topics
   */
  getTopics: async (): Promise<ApiResponse<Topic[]>> => {
    return apiClient.get<ApiResponse<Topic[]>>('/topics/default');
  },
};
