import { apiClient } from "./client";
import type { Manga } from "../../types/manga";
import type { PageResponse } from "./anime";

export interface MangaSearchParams {
  q?: string;
  type?: string;
  status?: string;
  page?: number;
}

export const mangaApi = {
  /**
   * Search manga with filters
   */
  searchManga: async (
    params: MangaSearchParams
  ): Promise<PageResponse<Manga>> => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append("q", params.q);
    if (params.type) queryParams.append("type", params.type);
    if (params.status) queryParams.append("status", params.status);
    if (params.page) queryParams.append("page", params.page.toString());

    const endpoint = `/v1/manga/search${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiClient.get<PageResponse<Manga>>(endpoint);
  },

  /**
   * Get manga by ID
   */
  getMangaById: async (id: number | string): Promise<Manga> => {
    return apiClient.get<Manga>(`/v1/manga/${id}`);
  },

  /**
   * Get top manga
   */
  getTopManga: async (page: number = 1): Promise<PageResponse<Manga>> => {
    return apiClient.get<PageResponse<Manga>>(`/v1/manga/top?page=${page}`);
  },
};
