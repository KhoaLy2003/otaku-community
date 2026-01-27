import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Eye, ThumbsUp, MessageSquare, Clock } from 'lucide-react';
import { cn } from '../../lib/cn';
import { timeAgo } from '../../lib/utils';
import type { TranslationSummary } from '../../types/manga';

interface TranslationCardProps {
    translation: TranslationSummary;
}

export const TranslationCard: React.FC<TranslationCardProps> = ({ translation }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:border-orange-500/50 hover:shadow-xl hover:shadow-black/5 transition-all group">
            <div className="flex gap-4 p-4">
                {/* Manga Cover Mini */}
                <div className="w-20 h-28 flex-shrink-0 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm">
                    <img
                        src={translation.mangaUrl || ""}
                        alt={translation.mangaTitle || ""}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded">
                                CHAPTER {translation.chapterNumber}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {translation.publishedAt ? timeAgo(translation.publishedAt) : timeAgo(translation.createdAt)}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-orange-600 transition-colors">
                            {translation.mangaTitle}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
                            {translation.name || `By ${translation.translator}`}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
                            <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span className="text-xs font-bold">{translation.stats?.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                <span className="text-xs font-bold">{translation.stats?.likes || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs font-bold">{translation.stats?.comments || 0}</span>
                            </div>
                        </div>

                        <Link
                            to={`/manga/${translation.mangaId}`}
                            className="flex items-center gap-1.5 text-xs font-black text-orange-600 uppercase tracking-wider hover:underline"
                        >
                            Read Now
                            <BookOpen className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
