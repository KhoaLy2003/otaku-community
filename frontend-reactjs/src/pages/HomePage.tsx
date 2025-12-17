import React from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { FeedTabs } from '@/components/feed/FeedTabs'
import { FeedList } from '@/components/feed/FeedList'
import { CreatePostCard } from '@/components/posts/CreatePostCard'
import { HomeCard } from '@/components/sidebar/HomeCard'
import { RecentPostsCard } from '@/components/sidebar/RecentPostsCard'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#dae0e6]">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 mx-auto flex max-w-6xl gap-6 px-4 py-6">
          <section className="flex-1 space-y-4">
            <CreatePostCard />
            <FeedTabs />
            <FeedList />
          </section>
          <aside className="hidden w-full max-w-[312px] space-y-4 lg:block">
            <HomeCard />
            <RecentPostsCard />
          </aside>
        </main>
      </div>
    </div>
  )
}

export default HomePage