import React, { useState } from 'react';
import { PostCard, type BasePost } from '@/components/posts/PostCard';
import { timeAgo } from '@/lib/utils';
import type { FeedPost } from '@/types/post';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface RelatedPostsProps {
    type: 'ANIME' | 'MANGA';
    initialPosts?: FeedPost[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ type, initialPosts }) => {
    const location = useLocation();
    const [posts, setPosts] = useState<FeedPost[]>(initialPosts || []);
    const [loading, setLoading] = useState(!initialPosts);
    const [error, setError] = useState<string | null>(null);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 text-sm text-red-500 py-4">
                <AlertCircle className="h-4 w-4" />
                {error}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <MessageSquare className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No discussions yet about this {type.toLowerCase()}.</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Be the first to start a conversation!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => {
                const adaptedPost: BasePost = {
                    id: post.id,
                    title: post.title,
                    body: post.content,
                    media: post.media,
                    image: post.image || (post.media && post.media.length > 0 ? post.media[0].mediaUrl : undefined),
                    community: post.topics && post.topics.length > 0 ? post.topics[0].name : 'General',
                    authorId: post.author.id,
                    authorName: post.author.name,
                    authorAvatarUrl: post.author.avatar,
                    time: timeAgo(post.createdAt),
                    likesCount: post.likesCount,
                    isLiked: post.isLiked || false,
                    comments: post.commentCount,
                    author: post.author.name
                };

                return (
                    <Link
                        key={post.id}
                        to={`/posts/${post.id}?returnTo=${encodeURIComponent(location.pathname)}`}
                        className="block"
                    >
                        <PostCard
                            post={adaptedPost}
                            className="hover:border-orange-200 transition-colors"
                        />
                    </Link>
                );
            })}
        </div>
    );
};

export default RelatedPosts;
