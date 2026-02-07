import React from "react";
import { X, Globe, User, Calendar, Eye, ThumbsUp } from "lucide-react";
import type { TranslationSummary } from "../../types/manga";
import { Avatar } from "../ui/Avatar";

interface TranslationSelectorProps {
    translations: TranslationSummary[];
    chapterTitle: string;
    onSelect: (translationId: string) => void;
    onClose: () => void;
}

export const TranslationSelector: React.FC<TranslationSelectorProps> = ({
    translations,
    chapterTitle,
    onSelect,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Select Translation
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {chapterTitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* List */}
                <div className="p-4 max-h-[75vh] overflow-y-auto">
                    {translations.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No translations available for this chapter.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {translations.map((translation) => (
                                <button
                                    key={translation.translationId}
                                    onClick={() => onSelect(translation.translationId!)}
                                    className="w-full text-left p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all group"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <Avatar
                                            src={translation.translatorAvatar || undefined}
                                            alt={translation.translator}
                                            className="w-10 h-10"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
                                                {translation.name}
                                            </h3>
                                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3.5 h-3.5" />
                                                    {translation.translator}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(translation.publishedAt || translation.createdAt).toLocaleDateString()}
                                                </span>
                                                {translation.stats && (
                                                    <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-3">
                                                        <span className="flex items-center gap-1 group-hover:text-orange-500">
                                                            <Eye className="w-3.5 h-3.5" />
                                                            {translation.stats.views.toLocaleString()}
                                                        </span>
                                                        <span className="flex items-center gap-1 group-hover:text-orange-500">
                                                            <ThumbsUp className="w-3.5 h-3.5" />
                                                            {translation.stats.likes.toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                                            <Globe className="w-5 h-5 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        Community Supported Translations
                    </p>
                </div>
            </div>
        </div>
    );
};
