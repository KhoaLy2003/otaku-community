export enum ProfileVisibility {
  PUBLIC = "PUBLIC",
  FOLLOWERS_ONLY = "FOLLOWERS_ONLY",
  PRIVATE = "PRIVATE",
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
}

export interface UserProfile extends User {
  followersCount: number | null;
  followingCount: number | null;
  postsCount: number | null;
  isFollowing: boolean;
  isRestricted: boolean;
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
