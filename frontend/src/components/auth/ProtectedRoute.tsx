import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ShieldAlert } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  roles?: string[]
}

export function ProtectedRoute({ children, fallback, roles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the current path to redirect back after login
      localStorage.setItem('auth_return_url', location.pathname + location.search)

      // Redirect to login page or trigger Auth0 login
      const searchParams = new URLSearchParams(location.search)
      const returnUrl = searchParams.get('returnUrl')

      if (returnUrl) {
        localStorage.setItem('auth_return_url', decodeURIComponent(returnUrl))
      }

      // Use Auth0 login instead of navigating to login page
      login()
    }
  }, [isAuthenticated, isLoading, login, location.pathname, location.search])

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Check roles if specified
  if (roles && roles.length > 0) {
    const userRole = user?.role;
    const hasRequiredRole = roles.includes(userRole || '');

    if (!hasRequiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4 text-center">
          <div className="max-w-md">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Access Denied</h1>
            <p className="text-gray-500 mb-6 font-medium">You do not have the required permissions to access this section of the platform.</p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>
}