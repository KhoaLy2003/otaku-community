import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    return apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );
  },

  signup: async (data: RegisterData) => {
    return apiClient.post<ApiResponse<AuthResponse>>("/auth/signup", data);
  },

  logout: async () => {
    return apiClient.post<ApiResponse<void>>("/auth/logout");
  },

  refreshToken: async (refreshToken: string) => {
    return apiClient.post<ApiResponse<{ token: string; refreshToken: string }>>(
      "/auth/refresh",
      {
        refreshToken,
      }
    );
  },

  getCurrentUser: async () => {
    return apiClient.get<ApiResponse<User>>("/auth/me");
  },

  forgotPassword: async (email: string) => {
    return apiClient.post<ApiResponse<void>>("/auth/forgot-password", {
      email,
    });
  },

  resetPassword: async (token: string, password: string) => {
    return apiClient.post<ApiResponse<void>>("/auth/reset-password", {
      token,
      password,
    });
  },
};
