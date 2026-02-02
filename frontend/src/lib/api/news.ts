import { apiClient } from "./client";
import type { ApiResponse, PaginatedResponse } from "../../types/api";
import type { NewsResponse, NewsFilters } from "../../types/news";

export const newsApi = {
  getNews: (filters: NewsFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.source) params.append("source", filters.source);
    if (filters.category) params.append("category", filters.category);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient.get<ApiResponse<PaginatedResponse<NewsResponse>>>(
      `/v1/news?${params.toString()}`,
    );
  },

  getNewsById: (id: string) => {
    return apiClient.get<ApiResponse<NewsResponse>>(`/v1/news/${id}`);
  },
};
