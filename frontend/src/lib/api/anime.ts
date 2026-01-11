import { apiClient } from "./client";
import type { Anime } from "../../types/anime";

export interface PageResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface AnimeSearchParams {
  q?: string;
  type?: string;
  status?: string;
  page?: number;
}

export const animeApi = {
  /**
   * Search anime with filters
   */
  searchAnime: async (
    params: AnimeSearchParams
  ): Promise<PageResponse<Anime>> => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append("q", params.q);
    if (params.type) queryParams.append("type", params.type);
    if (params.status) queryParams.append("status", params.status);
    if (params.page) queryParams.append("page", params.page.toString());

    const endpoint = `/v1/anime/search${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiClient.get<PageResponse<Anime>>(endpoint);
  },

  /**
   * Get anime by ID
   */
  getAnimeById: async (id: number | string): Promise<Anime> => {
    return apiClient.get<Anime>(`/v1/anime/${id}`);
  },

  /**
   * Get trending/top anime
   */
  getTrendingAnime: async (page: number = 1): Promise<PageResponse<Anime>> => {
    return apiClient.get<PageResponse<Anime>>(
      `/v1/anime/trending?page=${page}`
    );
  },

  /**
   * Get seasonal anime
   */
  getSeasonalAnime: async (page: number = 1): Promise<PageResponse<Anime>> => {
    return apiClient.get<PageResponse<Anime>>(
      `/v1/anime/seasonal?page=${page}`
    );
  },
};
