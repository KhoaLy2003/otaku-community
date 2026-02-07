import React from "react";
import { type NewsResponse } from "../../types/news";
import { formatTimeAgo } from "@/lib/utils";

interface NewsCardProps {
    news: NewsResponse;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
    const timeAgo = formatTimeAgo(news.publishedAt);

    return (
        <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="relative aspect-video overflow-hidden">
                {news.imageUrl ? (
                    <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{news.source?.name}</span>
                    </div>
                )}
                <div className="absolute top-2 left-2 flex gap-2">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {news.source?.name}
                    </span>
                    {news.category && (
                        <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                            {news.category}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-orange-500 transition-colors duration-200">
                    {news.title}
                </h3>
                {news.summary && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {news.summary}
                    </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        {news.author ? `By ${news.author}` : timeAgo}
                    </span>
                    {news.author && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            {timeAgo}
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
};
