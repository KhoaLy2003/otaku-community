import React from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionText?: string;
    actionLink?: string;
    onAction?: () => void;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    actionText,
    actionLink,
    onAction,
    className
}) => {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-gray-800/40 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700",
            className
        )}>
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Icon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-bold dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
                {description}
            </p>

            {actionLink && actionText && (
                <Link
                    to={actionLink}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/10 active:scale-95"
                >
                    {actionText}
                </Link>
            )}

            {!actionLink && actionText && onAction && (
                <button
                    onClick={onAction}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/10 active:scale-95"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};
