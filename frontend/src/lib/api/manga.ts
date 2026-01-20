import { apiClient } from "./client";
import type {
  Manga,
  TranslationSummary,
  TranslationDetail,
  Chapter,
  UploadJob,
  TranslationComment,
  UserTranslationsResponse,
  TranslationStats,
  TranslatorRanking,
} from "../../types/manga";
import type { PaginatedResponse, ApiResponse } from "../../types/api";

export interface MangaSearchParams {
  q?: string;
  type?: string;
  status?: string;
  page?: number;
}

export const mangaApi = {
  /**
   * Get my translations
   */
  getMyTranslations: async (): Promise<ApiResponse<TranslationSummary[]>> => {
    return apiClient.get<ApiResponse<TranslationSummary[]>>(
      "/v1/translations/me",
    );
  },

  /**
   * Search manga with filters
   */
  searchManga: async (
    params: MangaSearchParams,
  ): Promise<ApiResponse<PaginatedResponse<Manga>>> => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append("q", params.q);
    if (params.type) queryParams.append("type", params.type);
    if (params.status) queryParams.append("status", params.status);
    if (params.page) queryParams.append("page", params.page.toString());

    const endpoint = `/v1/manga/search${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiClient.get<ApiResponse<PaginatedResponse<Manga>>>(endpoint);
  },

  /**
   * Get manga by ID
   */
  getMangaById: async (id: number | string): Promise<ApiResponse<Manga>> => {
    return apiClient.get<ApiResponse<Manga>>(`/v1/manga/${id}`);
  },

  /**
   * Get top manga
   */
  getTopManga: async (
    page: number = 1,
  ): Promise<ApiResponse<PaginatedResponse<Manga>>> => {
    return apiClient.get<ApiResponse<PaginatedResponse<Manga>>>(
      `/v1/manga/top?page=${page}`,
    );
  },

  /**
   * Get translations for a chapter
   */
  getTranslationsForChapter: async (
    chapterId: string,
  ): Promise<ApiResponse<TranslationSummary[]>> => {
    return apiClient.get<ApiResponse<TranslationSummary[]>>(
      `/v1/chapters/${chapterId}/translations`,
    );
  },

  /**
   * Get translation detail
   */
  getTranslationDetail: async (
    translationId: string,
  ): Promise<ApiResponse<TranslationDetail>> => {
    return apiClient.get<ApiResponse<TranslationDetail>>(
      `/v1/translations/${translationId}`,
    );
  },

  /**
   * Get manga chapters
   */
  getMangaChapters: async (
    mangaId: string,
  ): Promise<ApiResponse<Chapter[]>> => {
    return apiClient.get<ApiResponse<Chapter[]>>(
      `/v1/manga/${mangaId}/chapters`,
    );
  },

  /**
   * Ensure chapter exists
   */
  ensureChapter: async (
    mangaId: string,
    chapterNumber: number,
    title?: string,
  ): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>(
      `/v1/manga/${mangaId}/chapters/ensure?chapterNumber=${chapterNumber}${title ? `&title=${encodeURIComponent(title)}` : ""}`,
      {},
    );
  },

  /**
   * Sync manga from Jikan
   */
  syncManga: async (malId: string): Promise<ApiResponse<Manga>> => {
    return apiClient.post<ApiResponse<Manga>>(`/v1/manga/sync/${malId}`, {});
  },

  /**
   * Create an upload job
   */
  createUploadJob: async (data: {
    mangaId: string;
    chapterId?: string;
    translationName: string;
    notes: string;
  }): Promise<ApiResponse<UploadJob>> => {
    return apiClient.post<ApiResponse<UploadJob>>(
      "/v1/translations/upload-jobs",
      data,
    );
  },

  /**
   * Upload pages in batch
   */
  uploadPagesBatch: async (
    jobId: string,
    files: File[],
    startPageIndex?: number,
  ): Promise<ApiResponse<UploadJob>> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (startPageIndex !== undefined) {
      formData.append("startPageIndex", startPageIndex.toString());
    }

    return apiClient.post<ApiResponse<UploadJob>>(
      `/v1/upload-jobs/${jobId}/pages/batch`,
      formData,
    );
  },

  /**
   * Phase 1: Upload files in chunks for better performance and error handling
   */
  uploadPagesInChunks: async (
    jobId: string,
    files: File[],
    chunkSize: number = 10,
    onChunkComplete?: (uploadedCount: number, totalCount: number) => void,
  ): Promise<void> => {
    for (let i = 0; i < files.length; i += chunkSize) {
      const chunk = files.slice(i, i + chunkSize);
      await mangaApi.uploadPagesBatch(jobId, chunk, i);
      onChunkComplete?.(Math.min(i + chunkSize, files.length), files.length);
    }
  },

  /**
   * Get upload job status
   */
  getUploadJobStatus: async (
    jobId: string,
  ): Promise<ApiResponse<UploadJob>> => {
    return apiClient.get<ApiResponse<UploadJob>>(`/v1/upload-jobs/${jobId}`);
  },

  /**
   * Cancel an upload job
   */
  cancelUploadJob: async (jobId: string): Promise<ApiResponse<UploadJob>> => {
    return apiClient.post<ApiResponse<UploadJob>>(
      `/v1/upload-jobs/${jobId}/cancel`,
      {},
    );
  },

  /**
   * Delete a translation
   */
  deleteTranslation: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/v1/translations/${id}`);
  },

  /**
   * Publish a translation
   */
  publishTranslation: async (
    id: string,
  ): Promise<ApiResponse<TranslationSummary>> => {
    return apiClient.post<ApiResponse<TranslationSummary>>(
      `/v1/translations/${id}/publish`,
      {},
    );
  },

  /**
   * Update translation metadata
   */
  updateTranslation: async (
    id: string,
    data: { name?: string; notes?: string },
  ): Promise<ApiResponse<TranslationSummary>> => {
    return apiClient.put<ApiResponse<TranslationSummary>>(
      `/v1/translations/${id}`,
      data,
    );
  },

  /**
   * Reorder translation pages
   */
  reorderPages: async (
    id: string,
    data: { pages: { pageId: string; pageIndex: number }[] },
  ): Promise<ApiResponse<void>> => {
    return apiClient.put<ApiResponse<void>>(
      `/v1/translations/${id}/pages/reorder`,
      data,
    );
  },

  /**
   * Register a view for a translation
   */
  registerView: async (id: string): Promise<ApiResponse<TranslationStats>> => {
    return apiClient.post<ApiResponse<TranslationStats>>(
      `/v1/translations/${id}/views`,
      {},
    );
  },

  /**
   * Toggle reaction (like) on a translation
   */
  toggleReaction: async (
    id: string,
  ): Promise<ApiResponse<TranslationStats>> => {
    return apiClient.post<ApiResponse<TranslationStats>>(
      `/v1/translations/${id}/reactions`,
      {},
    );
  },

  /**
   * Get like status for the current user
   */
  getLikeStatus: async (id: string): Promise<ApiResponse<boolean>> => {
    return apiClient.get<ApiResponse<boolean>>(
      `/v1/translations/${id}/like-status`,
    );
  },

  /**
   * Get comments for a translation
   */
  getComments: async (
    id: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResponse<PaginatedResponse<TranslationComment>>> => {
    return apiClient.get<ApiResponse<PaginatedResponse<TranslationComment>>>(
      `/v1/translations/${id}/comments?page=${page}&limit=${limit}`,
    );
  },

  /**
   * Post a comment on a translation
   */
  postComment: async (
    id: string,
    data: { content: string; parentId?: string },
  ): Promise<ApiResponse<TranslationComment>> => {
    return apiClient.post<ApiResponse<TranslationComment>>(
      `/v1/translations/${id}/comments`,
      data,
    );
  },

  /**
   * Get latest translations
   */
  getLatestTranslations: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<TranslationSummary[]>> => {
    return apiClient.get<ApiResponse<TranslationSummary[]>>(
      `/v1/translations/latest?page=${page}&limit=${limit}`,
    );
  },

  /**
   * Get trending translations
   */
  getTrendingTranslations: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<TranslationSummary[]>> => {
    return apiClient.get<ApiResponse<TranslationSummary[]>>(
      `/v1/translations/trending?page=${page}&limit=${limit}`,
    );
  },

  /**
   * Get user translations work history
   */
  getUserTranslations: async (
    username: string,
  ): Promise<ApiResponse<UserTranslationsResponse>> => {
    return apiClient.get<ApiResponse<UserTranslationsResponse>>(
      `/v1/translations/user/${username}`,
    );
  },
  /**
   * Get translator rankings
   */
  getTranslatorRankings: async (
    period: string = "all-time",
    limit: number = 10,
  ): Promise<ApiResponse<TranslatorRanking[]>> => {
    return apiClient.get<ApiResponse<TranslatorRanking[]>>(
      `/v1/rankings/translators?period=${period}&limit=${limit}`,
    );
  },
};
