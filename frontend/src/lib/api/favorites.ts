import { apiClient } from "./client";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export type PostReferenceType = "ANIME" | "MANGA";

export interface CreateFavoriteRequest {
  type: PostReferenceType;
  externalId: number;
  title: string;
  imageUrl?: string;
  note?: string;
}

export interface UpdateFavoriteRequest {
  note: string;
}

export interface FavoriteResponse {
  id: string;
  type: PostReferenceType;
  externalId: number;
  title: string;
  imageUrl?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export const favoritesApi = {
  addFavorite: (data: CreateFavoriteRequest) => {
    return apiClient.post<ApiResponse<FavoriteResponse>>("/favorites", data);
  },

  removeFavorite: (favoriteId: string) => {
    return apiClient.delete<ApiResponse<void>>(`/favorites/${favoriteId}`);
  },

  updateFavorite: (favoriteId: string, data: UpdateFavoriteRequest) => {
    return apiClient.put<ApiResponse<FavoriteResponse>>(
      `/favorites/${favoriteId}`,
      data
    );
  },

  getUserFavorites: (page = 0, size = 20) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return apiClient.get<ApiResponse<PaginatedResponse<FavoriteResponse>>>(
      `/favorites?${queryParams.toString()}`
    );
  },
};
