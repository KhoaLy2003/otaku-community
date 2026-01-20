import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Mousewheel } from "swiper/modules";
import {
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Minimize2,
    Layout,
    Moon,
    Sun,
    X,
    HelpCircle,
    MousePointer2,
    Keyboard as KeyboardIcon,
    Zap,
    ThumbsUp,
    MessageSquare
} from "lucide-react";
import { cn } from "../../lib/cn";
import type { TranslationDetail } from "../../types/manga";
import { TranslationComments } from "./TranslationComments";
import { mangaApi } from "../../lib/api/manga";
import { useAuth } from "../../hooks/useAuth";
import { ConfirmDialog } from "../ui/ConfirmDialog";

// Import Swiper styles
import "swiper/swiper-bundle.css";

interface MangaReaderProps {
    translation: TranslationDetail;
    onClose: () => void;
    initialPage?: number;
}

export const MangaReader: React.FC<MangaReaderProps> = ({
    translation,
    onClose,
    initialPage = 0,
}) => {
    const [readingMode, setReadingMode] = useState<"horizontal" | "vertical">("vertical");
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showControls, setShowControls] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [showGuidelines, setShowGuidelines] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [stats, setStats] = useState(translation.stats);
    const { isAuthenticated, login } = useAuth();
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

    // Register view once
    useEffect(() => {
        if (translation.translationId) {
            mangaApi.registerView(translation.translationId).then(res => {
                if (res.success && res.data) setStats(res.data);
            }).catch(console.error);

            mangaApi.getLikeStatus(translation.translationId).then(res => {
                if (res.success) setIsLiked(res.data || false);
            }).catch(console.error);
        }
    }, [translation.translationId]);

    const handleLike = async () => {
        if (!isAuthenticated) {
            setIsLoginDialogOpen(true);
            return;
        }

        if (!translation.translationId) return;
        try {
            const res = await mangaApi.toggleReaction(translation.translationId);
            if (res.success && res.data) {
                setStats(res.data);
                setIsLiked(!isLiked);
            }
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const handleTap = (e: React.MouseEvent) => {
        if (showGuidelines || isCommentsOpen) return;
        // If tap in the middle 40% of the screen, toggle controls
        const x = e.clientX / window.innerWidth;
        if (x > 0.3 && x < 0.7) {
            setShowControls((prev) => !prev);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex flex-col overflow-hidden transition-colors duration-300",
                isDarkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"
            )}
            onClick={handleTap}
        >
            {/* Header Controls */}
            <div
                className={cn(
                    "absolute top-[-10px] left-0 right-0 z-20 p-4 pt-10 pb-16 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-all duration-500 ease-in-out",
                    showControls ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
                )}
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg truncate max-w-[200px] md:max-w-md">
                            {translation.mangaTitle} Ch.{translation.chapterNumber}
                        </h1>
                        <p className="text-xs text-gray-400">
                            {translation.translator} • Page {currentPage + 1} / {translation.pages.length}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                    {/* Social Buttons */}
                    <button
                        onClick={handleLike}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-1"
                        title="Like Translation"
                    >
                        <ThumbsUp className={cn("w-5 h-5 transition-colors", isLiked ? "text-orange-500 fill-orange-500" : "text-gray-400")} />
                        <span className="text-[10px] font-black">{stats?.likes || 0}</span>
                    </button>
                    <button
                        onClick={() => {
                            setIsCommentsOpen(true);
                            setShowControls(false);
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-1"
                        title="Comments"
                    >
                        <MessageSquare className="w-5 h-5 text-gray-400 hover:text-orange-500 transition-colors" />
                        <span className="text-[10px] font-black">{stats?.comments || 0}</span>
                    </button>

                    <div className="w-px h-6 bg-white/20 mx-1 hidden md:block" />

                    <button
                        onClick={() => setShowGuidelines(true)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Reading Guide"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Toggle Theme"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => setReadingMode(readingMode === "horizontal" ? "vertical" : "horizontal")}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Switch Reading Mode"
                    >
                        <Layout className={cn("w-5 h-5", readingMode === "vertical" && "rotate-90")} />
                    </button>
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block"
                        title="Toggle Fullscreen"
                    >
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Reader Body */}
            <div className="flex-1 relative min-h-0 overflow-hidden">
                {readingMode === "horizontal" ? (
                    <Swiper
                        modules={[Navigation, Pagination, Keyboard, Mousewheel]}
                        spaceBetween={0}
                        slidesPerView={1}
                        initialSlide={initialPage}
                        keyboard={{ enabled: true }}
                        mousewheel={true}
                        grabCursor={true}
                        preventInteractionOnTransition={true}
                        centeredSlides={true}
                        onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
                        className="h-full w-full select-none swiper-container-full"
                    >
                        {translation.pages.map((page) => (
                            <SwiperSlide
                                key={page.id}
                                className="flex items-center justify-center w-full h-full"
                            >
                                <img
                                    src={page.imageUrl}
                                    alt={`Page ${page.pageIndex + 1}`}
                                    className="max-h-full max-w-full w-auto h-auto object-contain shadow-2xl"
                                    draggable={false}
                                    loading="eager"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth bg-black/40 custom-scrollbar">
                        <div className="max-w-3xl mx-auto flex flex-col items-center py-8 px-4">
                            {translation.pages.map((page) => (
                                <img
                                    key={page.id}
                                    src={page.imageUrl}
                                    alt={`Page ${page.pageIndex + 1}`}
                                    className="w-full h-auto object-contain mb-1 shadow-lg"
                                    loading="lazy"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Comments Drawer */}
            <TranslationComments
                translationId={translation.translationId}
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
            />

            {/* Login Requirement Dialog */}
            <ConfirmDialog
                isOpen={isLoginDialogOpen}
                onClose={() => setIsLoginDialogOpen(false)}
                onConfirm={() => {
                    setIsLoginDialogOpen(false);
                    login();
                }}
                title="Login Required"
                message="You need to be logged in to like and support your favorite translations. Joining our community only takes a second!"
                confirmText="Login Now"
                cancelText="Maybe Later"
                variant="info"
            />

            {/* Guideline Modal */}
            {showGuidelines && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-xl text-orange-600">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold dark:text-white">Quick Guide</h3>
                                </div>
                                <button onClick={() => setShowGuidelines(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-400 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-2xl items-start">
                                    <KeyboardIcon className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-bold dark:text-white text-sm">Keyboard</p>
                                        <p className="text-xs text-gray-500">Use <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono">Left</span> / <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono">Right</span> keys to navigate. <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono">Esc</span> to close.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-2xl items-start">
                                    <MousePointer2 className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-bold dark:text-white text-sm">Navigation Tap</p>
                                        <p className="text-xs text-gray-500">Tap on the left/right edges to turn pages. Tap the center to toggle controls.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-2xl items-start">
                                    <Layout className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-bold dark:text-white text-sm">Reading Mode</p>
                                        <p className="text-xs text-gray-500">Switch between <span className="text-orange-600 font-bold italic">Horizontal</span> and <span className="text-orange-600 font-bold italic">Vertical</span> scroll in settings.</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowGuidelines(false)}
                                className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/10 active:scale-95"
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer / Navigation */}
            <div
                className={cn(
                    "absolute bottom-[-10px] left-0 right-0 z-20 p-6 pb-10 pt-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 ease-in-out flex flex-col items-center gap-6",
                    showControls ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
                )}
            >
                {/* Progress Slider (Simplified for now) */}
                <div className="w-full max-w-md bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-orange-500 h-full transition-all duration-300"
                        style={{ width: `${((currentPage + 1) / translation.pages.length) * 100}%` }}
                    />
                </div>
                <div className="flex items-center gap-8">
                    <button className="flex items-center gap-2 text-sm font-medium hover:text-orange-500 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Next Chapter
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium hover:text-orange-500 transition-colors">
                        Prev Chapter <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
