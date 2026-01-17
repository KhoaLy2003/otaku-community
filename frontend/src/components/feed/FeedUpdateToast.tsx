import { useEffect } from 'react';
import { RefreshCw } from "lucide-react";

interface FeedUpdateToastProps {
  message: string;
  newPostsCount: number;
  onRefresh: () => void;
  onDismiss: () => void;
  autoHideDelay?: number;
}

/**
 * Toast-style notification for feed updates.
 * Alternative to the banner, appears in bottom-right corner.
 */
export const FeedUpdateToast: React.FC<FeedUpdateToastProps> = ({
  message,
  newPostsCount,
  onRefresh,
  onDismiss,
  autoHideDelay,
}) => {
  useEffect(() => {
    if (autoHideDelay) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHideDelay, onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in-from-bottom-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
              {message}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click to refresh and see new content
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onRefresh}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Refresh
          </button>
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};
