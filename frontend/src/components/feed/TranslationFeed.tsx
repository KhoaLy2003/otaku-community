import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import { mangaApi } from '../../lib/api/manga';
import { TranslationCard } from '../manga/TranslationCard';
import { Tabs, type TabItem } from '../ui/Tabs';
import type { TranslationSummary } from '../../types/manga';

const transitionTabs: TabItem[] = [
    { id: 'latest', label: 'Latest', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'trending', label: 'Trending', icon: <TrendingUp className="h-4 w-4" /> },
];

export function TranslationFeed() {
    const [translations, setTranslations] = useState<TranslationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('latest');
    const [page] = useState(1);
    const [limit] = useState(10);

    const fetchTranslations = useCallback(async () => {
        setLoading(true);
        try {
            const response = activeTab === 'latest'
                ? await mangaApi.getLatestTranslations(page, limit)
                : await mangaApi.getTrendingTranslations(page, limit);

            if (response.success && response.data) {
                setTranslations(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch translations:', error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, page, limit]);

    useEffect(() => {
        fetchTranslations();
    }, [fetchTranslations]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded border bg-white p-3 shadow-sm mb-6">
                <Tabs
                    tabs={transitionTabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : translations.length === 0 ? (
                <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-gray-200 flex flex-col items-center">
                    <BookOpen className="w-12 h-12 text-gray-200 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No translations found</h3>
                    <p className="text-sm text-gray-500">Be the first to translate a chapter!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {translations.map(t => (
                        <TranslationCard key={t.translationId} translation={t} />
                    ))}
                </div>
            )}
        </div>
    );
}
