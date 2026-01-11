import { render, screen } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthProvider } from '../../../lib/contexts/AuthContext';
import { useAuth } from '../../../hooks/useAuth';

// Mock Auth0
jest.mock('@auth0/auth0-react');
const mockUseAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;

// Mock environment
jest.mock('../../../lib/env', () => ({
  env: {
    AUTH0_AUDIENCE: 'https://api.otaku-community.com',
    API_URL: 'http://localhost:8080/api',
  },
}));

// Mock fetch
const mockFetch = jest.fn();
(globalThis as any).fetch = mockFetch;

// Test component that uses useAuth
function TestComponent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated) return <div>Authenticated: {user?.username || 'Unknown'}</div>;
  return <div>Not authenticated</div>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    mockUseAuth0.mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
      getAccessTokenSilently: jest.fn(),
    } as any);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show not authenticated when user is not logged in', () => {
    mockUseAuth0.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
      getAccessTokenSilently: jest.fn(),
    } as any);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Not authenticated')).toBeInTheDocument();
  });

  it('should handle authenticated user', async () => {
    const mockUser = {
      sub: 'auth0|123',
      email: 'test@example.com',
      nickname: 'testuser',
      picture: 'https://example.com/avatar.jpg',
    };

    mockUseAuth0.mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
      getAccessTokenSilently: jest.fn().mockResolvedValue('mock-token'),
    } as unknown);

    // Mock successful user sync
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        user: { id: '1', username: 'testuser', email: 'test@example.com' }
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should show loading initially during sync
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});