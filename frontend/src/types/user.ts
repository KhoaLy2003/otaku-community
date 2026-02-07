export const ProfileVisibility = {
  PUBLIC: "PUBLIC",
  FOLLOWERS_ONLY: "FOLLOWERS_ONLY",
  PRIVATE: "PRIVATE",
} as const;

export type ProfileVisibility =
  (typeof ProfileVisibility)[keyof typeof ProfileVisibility];

export const FavoriteType = {
  ANIME: "ANIME",
  MANGA: "MANGA",
  CHARACTER: "CHARACTER",
} as const;

export type FavoriteType = (typeof FavoriteType)[keyof typeof FavoriteType];

export interface MainFavorite {
  favoriteType: FavoriteType;
  favoriteId: number;
  favoriteName: string;
  favoriteImageUrl: string;
  favoriteReason: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  interests?: string[]; //TODO: missing in UI
  location?: string;
  profileVisibility?: ProfileVisibility;
  website?: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
  mainFavorite?: MainFavorite;
  groupName?: string;
  totalMangaViews?: number;
  totalMangaUpvotes?: number;
  totalTranslations?: number;
  role?: string;
}

export interface UserProfile extends User {
  followersCount: number | null;
  followingCount: number | null;
  postsCount: number | null;
  isFollowing: boolean;
  isRestricted: boolean;
  rank?: number;
}

export interface UserListItem {
  id: string;
  username: string;
  avatarUrl: string;
  bio: string | null;
  isFollowing: boolean;
  profileVisibility: ProfileVisibility;
}

export interface LoginHistory {
  id: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  actionType: string;
  metadata: string;
  createdAt: string;
}
