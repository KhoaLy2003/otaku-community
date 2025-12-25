import { Link } from 'react-router-dom'
import { PostCard, type BasePost } from '../posts/PostCard'
import { useEffect, useState, useRef, useCallback } from 'react'
import { feedApi } from '@/lib/api/feed'
import type { FeedPost } from '@/types/post'
import { timeAgo } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { postsApi } from '@/lib/api/posts'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export function FeedList() {
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const observerTarget = useRef<HTMLDivElement>(null)

  const fetchFeed = useCallback(async (cursor?: string) => {
    try {
      if (cursor) {
        setIsFetchingMore(true)
      } else {
        setLoading(true)
        setError(null)
      }

      const response = isAuthenticated
        ? await feedApi.getHomeFeed({ cursor, limit: 10 })
        : await feedApi.getExploreFeed({ cursor, limit: 10 })

      if (response.success && response.data) {
        setPosts(prev => cursor ? [...prev, ...response.data!.posts] : response.data!.posts)
        setNextCursor(response.data.nextCursor)
        setHasMore(response.data.hasMore)
      } else {
        setError(response.message || 'Failed to fetch feed')
      }
    } catch (error: any) {
      console.error('Error fetching feed:', error)
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
      setIsFetchingMore(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    const handleRefresh = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      fetchFeed()
    }
    window.addEventListener('REFRESH_FEED', handleRefresh)
    return () => window.removeEventListener('REFRESH_FEED', handleRefresh)
  }, [fetchFeed])

  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !isFetchingMore) {
          fetchFeed(nextCursor)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // Start loading before reaching the very end
      }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, isFetchingMore, nextCursor, fetchFeed])

  const adaptPosts = (postsToAdapt: FeedPost[]): BasePost[] => {
    return postsToAdapt.map(post => ({
      id: post.id,
      title: post.title,
      body: post.content,
      media: post.media,
      image: post.image || (post.media && post.media.length > 0 ? post.media[0].mediaUrl : undefined),
      community: post.topics && post.topics.length > 0 ? post.topics[0].name : 'General',
      author: post.author.name,
      authorId: post.author.id,
      authorName: post.author.name,
      time: timeAgo(post.createdAt),
      votes: post.likeCount,
      comments: post.commentCount,
    }))
  }

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteDialog(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      const response = await postsApi.deletePost(postToDelete);
      if (response.success) {
        setPosts(prev => prev.filter(p => p.id !== postToDelete));
        setShowDeleteDialog(false);
        setPostToDelete(null);
      } else {
        alert(response.message || 'Failed to delete post');
        setShowDeleteDialog(false);
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred while deleting the post');
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-md shadow-sm h-40 animate-pulse" />
        ))}
        <p className="text-center text-gray-500">Loading feed...</p>
      </div>
    )
  }

  if (error && posts.length === 0) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700 text-center">
        <p>Error: {error}</p>
        <button
          onClick={() => fetchFeed()}
          className="mt-2 text-sm font-medium underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    )
  }

  const adaptedPosts = adaptPosts(posts)

  return (
    <div className="space-y-4">
      {adaptedPosts.map(post => (
        <div key={post.id} className="relative">
          <Link to={`/posts/${post.id}?returnTo=${encodeURIComponent('/')}`} className="block">
            <PostCard post={post} onDelete={handleDeletePost} />
          </Link>
        </div>
      ))}

      {/* Sentinel element for infinite scroll */}
      <div ref={observerTarget} className="h-10 flex items-center justify-center">
        {isFetchingMore && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            Loading more...
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-gray-500 text-sm">You've reached the end of the feed.</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeletePost}
        title="Delete post?"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
