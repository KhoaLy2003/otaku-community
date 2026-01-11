import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export function CallbackPage() {
  const { isLoading, error, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        console.error('Auth0 callback error:', error);
        navigate('/login?error=callback_failed');
      } else if (isAuthenticated) {
        // Get the return URL from localStorage or default to feed
        const returnUrl = localStorage.getItem('auth_return_url') || '/feed';
        localStorage.removeItem('auth_return_url');
        navigate(returnUrl);
      } else {
        navigate('/login');
      }
    }
  }, [isLoading, error, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Authentication failed</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}