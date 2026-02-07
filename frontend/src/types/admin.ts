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
  pendingFeedbacks: number;
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

export type FeedbackType =
  | "REPORT"
  | "SUGGESTION"
  | "BUG"
  | "FEATURE_REQUEST"
  | "COMPLAINT"
  | "CONTACT"
  | "OTHER";

export type FeedbackStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "WAITING_USER"
  | "RESOLVED"
  | "CLOSED";

export type FeedbackPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "TOXICITY"
  | "LOW_QUALITY"
  | "COPYRIGHT"
  | "NSFW"
  | "OTHER";

export type FeedbackTargetType =
  | "USER"
  | "POST"
  | "COMMENT"
  | "TRANSLATION"
  | "SYSTEM"
  | "IP_ADDRESS"
  | "NONE";

export interface AdminFeedback {
  id: string;
  type: FeedbackType;
  title: string | null;
  content: string;
  targetType: FeedbackTargetType | null;
  targetId: string | null;
  status: FeedbackStatus;
  priority: FeedbackPriority | null;
  reason: ReportReason | null;
  moderatorNotes: string | null;
  moderatorId: string | null;
  reporterId: string | null;
  reporterEmail: string | null;
  reporterName: string | null;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
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
