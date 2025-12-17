import { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { syncUserWithBackend, getCurrentUser, handleUserSyncError } from '../lib/auth-sync';
import type { UserSyncResponse } from '../lib/api';

export interface UseUserSyncReturn {
  syncUser: () => Promise<UserSyncResponse | null>;
  refreshUser: () => Promise<UserSyncResponse | null>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Custom hook for user synchronization operations
 * Replaces the Next.js API route functionality with direct backend calls
 */
export function useUserSync(): UseUserSyncReturn {
  const { user: auth0User, isAuthenticated } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const syncUser = useCallback(async (): Promise<UserSyncResponse | null> => {
    if (!isAuthenticated || !auth0User) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const syncedUser = await syncUserWithBackend(auth0User);
      return syncedUser;
    } catch (err) {
      const errorMessage = handleUserSyncError(err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, auth0User]);

  const refreshUser = useCallback(async (): Promise<UserSyncResponse | null> => {
    if (!isAuthenticated) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const currentUser = await getCurrentUser();
      return currentUser;
    } catch (err) {
      const errorMessage = handleUserSyncError(err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return {
    syncUser,
    refreshUser,
    isLoading,
    error,
    clearError,
  };
}