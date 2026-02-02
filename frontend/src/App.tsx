import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ROUTES } from "./constants/routes";

// Page components
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import PostDetailPage from "./pages/PostDetailPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChatPage from "./pages/ChatPage";
import { CallbackPage } from "./pages/CallbackPage";
import AnimeListPage from "./pages/AnimeListPage";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import MangaListPage from "./pages/MangaListPage";
import MangaDetailPage from "./pages/MangaDetailPage";
import MangaDashboardPage from "./pages/MangaDashboardPage";
import MangaUploadPage from "./pages/MangaUploadPage";
import MangaModerationPage from "./pages/MangaModerationPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import AboutPage from "./pages/AboutPage";
import HelpPage from "./pages/HelpPage";
import RankingPage from "./pages/RankingPage";
import NewsPage from "./pages/NewsPage";

// Admin pages
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { UserManagementPage } from "./pages/admin/UserManagementPage";
import { UserDetailPage } from "./pages/admin/UserDetailPage";
import { ContentModerationPage } from "./pages/admin/ContentModerationPage";
import { DatabaseManagementPage } from "./pages/admin/DatabaseManagementPage";
import { SystemSettingsPage } from "./pages/admin/SystemSettingsPage";

// Auth components
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { ConditionalRoute } from "./components/auth/ConditionalRoute";
import { Auth0ProviderWrapper } from "./components/auth/Auth0ProviderWrapper";
import { AuthProvider } from "./lib/contexts/AuthContext";
import { AuthGuard } from "./components/auth/AuthGuard";
import WebSocketProvider from "./components/socket/WebSocketProvider";
import { ToastProvider } from "./components/ui/ToastProvider";
import { MainLayout } from "./components/layout/MainLayout";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

import { ChatSocketListener } from "./components/socket/ChatSocketListener";

function App() {
  return (
    <Router>
      <Auth0ProviderWrapper>
        <AuthProvider>
          <WebSocketProvider />
          <ChatSocketListener />
          <AuthGuard>
            <div className="min-h-screen bg-gray-50">
              <ToastProvider />
              <Routes>
                {/* Landing page - public route, redirects authenticated users */}
                <Route
                  path={ROUTES.WELCOME}
                  element={
                    <ConditionalRoute>
                      <LandingPage />
                    </ConditionalRoute>
                  }
                />

                {/* Public routes */}
                <Route element={<MainLayout />}>
                  <Route path={ROUTES.HOME} element={<HomePage />} />
                  <Route path={ROUTES.ANIME_LIST} element={<AnimeListPage />} />
                  <Route path="/anime/:id" element={<AnimeDetailPage />} />
                  <Route path={ROUTES.MANGA_LIST} element={<MangaListPage />} />
                  <Route path="/manga/:id" element={<MangaDetailPage />} />
                  <Route
                    path={ROUTES.MANGA_DASHBOARD}
                    element={
                      <ProtectedRoute>
                        <MangaDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.MANGA_UPLOAD}
                    element={
                      <ProtectedRoute>
                        <MangaUploadPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.MANGA_UPLOAD_BY_ID(":id")}
                    element={
                      <ProtectedRoute>
                        <MangaUploadPage />
                      </ProtectedRoute>
                    }
                  />
                  TODO: Add Manga Moderation
                  {/* <Route
                    path={ROUTES.MANGA_MODERATION}
                    element={
                      <ProtectedRoute roles={["STAFF", "ADMIN"]}>
                        <MangaModerationPage />
                      </ProtectedRoute>
                    }
                  /> */}
                  <Route
                    path="/profile/:username"
                    element={
                      <ProfilePage />
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
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Coming Soon Routes */}
                  <Route path={ROUTES.POPULAR} element={<ComingSoonPage />} />
                  <Route path={ROUTES.COMMUNITIES} element={<ComingSoonPage />} />
                  <Route path={ROUTES.HELP} element={<HelpPage />} />
                  <Route path={ROUTES.BLOG} element={<ComingSoonPage />} />
                  <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                  <Route path={ROUTES.RANKINGS} element={<RankingPage />} />
                  <Route path={ROUTES.NEWS} element={<NewsPage />} />
                </Route>

                {/* Admin Routes */}
                <Route
                  element={
                    <ProtectedRoute roles={["ADMIN"]}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
                  <Route path={ROUTES.ADMIN_USERS} element={<UserManagementPage />} />
                  <Route path="/admin/users/:id" element={<UserDetailPage />} />
                  <Route path={ROUTES.ADMIN_CONTENT} element={<ContentModerationPage />} />
                  <Route path={ROUTES.ADMIN_DATABASE} element={<DatabaseManagementPage />} />
                  <Route path={ROUTES.ADMIN_SETTINGS} element={<SystemSettingsPage />} />
                </Route>

                <Route element={<PublicLayout />}>
                  <Route
                    path={ROUTES.CHAT}
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

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

                {/* Catch-all route for 404 */}
                <Route
                  path="*"
                  element={
                    <div className="flex items-center justify-center min-h-screen">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                          404
                        </h1>
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
  );
}

export default App;
