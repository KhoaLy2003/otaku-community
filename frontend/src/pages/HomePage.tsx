import React from 'react'
import { FeedTabs } from '@/components/feed/FeedTabs'
import { FeedList } from '@/components/feed/FeedList'
import { FeedUpdateBanner } from '@/components/feed/FeedUpdateBanner'
import { CreatePostCard } from '@/components/posts/CreatePostCard'
import { HomeCard } from '@/components/sidebar/HomeCard'
import { RecentPostsCard } from '@/components/sidebar/RecentPostsCard'
import { useFeedUpdates } from '@/hooks/useFeedUpdates'
import { scrollToTop } from '@/lib/utils'

import { TranslationFeed } from '@/components/feed/TranslationFeed'

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('best')

  // Enable real-time feed updates
  const { notification, isConnected, dismissNotification, handleRefresh } = useFeedUpdates({
    enabled: true,
    onUpdate: (update) => {
      console.log('Feed update received:', update.newPostsCount, 'new posts');
    },
  });

  // Enhanced refresh feed with smooth scroll to top
  const refreshFeed = () => {
    // First, scroll to top smoothly using utility
    scrollToTop('smooth');

    // Small delay to let scroll animation start, then refresh feed
    setTimeout(() => {
      window.dispatchEvent(new Event('REFRESH_FEED'));
    }, 100);
  };

  return (
    <>
      {/* Real-time feed update banner */}
      {notification && (
        <FeedUpdateBanner
          message={notification.message}
          newPostsCount={notification.newPostsCount}
          onRefresh={() => handleRefresh(refreshFeed)}
          onDismiss={dismissNotification}
        />
      )}

      {/* WebSocket connection indicator (dev mode only) */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm z-40 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
            />
            <span className="text-gray-700 dark:text-gray-300">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 py-2 sm:py-4 w-full">
        <section className="flex-1 min-w-0 space-y-4">
          <CreatePostCard />
          <FeedTabs activeTab={activeTab} onChange={setActiveTab} />
          {activeTab === 'translations' ? (
            <TranslationFeed />
          ) : (
            <FeedList />
          )}
        </section>
        <aside className="hidden w-[312px] shrink-0 space-y-4 lg:block">
          <HomeCard />
          <RecentPostsCard />
        </aside>
      </div>
    </>
  )
}

export default HomePage