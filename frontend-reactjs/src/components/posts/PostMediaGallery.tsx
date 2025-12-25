import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PostMedia } from '@/types/post';
import { Colors } from '@/constants/colors';

interface PostMediaGalleryProps {
    media: PostMedia[];
    title: string;
}

export const PostMediaGallery: React.FC<PostMediaGalleryProps> = ({ media, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!media || media.length === 0) return null;

    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    };

    const currentMedia = media[currentIndex];

    return (
        <div className="relative group w-full bg-black overflow-hidden flex items-center justify-center min-h-[300px] max-h-[600px]">
            {/* Main Media */}
            {currentMedia.mediaType === 'VIDEO' ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <video
                        src={currentMedia.mediaUrl}
                        controls
                        className="max-w-full max-h-[600px] object-contain"
                    />
                </div>
            ) : (
                <img
                    src={currentMedia.mediaUrl}
                    alt={`${title} - ${currentIndex + 1}`}
                    className="max-w-full max-h-[600px] object-contain select-none"
                    draggable={false}
                />
            )}

            {/* Navigation Buttons */}
            {media.length > 1 && (
                <>
                    <button
                        onClick={handlePrevious}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Counter / Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-xs font-bold backdrop-blur-sm">
                        {currentIndex + 1} / {media.length}
                    </div>
                </>
            )}
        </div>
    );
};
