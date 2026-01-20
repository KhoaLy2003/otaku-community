import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from './IconButton';
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, className }: ModalProps) {
    if (!isOpen) return null;
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                ref={modalRef}
                className={cn(
                    "bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <IconButton
                        onClick={onClose}
                        variant="ghost"
                        title="Close"
                    >
                        <X size={20} />
                    </IconButton>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
