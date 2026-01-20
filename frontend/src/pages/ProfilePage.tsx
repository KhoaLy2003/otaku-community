import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { ProfileFeed } from '@/components/profile/ProfileFeed'
import { ProfileMedia } from '@/components/profile/ProfileMedia'
import { ProfileFavorites } from '@/components/profile/ProfileFavorites'
import { useAuth } from '@/hooks/useAuth'
import { Shield } from 'lucide-react'
import { usersApi } from '@/lib/api/users'
import { ProfileTranslations } from '@/components/profile/ProfileTranslations'
import type { UserProfile } from '@/types'

type TabType = 'posts' | 'translations' | 'replies' | 'media' | 'likes' | 'favorites';

const ProfilePage: React.FC = () => {
  const { user: authUser, isLoading: authLoading } = useAuth()
  const { username } = useParams<{ username: string }>()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('posts')
  const [loading, setLoading] = useState(true)

  const fetchProfileData = async () => {
    // Don't fetch if auth is still loading
    if (authLoading) return;

    if (!username && !authUser?.username) return;

    setLoading(true);
    try {
      const effectiveUsername = username || authUser?.username;
      if (!effectiveUsername) return;

      const response = await usersApi.getUserProfile(effectiveUsername);

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

  useEffect(() => {
    fetchProfileData();
  }, [username, authUser?.username, authLoading]);

  return (
    <div className="flex-1 mx-auto flex gap-6">
      <section className="flex-1 min-w-0">
        <div className="rounded-lg border-gray-200 overflow-hidden">
          {loading && !user ? (
            <div className="bg-white p-12 text-center">
              <p className="text-gray-500 italic animate-pulse">Loading profile...</p>
            </div>
          ) : user ? (
            <>
              <ProfileHeader
                user={user}
                isOwnProfile={user.username === authUser?.username}
                onFollowChange={fetchProfileData}
              />
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isRestricted={user.isRestricted}
              />
              {user.isRestricted ? (
                <div className="bg-white p-12 text-center rounded-b-lg border-t border-gray-100 italic text-gray-400 flex flex-col items-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Shield size={48} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 not-italic">This profile is private</h3>
                  <p className="text-sm max-w-xs mx-auto mt-2">Only followers of @{user.username} can see their posts and profile details.</p>
                </div>
              ) : activeTab === 'media' ? (
                <ProfileMedia username={user.username} />
              ) : activeTab === 'translations' ? (
                <ProfileTranslations username={user.username} />
              ) : activeTab === 'favorites' ? (
                <ProfileFavorites isOwner={username === authUser?.username} />
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
    </div>
  )
}

export default ProfilePage
