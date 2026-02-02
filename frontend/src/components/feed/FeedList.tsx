import { Link } from 'react-router-dom'
import { PostCard, type BasePost } from '../posts/PostCard'
import { NewsCard } from '../news/NewsCard'
import { useEffect, useState, useRef, useCallback } from 'react'
import { feedApi } from '@/lib/api/feed'
import type { FeedPost } from '@/types/post'
import type { NewsResponse } from '@/types/news'
import { timeAgo, scrollToTop } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { postsApi } from '@/lib/api/posts'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export function FeedList() {
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [news, setNews] = useState<NewsResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [postCursor, setPostCursor] = useState<string | undefined>(undefined)
  const [newsCursor, setNewsCursor] = useState<string | undefined>(undefined)
  const [hasMorePosts, setHasMorePosts] = useState(false)
  const [hasMoreNews, setHasMoreNews] = useState(false)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const observerTarget = useRef<HTMLDivElement>(null)

  const fetchFeed = useCallback(async (pCursor?: string, nCursor?: string) => {
    try {
      const isInitial = !pCursor && !nCursor;
      if (!isInitial) {
        setIsFetchingMore(true)
      } else {
        setLoading(true)
        setError(null)
      }

      const response = isAuthenticated
        ? await feedApi.getHomeFeed({ postCursor: pCursor, newsCursor: nCursor })
        : await feedApi.getExploreFeed({ postCursor: pCursor, newsCursor: nCursor })

      if (response.success && response.data) {
        if (isInitial) {
          setPosts(response.data.posts)
          setNews(response.data.news)
        } else {
          setPosts(prev => [...prev, ...response.data!.posts])
          setNews(prev => [...prev, ...response.data!.news])
        }
        setPostCursor(response.data.postCursor)
        setNewsCursor(response.data.newsCursor)
        setHasMorePosts(response.data.hasMorePosts)
        setHasMoreNews(response.data.hasMoreNews)
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
      scrollToTop('smooth')
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
        const canFetchMore = (hasMorePosts || hasMoreNews) && !loading && !isFetchingMore;
        if (entries[0].isIntersecting && canFetchMore) {
          fetchFeed(postCursor, newsCursor)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px'
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
  }, [hasMorePosts, hasMoreNews, loading, isFetchingMore, postCursor, newsCursor, fetchFeed])

  const adaptPost = (post: FeedPost): BasePost => {
    return {
      id: post.id,
      title: post.title,
      body: post.content,
      media: post.media,
      image: post.image || (post.media && post.media.length > 0 ? post.media[0].mediaUrl : undefined),
      community: post.topics && post.topics.length > 0 ? post.topics[0].name : 'General',
      author: post.author.name,
      authorId: post.author.id,
      authorName: post.author.name,
      authorAvatarUrl: post.author.avatar,
      time: timeAgo(post.createdAt),
      likesCount: post.likesCount,
      isLiked: post.isLiked || false,
      comments: post.commentCount,
    }
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
        setPosts(prev => prev.filter(post => post.id !== postToDelete));
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

  if (loading && posts.length === 0 && news.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-md shadow-sm h-40 animate-pulse" />
        ))}
        <p className="text-center text-gray-500">Loading feed...</p>
      </div>
    )
  }

  if (error && posts.length === 0 && news.length === 0) {
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

  return (
    <div className="space-y-4">
      {/* Posts Section */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="relative">
            <Link to={`/posts/${post.id}?returnTo=${encodeURIComponent('/')}`} className="block">
              <PostCard post={adaptPost(post)} onDelete={handleDeletePost} />
            </Link>
          </div>
        ))}
      </div>

      {/* Visual Separator if both exist */}
      {posts.length > 0 && news.length > 0 && (
        <div className="py-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Latest News</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
      )}

      {/* News Section */}
      <div className="space-y-4">
        {news.map(item => (
          <div key={item.id} className="relative">
            <NewsCard news={item} />
          </div>
        ))}
      </div>

      {/* Sentinel element for infinite scroll */}
      <div ref={observerTarget} className="h-10 flex items-center justify-center">
        {isFetchingMore && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            Loading more...
          </div>
        )}
        {!(hasMorePosts || hasMoreNews) && (posts.length > 0 || news.length > 0) && (
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
