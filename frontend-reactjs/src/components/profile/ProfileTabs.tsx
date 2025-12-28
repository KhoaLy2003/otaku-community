import React from 'react';
import { cn } from '../../lib/utils';

type TabType = 'posts' | 'replies' | 'media' | 'likes';

interface ProfileTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs: { id: TabType; label: string }[] = [
        { id: 'posts', label: 'Posts' },
        { id: 'replies', label: 'Replies' },
        { id: 'media', label: 'Media' },
        { id: 'likes', label: 'Likes' },
    ];

    return (
        <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex-1 px-4 py-4 text-sm font-bold transition-colors relative min-w-max",
                        activeTab === tab.id
                            ? "text-gray-900"
                            : "text-gray-500 hover:bg-gray-100"
                    )}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full mx-auto w-12" />
                    )}
                </button>
            ))}
        </div>
    );
};
