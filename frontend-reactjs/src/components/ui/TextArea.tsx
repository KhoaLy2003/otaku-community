import React, { type TextareaHTMLAttributes } from 'react';
import { Colors } from '../../constants/colors';
import { cn } from '../../lib/utils';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export function TextArea({ label, error, className, ...props }: TextAreaProps) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-semibold text-gray-700 ml-1">
                    {label}
                </label>
            )}
            <textarea
                className={cn(
                    "w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none resize-none min-h-[100px]",
                    "border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200",
                    error && "border-red-500 focus:ring-red-200",
                    className
                )}
                style={{ backgroundColor: Colors.Grey[10] }}
                {...props}
            />
            {error && <span className="text-xs text-red-500 ml-1 mt-1">{error}</span>}
        </div>
    );
}
