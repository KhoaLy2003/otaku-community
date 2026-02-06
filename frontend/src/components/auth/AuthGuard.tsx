import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component that handles authentication state and redirects
 * This component should wrap the entire app to handle Auth0 callbacks and authentication state
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading: auth0Loading, error } = useAuth0();
  const { isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (error) {
      console.error('Auth0 error:', error);
    }
  }, [error]);

  // Show loading while Auth0 is initializing or user sync is happening
  if (auth0Loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show error state if Auth0 failed to initialize
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Authentication service unavailable</p>
          <p className="text-gray-600 text-sm">{error.message}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}