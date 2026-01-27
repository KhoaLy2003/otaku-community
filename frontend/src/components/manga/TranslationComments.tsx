import React, { useState, useEffect } from 'react';
import { X, Send, User } from 'lucide-react';
import { mangaApi } from '@/lib/api/manga';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { timeAgo } from '@/lib/utils';
import { cn } from '@/lib/cn';
import { Link } from 'react-router-dom';
import type { TranslationComment } from '@/types/manga';

interface TranslationCommentsProps {
    translationId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const TranslationComments: React.FC<TranslationCommentsProps> = ({ translationId, isOpen, onClose }) => {
    const { user, isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [comments, setComments] = useState<TranslationComment[]>([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchComments(1);
        }
    }, [isOpen, translationId]);

    const fetchComments = async (pageNum: number) => {
        setLoading(true);
        try {
            const response = await mangaApi.getComments(translationId, pageNum, 20);
            if (response.success && response.data) {
                if (pageNum === 1) {
                    setComments(response.data.data);
                } else {
                    setComments(prev => [...prev, ...response.data!.data]);
                }
                setHasMore(response.data.data.length === 20);
                setPage(pageNum);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        fetchComments(page + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            showToast('Please login to comment', 'error');
            return;
        }
        if (!content.trim()) return;

        setSubmitting(true);
        try {
            const response = await mangaApi.postComment(translationId, { content });
            if (response.success && response.data) {
                // Add the new comment locally or refetch
                fetchComments(1);
                setContent('');
            }
        } catch (error) {
            showToast('Failed to post comment', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={cn(
            "fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-[60] transform transition-transform duration-300 flex flex-col",
            isOpen ? "translate-x-0" : "translate-x-full"
        )}>
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
                <h3 className="font-black uppercase tracking-widest text-gray-900 dark:text-white">Comments</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
                                    <div className="h-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 italic">
                        No comments yet. Be the first!
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 group">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                                {comment.avatarUrl ? (
                                    <img src={comment.avatarUrl} alt={comment.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                        <Link to={`/profile/${comment.username}`} className="font-semibold text-[#1a1a1b] hover:underline">
                                            {comment.username}
                                        </Link>
                                    </span>
                                    <span className="text-[10px] text-gray-400">{timeAgo(comment.createdAt)}</span>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {hasMore && !loading && (
                    <button
                        onClick={loadMore}
                        className="w-full py-2 text-xs font-bold text-gray-500 hover:text-orange-500 transition-colors uppercase tracking-widest"
                    >
                        Load More
                    </button>
                )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <div className="relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={isAuthenticated ? "Write a comment..." : "Please login to comment"}
                        disabled={!isAuthenticated || submitting}
                        className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-gray-700 rounded-2xl py-3 px-4 pr-12 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none h-24 text-sm disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!content.trim() || submitting}
                        className="absolute bottom-3 right-3 p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:grayscale"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};
