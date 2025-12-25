import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'filled' | 'outline';
    className?: string;
}

export function Badge({ children, variant = 'filled', className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                variant === 'filled'
                    ? 'bg-orange-100 text-orange-800'
                    : 'border border-gray-300 text-gray-700',
                className
            )}
        >
            {children}
        </span>
    );
}
