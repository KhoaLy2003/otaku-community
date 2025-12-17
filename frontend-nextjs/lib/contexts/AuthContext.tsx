"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User } from "@/types/user";
import { useUser } from "@auth0/nextjs-auth0/client";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  auth0User: any | null;
  accessToken: string | null;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Auth0 session
  const { user: auth0User, isLoading: auth0Loading } = useUser();

  // Your app DB user
  const [user, setUser] = useState<User | null>(null);
  const [syncLoading, setSyncLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Sync Auth0 user → backend user
  useEffect(() => {
    if (!auth0User) {
      setSyncLoading(false);
      setUser(null);
      return;
    }

    const syncUser = async () => {
      setSyncLoading(true);
      let token = accessToken;
      if (!accessToken) token = await getAccessTokenFromAuth0();
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          auth0Id: auth0User.sub,
          email: auth0User.email,
          username: auth0User.nickname || auth0User.name,
          avatar: auth0User.picture,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }

      setSyncLoading(false);
    };

    syncUser();
  }, [auth0Loading, auth0User]);

  const login = useCallback(() => {
    window.location.href = "/auth/login";
  }, []);

  const signup = useCallback(() => {
    window.location.href = "/auth/login?screen_hint=signup";
  }, []);

  const logout = useCallback(() => {
    window.location.href = "/auth/logout";
  }, []);

  const getAccessTokenFromAuth0 = useCallback(async (): Promise<
    string | null
  > => {
    try {
      const res = await fetch("/api/auth/token", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.token.token) {
        setAccessToken(data.token.token);
        return data.token.token;
      }

      console.error("Failed to fetch token:", data);
      return null;
    } catch (err) {
      console.error("Error fetching access token:", err);
      return null;
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    if (!auth0User) return;

    try {
      // Get fresh access token
      await getAccessTokenFromAuth0();

      const response = await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth0Id: auth0User.sub,
          email: auth0User.email,
          username: auth0User.nickname || auth0User.name,
          avatar: auth0User.picture,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to refresh auth:", err);
    }
  }, [auth0User, getAccessTokenFromAuth0]);

  // Get access token when user is authenticated
  // useEffect(() => {
  //   if (auth0User && !accessToken) {
  //     getAccessTokenFromAuth0();
  //   }
  // }, [auth0User, accessToken, getAccessTokenFromAuth0]);

  const value: AuthContextValue = {
    user,
    isLoading: auth0Loading || syncLoading,
    isAuthenticated: !!auth0User,
    login,
    signup,
    logout,
    refreshAuth,
    auth0User,
    accessToken,
    getAccessToken: getAccessTokenFromAuth0,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
