// import { UserProfile } from '@auth0/nextjs-auth0/types';

import { User } from "@auth0/nextjs-auth0/types";

export interface SyncUserRequest {
  auth0Id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  name?: string;
  nickname?: string;
  locale?: string;
}

export interface SyncUserResponse {
  id: string;
  auth0Id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  interests: string[];
  location?: string;
  role: string;
  isNewUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

/**
 * Synchronizes user data between Auth0 and the backend database
 */
export async function syncUserWithBackend(
  user: User,
  getAccessToken: () => Promise<string>
): Promise<SyncUserResponse> {
  try {
    const token = await getAccessToken();

    const syncRequest: SyncUserRequest = {
      auth0Id: user.sub!,
      email: user.email!,
      username: user.nickname || user.name || user.email!.split("@")[0],
      avatarUrl: user.picture,
      name: user.name,
      nickname: user.nickname,
      locale: user.locale,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/sync`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(syncRequest),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to sync user");
    }

    const result: ApiResponse<SyncUserResponse> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Sync response invalid");
    }

    return result.data;
  } catch (error) {
    console.error("User sync failed:", error);
    throw error;
  }
}

/**
 * Gets the current user profile from the backend
 */
export async function getCurrentUser(
  getAccessToken: () => Promise<string>
): Promise<SyncUserResponse> {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get current user");
    }

    const result: ApiResponse<SyncUserResponse> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "User response invalid");
    }

    return result.data;
  } catch (error) {
    console.error("Get current user failed:", error);
    throw error;
  }
}
