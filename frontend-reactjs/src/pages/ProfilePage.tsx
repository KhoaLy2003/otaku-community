import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { ProfileFeed } from '@/components/profile/ProfileFeed'
import { ProfileMedia } from '@/components/profile/ProfileMedia'
import { useAuth } from '@/hooks/useAuth'
import { usersApi } from '@/lib/api/users'
import type { UserProfile } from '@/types/user'

type TabType = 'posts' | 'replies' | 'media' | 'likes';

const ProfilePage: React.FC = () => {
  const { user: authUser, isLoading: authLoading } = useAuth()
  const { username } = useParams<{ username: string }>()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('posts')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      // Don't fetch if auth is still loading
      if (authLoading) return;

      if (!username && !authUser?.username) return;

      setLoading(true);
      try {
        const response = username
          ? await usersApi.getUserProfile(username)
          : await usersApi.getCurrentUser();

        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username, authUser?.username, authLoading]);

  return (
    <div className="min-h-screen bg-[#dae0e6]">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 mx-auto flex max-w-6xl gap-6 px-4 py-6">
          <section className="flex-1 min-w-0">
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {loading && !user ? (
                <div className="bg-white p-12 text-center">
                  <p className="text-gray-500 italic animate-pulse">Loading profile...</p>
                </div>
              ) : user ? (
                <>
                  <ProfileHeader
                    user={user}
                    isOwnProfile={user.username === authUser?.username}
                  />
                  <ProfileTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                  {activeTab === 'media' ? (
                    <ProfileMedia username={user.username} />
                  ) : (
                    <ProfileFeed
                      username={user.username}
                      activeTab={activeTab}
                    />
                  )}
                </>
              ) : (
                <div className="p-8 text-center bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">User not found</h3>
                  <p className="text-gray-500">The user you're looking for doesn't exist.</p>
                </div>
              )}
            </div>
          </section>

          <aside className="hidden w-full max-w-[312px] space-y-4 lg:block">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Relevant Links</h3>
              <p className="text-gray-500 text-sm">Find more about this user on other platforms.</p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default ProfilePage
