import { Link } from 'react-router-dom'
import { PostCard, type BasePost } from '../posts/PostCard'
import { useEffect, useState } from 'react'
import { feedApi } from '@/lib/api/feed'
import type { FeedPost } from '@/types/post'
import { timeAgo } from '@/lib/utils'

export function FeedList() {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await feedApi.getExploreFeed()
        setPosts(response.data.posts)
      } catch (error: any) {
        setError(error.message || 'Failed to fetch feed')
      } finally {
        setLoading(false)
      }
    }
    fetchFeed()
  }, [])

  if (loading) {
    return <p>Loading feed...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  const adaptedPosts: BasePost[] = posts.map(post => ({
    id: post.id,
    title: post.title,
    body: post.content,
    image: post.image ? post.image : undefined,
    community: post.topics && post.topics.length > 0 ? post.topics[0].name : 'General',
    author: post.author.name,
    time: timeAgo(post.createdAt),
    votes: post.likeCount,
    comments: post.commentCount,
  }));

  return (
    <div className="space-y-4">
      {adaptedPosts.map(post => (
        <Link key={post.id} to={`/posts/${post.id}`} className="block">
          <PostCard post={post} />
        </Link>
      ))}
    </div>
  )
}