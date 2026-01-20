import { apiClient } from "./client";
import type { Anime, SeasonArchive, Character } from "../../types/anime";
import type { ApiResponse } from "../../types/api";

export interface PageResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
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
    params: AnimeSearchParams,
  ): Promise<ApiResponse<PageResponse<Anime>>> => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append("q", params.q);
    if (params.type) queryParams.append("type", params.type);
    if (params.status) queryParams.append("status", params.status);
    if (params.page) queryParams.append("page", params.page.toString());

    const endpoint = `/v1/anime/search${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiClient.get<ApiResponse<PageResponse<Anime>>>(endpoint);
  },

  /**
   * Get anime by ID
   */
  getAnimeById: async (id: number | string): Promise<ApiResponse<Anime>> => {
    return apiClient.get<ApiResponse<Anime>>(`/v1/anime/${id}`);
  },

  /**
   * Get trending/top anime
   */
  getTrendingAnime: async (
    page: number = 1,
  ): Promise<ApiResponse<PageResponse<Anime>>> => {
    return apiClient.get<ApiResponse<PageResponse<Anime>>>(
      `/v1/anime/trending?page=${page}`,
    );
  },

  /**
   * Get seasonal anime (current or specific year/season)
   */
  getSeasonalAnime: async (
    page: number = 1,
    year?: number,
    season?: string,
  ): Promise<ApiResponse<PageResponse<Anime>>> => {
    const endpoint =
      year && season
        ? `/v1/anime/seasons/${year}/${season}?page=${page}`
        : `/v1/anime/seasonal?page=${page}`;
    return apiClient.get<ApiResponse<PageResponse<Anime>>>(endpoint);
  },

  /**
   * Get seasons archive
   */
  getSeasonsArchive: async (): Promise<ApiResponse<SeasonArchive[]>> => {
    return apiClient.get<ApiResponse<SeasonArchive[]>>("/v1/anime/seasons");
  },

  /**
   * Search characters
   */
  searchCharacters: async (
    query: string,
    page: number = 1,
  ): Promise<ApiResponse<PageResponse<Character>>> => {
    return apiClient.get<ApiResponse<PageResponse<Character>>>(
      `/v1/anime/characters/search?q=${query}&page=${page}`,
    );
  },
};
