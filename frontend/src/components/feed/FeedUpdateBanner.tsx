import React, { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

interface FeedUpdateBannerProps {
  message: string;
  newPostsCount: number;
  onRefresh: () => void;
  onDismiss: () => void;
}

/**
 * Banner component that displays when new posts are available in the feed.
 * - Always centered from first frame
 * - Slides down smoothly
 * - Auto dismiss after 10 seconds
 * - Shows loading state during refresh with smooth scroll to top
 */
export const FeedUpdateBanner: React.FC<FeedUpdateBannerProps> = ({
  message,
  newPostsCount,
  onRefresh,
  onDismiss,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto dismiss after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 10_000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Call the refresh function
    onRefresh();
    
    // Reset refreshing state after animation completes
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-4 border border-blue-400 animate-banner-in">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </div>

          <div>
            <p className="font-semibold">
              {isRefreshing ? 'Refreshing feed...' : message}
              {!isRefreshing && newPostsCount > 0 && (
                <span className="ml-1 text-blue-100">
                  ({newPostsCount})
                </span>
              )}
            </p>
            <p className="text-xs text-blue-100">
              {isRefreshing ? 'Scrolling to top and loading new posts' : 'Click to see the latest posts'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`px-5 py-2 rounded-md font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
              isRefreshing
                ? 'bg-white/80 text-blue-600 cursor-not-allowed opacity-75'
                : 'bg-white text-blue-600 hover:bg-blue-50 active:scale-95'
            }`}
          >
            {isRefreshing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Refreshing</span>
              </div>
            ) : (
              'Refresh'
            )}
          </button>

          <button
            onClick={onDismiss}
            disabled={isRefreshing}
            className={`p-2 rounded-md transition-colors duration-200 ${
              isRefreshing
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-white/20'
            }`}
            aria-label="Dismiss notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};