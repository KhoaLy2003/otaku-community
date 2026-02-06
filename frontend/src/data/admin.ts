import type { UserListItem } from "@/types/user";

export const mockAdminStats = {
  totalUsers: 1240,
  newUsers24h: 15,
  pendingReports: 8,
  pendingTranslations: 12,
  activePosts: 450,
  moderationActions: 124,
};

export const mockUsers: (UserListItem & {
  role: string;
  email: string;
  createdAt: string;
  status: string;
})[] = [
  {
    id: "1",
    username: "khoa_admin",
    //displayName: "Khoa Admin",
    email: "admin@otaku.com",
    avatarUrl: "https://i.pravatar.cc/150?u=1",
    bio: "Chief Administrator",
    isFollowing: false,
    profileVisibility: "PUBLIC",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2023-12-01T10:00:00Z",
  },
  {
    id: "2",
    username: "moderator_san",
    //displayName: "Mod San",
    email: "mod@otaku.com",
    avatarUrl: "https://i.pravatar.cc/150?u=2",
    bio: "Content Moderator",
    isFollowing: false,
    profileVisibility: "PUBLIC",
    role: "MODERATOR",
    status: "ACTIVE",
    createdAt: "2023-12-05T14:30:00Z",
  },
  {
    id: "3",
    username: "translator_king",
    //displayName: "Trans King",
    email: "king@trans.com",
    avatarUrl: "https://i.pravatar.cc/150?u=3",
    bio: "Top Translator",
    isFollowing: true,
    profileVisibility: "PUBLIC",
    role: "TRANSLATOR",
    status: "ACTIVE",
    createdAt: "2023-12-10T09:15:00Z",
  },
  {
    id: "4",
    username: "toxic_user",
    //displayName: "Problem Maker",
    email: "toxic@gmail.com",
    avatarUrl: "https://i.pravatar.cc/150?u=4",
    bio: "Just causing trouble",
    isFollowing: false,
    profileVisibility: "PRIVATE",
    role: "USER",
    status: "BANNED",
    createdAt: "2024-01-15T22:00:00Z",
  },
  {
    id: "5",
    username: "newbie_otaku",
    //displayName: "Newbie",
    email: "newbie@otaku.com",
    avatarUrl: "https://i.pravatar.cc/150?u=5",
    bio: "Love anime and manga!",
    isFollowing: false,
    profileVisibility: "PUBLIC",
    role: "USER",
    status: "ACTIVE",
    createdAt: "2024-01-28T16:45:00Z",
  },
];

export const mockReports = [
  {
    id: "rep1",
    contentId: "post123",
    contentType: "POST",
    contentSnippet: "This is a toxic comment containing banned words...",
    reason: "Harassment/Toxicity",
    reportedBy: "good_user",
    author: "toxic_user",
    status: "PENDING",
    createdAt: "2024-01-31T08:00:00Z",
  },
  {
    id: "rep2",
    contentId: "post456",
    contentType: "COMMENT",
    contentSnippet: "Spam message promoting fake gambling site...",
    reason: "Spam",
    reportedBy: "khoa_admin",
    author: "scammer404",
    status: "PENDING",
    createdAt: "2024-01-31T09:30:00Z",
  },
  {
    id: "rep3",
    contentId: "manga789",
    contentType: "TRANSLATION",
    contentSnippet: "Low quality translation with many typos.",
    reason: "Low Quality",
    reportedBy: "perfectionist",
    author: "lazy_trans",
    status: "UNDER_REVIEW",
    createdAt: "2024-01-30T15:20:00Z",
  },
];

export const mockSettings = {
  maintenanceMode: false,
  allowRegistrations: true,
  maxUploadSizeMB: 15,
  announcement:
    "Welcome to the new Admin Panel! We are in Phase 1 of implementation.",
  announcementActive: true,
};
