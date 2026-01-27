import React, { useState, useEffect } from 'react';
import { BookOpen, Eye, ThumbsUp } from 'lucide-react';
import { mangaApi } from '@/lib/api/manga';
import { TranslationCard } from '@/components/manga/TranslationCard';
import type { UserTranslationsResponse } from '@/types/manga';

interface ProfileTranslationsProps {
    username: string;
}

export const ProfileTranslations: React.FC<ProfileTranslationsProps> = ({ username }) => {
    const [data, setData] = useState<UserTranslationsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserTranslations = async () => {
            setLoading(true);
            try {
                const response = await mangaApi.getUserTranslations(username);
                if (response.success && response.data) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch user translations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserTranslations();
    }, [username]);

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    if (!data || data.items.length === 0) {
        return (
            <div className="bg-white p-12 text-center border-t border-gray-200">
                <h3 className="text-xl font-black text-gray-900 mb-2">No translations yet</h3>
                <p className="text-gray-500">This user hasn't uploaded any manga translations.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Aggregate Stats Section */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="text-center border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Total Views</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{data.totalViews.toLocaleString()}</div>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Total Likes</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{data.totalLikes.toLocaleString()}</div>
                </div>
            </div>

            <div className="grid gap-4">
                {data.items.map(t => (
                    <TranslationCard key={t.translationId} translation={t} />
                ))}
            </div>
        </div>
    );
};
