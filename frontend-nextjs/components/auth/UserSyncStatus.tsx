'use client';

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useUserSyncContext } from './UserSyncProvider';

/**
 * Component that shows user sync status and handles errors
 */
export function UserSyncStatus() {
  const { user, isLoading: userLoading } = useUser();
  const { syncedUser, isLoading, error, syncUser } = useUserSyncContext();

  // Don't show anything if not authenticated
  if (!user || userLoading) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-blue-700">Syncing user data...</span>
      </div>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-800 font-medium">Sync Error</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={syncUser}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show success state for new users
  if (syncedUser?.isNewUser) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
              <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z"/>
            </svg>
          </div>
          <span className="text-green-700">
            Welcome! Your account has been created successfully.
          </span>
        </div>
      </div>
    );
  }

  // Don't show anything if sync completed successfully for existing users
  return null;
}

/**
 * Simple user info display component
 */
export function UserInfo() {
  const { user } = useUser();
  const { syncedUser } = useUserSyncContext();

  if (!user || !syncedUser) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      {syncedUser.avatarUrl && (
        <img
          src={syncedUser.avatarUrl}
          alt={syncedUser.username}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div>
        <p className="font-medium text-gray-900">{syncedUser.username}</p>
        <p className="text-sm text-gray-500">{syncedUser.role.toLowerCase()}</p>
      </div>
    </div>
  );
}