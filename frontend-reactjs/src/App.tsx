import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './constants/routes'

// Page components
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FeedPage from './pages/FeedPage'
import CreatePostPage from './pages/CreatePostPage'
import EditPostPage from './pages/EditPostPage'
import PostDetailPage from './pages/PostDetailPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import { CallbackPage } from './pages/CallbackPage'

// Auth components
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { PublicRoute } from './components/auth/PublicRoute'
import { Auth0ProviderWrapper } from './components/auth/Auth0ProviderWrapper'
import { AuthProvider } from './lib/contexts/AuthContext'
import { AuthGuard } from './components/auth/AuthGuard'

function App() {
  return (
    <Router>
      <Auth0ProviderWrapper>
        <AuthProvider>
          <AuthGuard>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Public routes */}
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route
                  path={ROUTES.LOGIN}
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicRoute>
                      <SignupPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path={ROUTES.REGISTER}
                  element={<Navigate to="/signup" replace />}
                />
                <Route
                  path="/forgot-password"
                  element={
                    <PublicRoute>
                      <ForgotPasswordPage />
                    </PublicRoute>
                  }
                />
                <Route path="/callback" element={<CallbackPage />} />

                {/* Protected routes */}
                <Route
                  path={ROUTES.FEED}
                  element={
                    <ProtectedRoute>
                      <FeedPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-post"
                  element={
                    <ProtectedRoute>
                      <CreatePostPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts/:id"
                  element={
                    <ProtectedRoute>
                      <PostDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditPostPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:username"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route for 404 */}
                <Route
                  path="*"
                  element={
                    <div className="flex items-center justify-center min-h-screen">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-gray-600 mb-4">Page not found</p>
                        <a
                          href={ROUTES.HOME}
                          className="text-orange-600 hover:text-orange-700 underline"
                        >
                          Go back home
                        </a>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </div>
          </AuthGuard>
        </AuthProvider>
      </Auth0ProviderWrapper>
    </Router>
  )
}

export default App
