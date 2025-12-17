import { useUser } from '@auth0/nextjs-auth0/client';
import { useCallback, useEffect, useState } from 'react';
import { syncUserWithBackend, getCurrentUser, SyncUserResponse } from '@/lib/auth-sync';

interface UseUserSyncReturn {
  syncedUser: SyncUserResponse | null;
  isLoading: boolean;
  error: string | null;
  syncUser: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

/**
 * Hook to manage user synchronization between Auth0 and backend
 */
export function useUserSync(): UseUserSyncReturn {
  const { user, isLoading: userLoading } = useUser();
  const [syncedUser, setSyncedUser] = useState<SyncUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAccessToken = useCallback(async () => {
    const response = await fetch('/api/auth/token');
    if (!response.ok) {
      throw new Error('Failed to get access token');
    }
    const { accessToken } = await response.json();
    return accessToken;
  }, []);

  const syncUser = useCallback(async () => {
    if (!user || userLoading) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const syncedUserData = await syncUserWithBackend(user, getAccessToken);
      setSyncedUser(syncedUserData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync user';
      setError(errorMessage);
      console.error('User sync error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, userLoading, getAccessToken]);

  const refetchUser = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userData = await getCurrentUser(getAccessToken);
      setSyncedUser(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(errorMessage);
      console.error('Fetch user error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, getAccessToken]);

  // Auto-sync user when authenticated
  useEffect(() => {
    if (user && !userLoading && !syncedUser && !isLoading) {
      syncUser();
    }
  }, [user, userLoading, syncedUser, isLoading, syncUser]);

  return {
    syncedUser,
    isLoading,
    error,
    syncUser,
    refetchUser
  };
}