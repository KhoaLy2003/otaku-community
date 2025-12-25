import React, { useEffect, useState, useRef, useCallback } from 'react';
import type { FeedPost } from '../../types/post';
import { Link } from 'react-router-dom';
import { PostCard, type BasePost } from '../posts/PostCard';
import { timeAgo } from '../../lib/utils';
import { postsApi } from '@/lib/api/posts';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface ProfileFeedProps {
    username: string;
    activeTab: 'posts' | 'replies' | 'likes';
}

export const ProfileFeed: React.FC<ProfileFeedProps> = ({ username, activeTab }) => {
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const observerTarget = useRef<HTMLDivElement>(null);

    const fetchPosts = useCallback(async (cursor?: string) => {
        if (!username) return;

        try {
            if (cursor) {
                setIsFetchingMore(true);
            } else {
                setLoading(true);
                setError(null);
            }

            // Note: Current API getPostsByUser might not support filtering by media/replies/likes yet
            // but we follow the cursor pagination pattern.
            const response = await postsApi.getPostsByUser(username, { cursor, limit: 10 });

            if (response.success && response.data) {
                let newPosts = response.data.posts;

                // Client-side filtering for other tabs if API doesn't support them yet
                if (activeTab !== 'posts') {
                    // For now, other tabs show nothing until API is ready
                    newPosts = [];
                }

                setPosts(prev => cursor ? [...prev, ...newPosts] : newPosts);
                setNextCursor(response.data.nextCursor);
                setHasMore(response.data.hasMore);
            } else {
                setError(response.message || 'Failed to fetch posts');
            }
        } catch (err: any) {
            console.error('Error fetching user posts:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, [username, activeTab]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading && !isFetchingMore) {
                    fetchPosts(nextCursor);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px'
            }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loading, isFetchingMore, nextCursor, fetchPosts]);

    if (loading && posts.length === 0) {
        return (
            <div className="space-y-4 p-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-md shadow-sm h-40 animate-pulse" />
                ))}
                <p className="text-center text-gray-500">Loading posts...</p>
            </div>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="p-8 text-center bg-white border-t border-gray-200">
                <p className="text-red-500 mb-2">Error: {error}</p>
                <button
                    onClick={() => fetchPosts()}
                    className="text-orange-600 font-medium hover:underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="bg-white p-12 text-center border-t border-gray-200">
                <h3 className="text-xl font-black text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500">When they post, you'll see them here.</p>
            </div>
        );
    }

    const adaptedPosts: BasePost[] = posts.map(post => ({
        id: post.id,
        title: post.title,
        body: post.content,
        media: post.media,
        image: post.image || (post.media && post.media.length > 0 ? post.media[0].mediaUrl : undefined),
        community: post.topics?.[0]?.name || 'General',
        author: post.author.name,
        authorId: post.author.id,
        authorName: post.author.name,
        time: timeAgo(post.createdAt),
        votes: post.likeCount,
        comments: post.commentCount,
    }));

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

    return (
        <div className="space-y-4">
            {adaptedPosts.map(post => (
                <div key={post.id} className="relative">
                    <Link to={`/posts/${post.id}?returnTo=${encodeURIComponent(`/profile/${username}`)}`} className="block">
                        <PostCard post={post} onDelete={handleDeletePost} />
                    </Link>
                </div>
            ))}

            {/* Sentinel for infinite scroll */}
            <div ref={observerTarget} className="h-10 flex items-center justify-center pb-4">
                {isFetchingMore && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        Loading more...
                    </div>
                )}
                {!hasMore && posts.length > 0 && (
                    <p className="text-gray-500 text-sm italic">No more posts to show.</p>
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
    );
};
