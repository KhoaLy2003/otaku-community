import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { User } from '../../types/user';
import { env } from '../env';
import { AuthContext, type AuthContextValue } from './auth-context';
import { apiClient } from '../api';
import { syncUserWithBackend, handleUserSyncError } from '../auth-sync';
import { useNotificationStore } from '../../store/useNotificationStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Auth0 React SDK hooks
  const {
    user: auth0User,
    isLoading: auth0Loading,
    isAuthenticated: auth0IsAuthenticated,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  // Your app DB user
  const [user, setUser] = useState<User | null>(null);
  const [syncLoading, setSyncLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { setUnreadCount } = useNotificationStore();

  // Get access token from Auth0
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!auth0IsAuthenticated) return null;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: env.AUTH0_AUDIENCE,
          scope: "openid profile email read:posts write:posts read:users write:users",
        },
      });
      setAccessToken(token);
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }, [auth0IsAuthenticated, getAccessTokenSilently]);

  // Set up API client with access token getter
  useEffect(() => {
    apiClient.setAccessTokenGetter(async () => {
      if (!auth0IsAuthenticated) return null;
      return await getAccessTokenSilently({
        authorizationParams: {
          audience: env.AUTH0_AUDIENCE,
          scope: "openid profile email read:posts write:posts read:users write:users",
        },
      });
    });
  }, [auth0IsAuthenticated, getAccessTokenSilently]);

  // Sync Auth0 user with backend user
  useEffect(() => {
    if (!auth0User || !auth0IsAuthenticated) {
      setSyncLoading(false);
      setUser(null);
      setAccessToken(null);
      return;
    }

    const syncUser = async () => {
      setSyncLoading(true);

      try {
        const token = await getAccessToken();
        if (!token) {
          setSyncLoading(false);
          return;
        }

        // Use the new sync utility
        const syncedUser = await syncUserWithBackend(auth0User);
        setUser(syncedUser as any); // Type conversion for compatibility
        setUnreadCount(syncedUser.unreadNotificationCount);
      } catch (error) {
        const errorMessage = handleUserSyncError(error);
        console.error('Error syncing user:', errorMessage);
      } finally {
        setSyncLoading(false);
      }
    };

    syncUser();
  }, [auth0User, auth0IsAuthenticated, getAccessToken]);

  const login = useCallback(() => {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${env.APP_BASE_URL}/callback`,
      },
    });
  }, [loginWithRedirect]);

  const signup = useCallback(() => {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${env.APP_BASE_URL}/callback`,
        screen_hint: 'signup',
      },
    });
  }, [loginWithRedirect]);

  const logout = useCallback(() => {
    auth0Logout({
      logoutParams: {
        returnTo: env.APP_BASE_URL,
      },
    });
    setUser(null);
    setAccessToken(null);
  }, [auth0Logout]);

  const refreshAuth = useCallback(async () => {
    if (!auth0User || !auth0IsAuthenticated) return;

    try {
      // Get fresh access token
      const token = await getAccessToken();
      if (!token) return;

      // Use the new sync utility
      const syncedUser = await syncUserWithBackend(auth0User);
      setUser(syncedUser as any); // Type conversion for compatibility
      setUnreadCount(syncedUser.unreadNotificationCount);
    } catch (error) {
      const errorMessage = handleUserSyncError(error);
      console.error('Failed to refresh auth:', errorMessage);
    }
  }, [auth0User, auth0IsAuthenticated, getAccessToken]);

  const value: AuthContextValue = {
    user,
    isLoading: auth0Loading || syncLoading,
    isAuthenticated: auth0IsAuthenticated,
    login,
    signup,
    logout,
    refreshAuth,
    auth0User: auth0User || null,
    accessToken,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

