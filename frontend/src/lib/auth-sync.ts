import { User } from "@auth0/auth0-react";
import { usersApi, type UserSyncRequest, type UserSyncResponse } from "./api";

/**
 * Synchronizes user data between Auth0 and the backend database
 * This replaces the Next.js API route functionality
 */
export async function syncUserWithBackend(
  user: User,
): Promise<UserSyncResponse> {
  try {
    if (!user.sub || !user.email) {
      throw new Error("Invalid user data: missing sub or email");
    }

    const syncRequest: UserSyncRequest = {
      auth0Id: user.sub,
      email: user.email,
      username: user.nickname || user.name || user.email.split("@")[0],
      avatarUrl: user.picture,
      name: user.name,
      nickname: user.nickname,
      locale: user.locale,
    };

    const response = await usersApi.syncUser(syncRequest);

    if (!response.success || !response.data) {
      throw new Error(response.message || "Sync response invalid");
    }

    return response.data;
  } catch (error) {
    console.error("User sync failed:", error);
    throw error;
  }
}

/**
 * Gets the current user profile from the backend
 * This replaces direct API calls that went through Next.js routes
 */
export async function getCurrentUser(): Promise<UserSyncResponse> {
  try {
    const response = await usersApi.getCurrentUser();

    if (!response.success || !response.data) {
      throw new Error(response.message || "User response invalid");
    }

    return response.data;
  } catch (error) {
    console.error("Get current user failed:", error);
    throw error;
  }
}

/**
 * Error handler for user sync operations
 * Provides consistent error handling across the application
 */
export function handleUserSyncError(error: unknown): string {
  if (error instanceof Error) {
    // Handle specific API errors
    if (
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      return "Authentication failed. Please log in again.";
    }

    if (error.message.includes("403") || error.message.includes("Forbidden")) {
      return "You do not have permission to perform this action.";
    }

    if (error.message.includes("404") || error.message.includes("Not Found")) {
      return "User not found. Please try again.";
    }

    if (
      error.message.includes("500") ||
      error.message.includes("Internal Server Error")
    ) {
      return "Server error. Please try again later.";
    }

    return error.message;
  }

  return "An unexpected error occurred during user synchronization.";
}

/**
 * Validates user sync request data
 */
export function validateUserSyncRequest(user: User): boolean {
  if (!user.sub) {
    console.error("User sync validation failed: missing sub");
    return false;
  }

  if (!user.email) {
    console.error("User sync validation failed: missing email");
    return false;
  }

  return true;
}

/**
 * Creates a user sync request from Auth0 user data
 */
export function createUserSyncRequest(user: User): UserSyncRequest {
  if (!validateUserSyncRequest(user)) {
    throw new Error("Invalid user data for sync request");
  }

  return {
    auth0Id: user.sub!,
    email: user.email!,
    username: user.nickname || user.name || user.email!.split("@")[0],
    avatarUrl: user.picture,
    name: user.name,
    nickname: user.nickname,
    locale: user.locale,
  };
}
