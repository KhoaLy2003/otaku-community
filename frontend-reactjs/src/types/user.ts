export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  avatarUrl?: string;
  coverImage?: string;
  bio?: string;
  interests?: string[]; //TODO: missing in UI
  location?: string;
  website?: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
}

export interface UserListItem {
  id: string;
  username: string;
  avatarUrl: string;
  bio: string | null;
  isFollowing: boolean;
}
