'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useUserSync } from '@/hooks/useUserSync';
import { SyncUserResponse } from '@/lib/auth-sync';

interface UserSyncContextType {
  syncedUser: SyncUserResponse | null;
  isLoading: boolean;
  error: string | null;
  syncUser: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const UserSyncContext = createContext<UserSyncContextType | undefined>(undefined);

interface UserSyncProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages user synchronization state
 */
export function UserSyncProvider({ children }: UserSyncProviderProps) {
  const { user } = useUser();
  const userSync = useUserSync();

  // Only provide sync context when user is authenticated
  if (!user) {
    return <>{children}</>;
  }

  return (
    <UserSyncContext.Provider value={userSync}>
      {children}
    </UserSyncContext.Provider>
  );
}

/**
 * Hook to access user sync context
 */
export function useUserSyncContext(): UserSyncContextType {
  const context = useContext(UserSyncContext);
  
  if (context === undefined) {
    throw new Error('useUserSyncContext must be used within a UserSyncProvider');
  }
  
  return context;
}

/**
 * Hook to get synced user data (returns null if not authenticated)
 */
export function useSyncedUser(): SyncUserResponse | null {
  const { user } = useUser();
  
  if (!user) {
    return null;
  }
  
  const { syncedUser } = useUserSyncContext();
  return syncedUser;
}