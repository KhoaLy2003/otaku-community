import React from 'react'
import { FeedTabs } from '@/components/feed/FeedTabs'
import { FeedList } from '@/components/feed/FeedList'
import { CreatePostCard } from '@/components/posts/CreatePostCard'
import { HomeCard } from '@/components/sidebar/HomeCard'
import { RecentPostsCard } from '@/components/sidebar/RecentPostsCard'

const HomePage: React.FC = () => {
  return (
    <div className="flex-1 mx-auto flex gap-6 py-4 overflow-y-auto">
      <section className="flex-1 space-y-4">
        <CreatePostCard />
        <FeedTabs />
        <FeedList />
      </section>
      <aside className="hidden w-full max-w-[312px] space-y-4 lg:block">
        <HomeCard />
        <RecentPostsCard />
      </aside>
    </div>
  )
}

export default HomePage