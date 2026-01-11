import React, { useEffect, useState, useRef, useCallback } from 'react';
import { postsApi } from '@/lib/api/posts';
import type { PostMedia } from '@/types/post';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

interface ProfileMediaProps {
    username: string;
}

export const ProfileMedia: React.FC<ProfileMediaProps> = ({ username }) => {
    const [media, setMedia] = useState<PostMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(false);

    const observerTarget = useRef<HTMLDivElement>(null);

    const fetchMedia = useCallback(async (cursor?: string) => {
        if (!username) return;

        try {
            if (cursor) {
                setIsFetchingMore(true);
            } else {
                setLoading(true);
                setError(null);
            }

            const response = await postsApi.getUserMedia(username, { cursor, limit: 12 });

            if (response.success && response.data) {
                const newMedia = response.data.media;
                setMedia(prev => cursor ? [...prev, ...newMedia] : newMedia);
                setNextCursor(response.data.nextCursor);
                setHasMore(response.data.hasMore);
            } else {
                setError(response.message || 'Failed to fetch media');
            }
        } catch (err: any) {
            console.error('Error fetching user media:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, [username]);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading && !isFetchingMore) {
                    fetchMedia(nextCursor);
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
    }, [hasMore, loading, isFetchingMore, nextCursor, fetchMedia]);

    if (loading && media.length === 0) {
        return (
            <div className="grid grid-cols-3 gap-1 p-1">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="aspect-square bg-white animate-pulse" />
                ))}
            </div>
        );
    }

    if (error && media.length === 0) {
        return (
            <div className="p-8 text-center bg-white border-t border-gray-200">
                <p className="text-red-500 mb-2">Error: {error}</p>
                <button
                    onClick={() => fetchMedia()}
                    className="text-orange-600 font-medium hover:underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (media.length === 0) {
        return (
            <div className="bg-white p-12 text-center border-t border-gray-200">
                <h3 className="text-xl font-black text-gray-900 mb-2">No media yet</h3>
                <p className="text-gray-500">When they post media, you'll see it here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border-t border-gray-200">
            <div className="grid grid-cols-3 gap-1 p-1">
                {media.map((item) => (
                    <Link
                        key={item.id}
                        to={`/posts/${item.postId}?returnTo=${encodeURIComponent(`/profile/${username}`)}`}
                        className="relative aspect-square group overflow-hidden bg-gray-100"
                    >
                        <img
                            src={item.mediaUrl}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                        />
                        {item.mediaType === 'VIDEO' && (
                            <div className="absolute top-2 right-2 p-1 bg-black/50 rounded-full backdrop-blur-sm">
                                <Play className="w-3 h-3 text-white fill-current" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </Link>
                ))}
            </div>

            {/* Sentinel for infinite scroll */}
            <div ref={observerTarget} className="h-20 flex items-center justify-center">
                {isFetchingMore && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <span>Loading more media...</span>
                    </div>
                )}
                {!hasMore && media.length > 0 && (
                    <p className="text-gray-500 text-sm italic">You've reached the end of the media gallery.</p>
                )}
            </div>
        </div>
    );
};
