import React from "react";
import { cn } from "../../lib/utils";

interface AnimeTabsProps {
    activeTab: "top" | "seasonal";
    onTabChange: (tab: "top" | "seasonal") => void;
}

export const AnimeTabs: React.FC<AnimeTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit mb-6">
            <button
                onClick={() => onTabChange("top")}
                className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    activeTab === "top"
                        ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                )}
            >
                Top Anime
            </button>
            <button
                onClick={() => onTabChange("seasonal")}
                className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    activeTab === "seasonal"
                        ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                )}
            >
                Seasonal Anime
            </button>
        </div>
    );
};
