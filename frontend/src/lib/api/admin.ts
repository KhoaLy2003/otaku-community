import { apiClient } from "./client";
import type {
  AdminDashboardStats,
  AdminUserListItem,
  AdminUserDetail,
  SystemSettings,
  AdminUserRole,
  AdminReport,
  ReportStatus,
  RssSource,
  CreateRssSourceRequest,
  UpdateRssSourceRequest,
  SyncHistory,
  AdminNewsItem,
  RssFeedTestResult,
} from "@/types/admin";
import type { PaginatedResponse, ApiResponse } from "@/types/api";

export const adminApi = {
  // Dashboard
  getStats: () =>
    apiClient.get<ApiResponse<AdminDashboardStats>>("/admin/stats"),

  // User Management
  getUsers: (params: {
    query?: string;
    role?: AdminUserRole;
    status?: string;
    page?: number;
    size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.append("query", params.query);
    if (params.role) queryParams.append("role", params.role);
    if (params.status) queryParams.append("status", params.status);
    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.size !== undefined)
      queryParams.append("size", params.size.toString());

    return apiClient.get<ApiResponse<PaginatedResponse<AdminUserListItem>>>(
      `/admin/users?${queryParams.toString()}`,
    );
  },

  getUserDetail: (id: string) =>
    apiClient.get<ApiResponse<AdminUserDetail>>(`/admin/users/${id}`),

  updateUserRole: (id: string, role: AdminUserRole) =>
    apiClient.patch<ApiResponse<void>>(`/admin/users/${id}/role?role=${role}`),

  banUser: (id: string, reason?: string) =>
    apiClient.post<ApiResponse<void>>(
      `/admin/users/${id}/ban${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`,
    ),

  unbanUser: (id: string) =>
    apiClient.post<ApiResponse<void>>(`/admin/users/${id}/unban`),

  lockUser: (id: string, lock: boolean) =>
    apiClient.post<ApiResponse<void>>(`/admin/users/${id}/lock?lock=${lock}`),

  // Content Moderation
  getReports: (status?: ReportStatus, page?: number, size?: number) => {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    if (page !== undefined) queryParams.append("page", page.toString());
    if (size !== undefined) queryParams.append("size", size.toString());

    return apiClient.get<ApiResponse<PaginatedResponse<AdminReport>>>(
      `/admin/reports?${queryParams.toString()}`,
    );
  },

  resolveReport: (id: string, status: ReportStatus, notes?: string) =>
    apiClient.post<ApiResponse<void>>(
      `/admin/reports/${id}/resolve?status=${status}${notes ? `&notes=${encodeURIComponent(notes)}` : ""}`,
    ),

  moderatePost: (postId: string, shouldDelete: boolean) =>
    apiClient.post<ApiResponse<void>>(
      `/admin/reports/moderate/post/${postId}?delete=${shouldDelete}`,
    ),

  moderateComment: (commentId: string, shouldDelete: boolean) =>
    apiClient.post<ApiResponse<void>>(
      `/admin/reports/moderate/comment/${commentId}?delete=${shouldDelete}`,
    ),

  // Translation Management
  updateTranslationStatus: (id: string, status: string) =>
    apiClient.patch<ApiResponse<void>>(
      `/admin/translations/${id}/status?status=${status}`,
    ),

  verifyTranslation: (id: string, verified: boolean) =>
    apiClient.post<ApiResponse<void>>(
      `/admin/translations/${id}/verify?verified=${verified}`,
    ),

  // System Settings
  getSystemSettings: () =>
    apiClient.get<ApiResponse<SystemSettings>>("/admin/system/settings"),

  updateSystemSettings: (settings: SystemSettings) =>
    apiClient.put<ApiResponse<void>>("/admin/system/settings", settings),

  // RSS Source Management
  getRssSources: () =>
    apiClient.get<ApiResponse<RssSource[]>>("/admin/rss-sources"),

  createRssSource: (data: CreateRssSourceRequest) =>
    apiClient.post<ApiResponse<RssSource>>("/admin/rss-sources", data),

  updateRssSource: (id: string, data: UpdateRssSourceRequest) =>
    apiClient.put<ApiResponse<RssSource>>(`/admin/rss-sources/${id}`, data),

  deleteRssSource: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/admin/rss-sources/${id}`),

  syncRssSource: (id: string) =>
    apiClient.post<ApiResponse<void>>(`/admin/rss-sources/${id}/sync`),

  testRssSource: (url: string) =>
    apiClient.post<ApiResponse<RssFeedTestResult>>(`/admin/rss-sources/test`, {
      url,
    }),

  // Sync History
  getSyncHistory: (params: {
    sourceId?: string;
    status?: string;
    page?: number;
    size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.sourceId) queryParams.append("sourceId", params.sourceId);
    if (params.status) queryParams.append("status", params.status);
    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.size !== undefined)
      queryParams.append("size", params.size.toString());

    return apiClient.get<ApiResponse<PaginatedResponse<SyncHistory>>>(
      `/admin/sync-history?${queryParams.toString()}`,
    );
  },

  // News Management
  getAdminNews: (params: {
    source?: string;
    category?: string;
    deleted?: boolean;
    page?: number;
    size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.source) queryParams.append("source", params.source);
    if (params.category) queryParams.append("category", params.category);
    if (params.deleted !== undefined)
      queryParams.append("deleted", params.deleted.toString());
    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.size !== undefined)
      queryParams.append("size", params.size.toString());

    return apiClient.get<ApiResponse<PaginatedResponse<AdminNewsItem>>>(
      `/admin/news?${queryParams.toString()}`,
    );
  },

  deleteNews: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/admin/news/${id}`),

  restoreNews: (id: string) =>
    apiClient.post<ApiResponse<void>>(`/admin/news/${id}/restore`),
};
