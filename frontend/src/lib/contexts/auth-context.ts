import { createContext } from 'react';
import type { User as Auth0User } from '@auth0/auth0-react';
import type { User } from '../../types/user';

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  auth0User: Auth0User | null;
  accessToken: string | null;
  getAccessToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);