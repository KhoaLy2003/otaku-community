import { env } from '../env';

// API client configuration for direct backend communication
const API_BASE_URL = env.API_URL;

export interface ApiError {
  message: string;
  status: number;
  errors?: string[];
}

export class ApiClient {
  private baseURL: string;
  private getAccessToken?: () => Promise<string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Set the access token getter function (typically from Auth0)
   */
  setAccessTokenGetter(getter: () => Promise<string>) {
    this.getAccessToken = getter;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Get auth token from Auth0
    let token: string | null = null;
    if (this.getAccessToken) {
      try {
        token = await this.getAccessToken();
      } catch (error) {
        console.error('Failed to get access token:', error);
      }
    }

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      const hasJsonContent = contentType?.includes('application/json');

      let data: T;
      if (hasJsonContent) {
        data = await response.json();
      } else {
        data = (await response.text()) as T;
      }

      if (!response.ok) {
        const errorData = data as Record<string, unknown>;
        const error: ApiError = {
          message: (errorData?.message as string) || String(data) || 'Request failed',
          status: response.status,
          errors: errorData?.errors as string[] | undefined,
        };
        throw error;
      }

      return data;
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      
      // Network or other errors
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 0,
      };
      throw apiError;
    }
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? (data as BodyInit) : (data ? JSON.stringify(data) : undefined),
    });
  }

  put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? (data as BodyInit) : (data ? JSON.stringify(data) : undefined),
    });
  }

  patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? (data as BodyInit) : (data ? JSON.stringify(data) : undefined),
    });
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
