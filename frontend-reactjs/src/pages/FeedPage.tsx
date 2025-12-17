import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/Card'

const FeedPage: React.FC = () => {
  const { auth0User } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {auth0User?.email}! 🎌
        </h1>
        <p className="text-gray-600">
          This is your personalized feed. Start exploring anime, manga, and
          Japanese culture content!
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Feed</h2>
        <p className="text-gray-500 text-center py-8">
          No posts yet. Start following topics and users to see content here!
        </p>
      </Card>
    </div>
  )
}

export default FeedPage