import type { User, ActivityLog } from "./user";

export type AdminUserRole = "ADMIN" | "USER";
export type AdminUserStatus = "ACTIVE" | "LOCKED" | "BANNED";

export interface AdminUserListItem {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  isLocked: boolean;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUserListItem {
  coverImageUrl: string;
  location: string;
  interests: string[];
  totalMangaViews: number;
  totalMangaUpvotes: number;
  totalTranslations: number;
  updatedAt: string;
  deletedAt: string | null;
  recentActivities: ActivityLog[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  newUsers24h: number;
  pendingReports: number;
  pendingTranslations: number;
  activePosts: number;
  moderationActions: number;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  maxUploadSizeMB: number;
  announcement: string;
  announcementActive: boolean;
}

export type ReportStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "RESOLVED"
  | "DISMISSED";

export interface AdminReport {
  id: string;
  reporterId: string;
  reporterUsername: string;
  targetId: string;
  targetType:
    | "POST"
    | "COMMENT"
    | "IP_ADDRESS"
    | "TRANSLATION"
    | "REPORT"
    | "SYSTEM_CONFIG";
  reason: string;
  details: string;
  status: ReportStatus;
  moderatorNotes: string;
  moderatorId: string | null;
  createdAt: string;
}

// RSS & News Management Types
export interface RssSource {
  id: string;
  name: string;
  url: string;
  priority: number;
  enabled: boolean;
  syncIntervalMinutes?: number; // Optional in frontend listing if not always needed, but good to have
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  createdAt: string;
}

export interface CreateRssSourceRequest {
  name: string;
  url: string;
  priority: number;
  enabled?: boolean;
}

export interface UpdateRssSourceRequest {
  name?: string;
  url?: string;
  priority?: number;
  enabled?: boolean;
}

export interface SyncHistory {
  id: string;
  sourceId: string;
  sourceName: string;
  status: "SUCCESS" | "FAILED" | "PARTIAL";
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  itemsFetched: number;
  itemsNew: number;
  errorMessage: string | null;
}

export interface AdminNewsItem {
  id: string;
  title: string;
  source: string; // Enum or string
  category: string | null;
  publishedAt: string;
  createdAt: string;
  views: number; // Assuming we have this
  bookmarks: number; // Assuming we have this
  deletedAt: string | null;
}

export interface RssFeedTestResult {
  success: boolean;
  title?: string;
  description?: string;
  itemCount?: number;
  sampleTitles?: string[];
  error?: string;
}
