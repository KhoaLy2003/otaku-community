import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, BookOpen, Clock, FileText, Edit, Trash2, Eye, Loader2, AlertCircle, Send, ExternalLink } from "lucide-react";
import { ROUTES } from "../constants/routes";
import { mangaApi } from "../lib/api/manga";
import { EmptyState } from "../components/ui/EmptyState";
import { MangaReader } from "../components/manga/MangaReader";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { cn } from "../lib/cn";
import { useMangaWebSocket } from "../hooks/useMangaWebSocket";
import { useToast } from "../hooks/useToast";
import { Modal } from "../components/ui/Modal";
import { TextInput } from "../components/ui/TextInput";
import { TextArea } from "../components/ui/TextArea";
import { Button } from "../components/ui/Button";
import type { TranslationDetail, TranslationSummary, UploadJob, TranslationActionType, TranslationPage } from "../types/manga";

export const MangaDashboardPage = () => {
    const [translations, setTranslations] = useState<TranslationSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTranslation, setSelectedTranslation] = useState<TranslationDetail | null>(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isConfirmPublishOpen, setIsConfirmPublishOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TranslationSummary | null>(null);
    const [actionType, setActionType] = useState<TranslationActionType>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [publishId, setPublishId] = useState<string | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);

    // Reorder states
    const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
    const [reorderingPages, setReorderingPages] = useState<TranslationPage[]>([]);
    const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    const selectedTranslationLabel =
        selectedItem
            ? `${selectedItem.mangaTitle} - ${selectedItem.chapterNumber}`
            : "";

    const navigate = useNavigate();
    const { showToast } = useToast();

    const fetchDashboard = useCallback(async () => {
        try {
            const data = await mangaApi.getMyTranslations();
            setTranslations(data.data);
        } catch (error) {
            console.error("Failed to fetch dashboard", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // WebSocket listener for upload updates
    useMangaWebSocket({
        onUploadUpdate: (job: UploadJob) => {
            setTranslations(prev => prev.map(t => {
                // Check if this translation belongs to the job
                if (t.translationId === job.translationId || t.translationId === job.translationId) {
                    return { ...t, uploadJob: job };
                }
                return t;
            }));

            // If job completed, maybe refresh the whole list to get updated statuses
            if (job.status === "COMPLETED") {
                fetchDashboard();
            }
        }
    });

    const handleView = async (id: string) => {
        try {
            const detail = await mangaApi.getTranslationDetail(id);
            setSelectedTranslation(detail.data);
        } catch (error) {
            console.error("Failed to view translation", error);
        }
    };

    const handleEditClick = async (translation: TranslationSummary) => {
        setSelectedItem(translation);
        setIsLoading(true);
        try {
            const detail = await mangaApi.getTranslationDetail(translation.translationId);
            setReorderingPages(detail.data.pages.sort((a, b) => a.pageIndex - b.pageIndex));
            setIsReorderModalOpen(true);
        } catch (error) {
            console.error("Failed to load translation details for reordering", error);
            showToast("Failed to load pages. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedPageIndex === null || draggedPageIndex === index) return;

        setReorderingPages((prev) => {
            const newPages = [...prev];
            const draggedPage = newPages[draggedPageIndex];
            newPages.splice(draggedPageIndex, 1);
            newPages.splice(index, 0, draggedPage);
            return newPages;
        });
        setDraggedPageIndex(index);
    };

    const handleSaveOrder = async () => {
        if (!selectedItem) return;

        setIsSavingOrder(true);
        try {
            const payload = {
                pages: reorderingPages.map((page, index) => ({
                    pageId: page.id,
                    pageIndex: index
                }))
            };

            await mangaApi.reorderPages(selectedItem.translationId, payload);
            showToast("Page order updated successfully", "success");
            setIsReorderModalOpen(false);
        } catch (error) {
            console.error("Failed to save page order", error);
            showToast("Failed to save new order", "error");
        } finally {
            setIsSavingOrder(false);
        }
    };

    const handleDeleteClick = (translation: TranslationSummary) => {
        setSelectedItem(translation);
        setActionType("DELETE");
    };

    const handlePublishClick = (translation: TranslationSummary) => {
        setSelectedItem(translation);
        setActionType("PUBLISH");
    };

    const confirmDelete = async () => {
        if (!selectedItem?.translationId) return;

        try {
            await mangaApi.deleteTranslation(selectedItem.translationId);
            setTranslations(prev =>
                prev.filter(t => t.translationId !== selectedItem.translationId)
            );
        } finally {
            setActionType(null);
            setSelectedItem(null);
        }
    };

    const confirmPublish = async () => {
        if (!selectedItem?.translationId) return;

        setIsPublishing(true);
        try {
            const updated = await mangaApi.publishTranslation(selectedItem.translationId);
            setTranslations(prev =>
                prev.map(t =>
                    t.translationId === selectedItem.translationId
                        ? { ...t, status: updated.data.status, publishedAt: updated.data.publishedAt }
                        : t
                )
            );
            showToast(`"${selectedTranslationLabel}" has been published successfully!`, "success");
        } catch {
            showToast("Failed to publish translation. Please try again.", "error");
        } finally {
            setIsPublishing(false);
            setActionType(null);
            setSelectedItem(null);
        }
    };

    return (
        <div className="mx-auto flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Translator Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Manage your manga translations, drafts, and contributions.
                    </p>
                </div>
                <Link
                    to={ROUTES.MANGA_UPLOAD}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Upload New Translation
                </Link>
            </div>

            {isLoading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : translations.length === 0 ? (
                <EmptyState
                    icon={BookOpen}
                    title="No translations yet"
                    description="Start sharing your work with the community! Your contributions help thousands of readers."
                    actionText="Upload your first chapter"
                    actionLink={ROUTES.MANGA_UPLOAD}
                />
            ) : (
                <div className="grid gap-4">
                    {translations.map((translation) => {
                        const job = translation.uploadJob;
                        const isUploading = job && job.status === "UPLOADING";
                        const isFailed = job && job.status === "FAILED";

                        return (
                            <div
                                key={translation.translationId}
                                className="group bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col gap-4 hover:border-orange-500/50 hover:shadow-xl hover:shadow-black/5 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-14 h-14 rounded-xl flex items-center justify-center",
                                            translation.status === "PUBLISHED" ? "bg-green-50 text-green-600 dark:bg-green-900/20" :
                                                isFailed ? "bg-red-50 text-red-600 dark:bg-red-900/20" : "bg-orange-50 text-orange-600 dark:bg-orange-900/20"
                                        )}>
                                            {isUploading ? <Loader2 className="w-7 h-7 animate-spin" /> :
                                                isFailed ? <AlertCircle className="w-7 h-7" /> :
                                                    translation.status === "PUBLISHED" ? <BookOpen className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                                {translation.mangaTitle || "Unknown Manga"}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Chapter {translation.chapterNumber} {translation.name ? ` - ${translation.name}` : ""}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className={cn(
                                                    "text-[10px] uppercase font-black px-2 py-0.5 rounded-md",
                                                    translation.status === "PUBLISHED" ? "bg-green-100 text-green-700 dark:bg-green-500/20" :
                                                        isUploading ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20" :
                                                            isFailed ? "bg-red-100 text-red-700 dark:bg-red-500/20" : "bg-orange-100 text-orange-700 dark:bg-orange-500/20"
                                                )}>
                                                    {isUploading ? "PROCESSANDO..." : isFailed ? "FAILED" : translation.status}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(translation.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {translation.notes && (
                                                <p className="text-xs text-gray-400 mt-2 line-clamp-1 italic">
                                                    "{translation.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!isUploading && (
                                            <>
                                                <button
                                                    onClick={() => handleView(translation.translationId!)}
                                                    className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500 hover:text-orange-500"
                                                    title="View Translation"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(translation)}
                                                    className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500 hover:text-orange-500"
                                                    title="Reorder Pages"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                {translation.status === "DRAFT" && (
                                                    <button
                                                        onClick={() => handlePublishClick(translation)}
                                                        className="p-2.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors text-gray-500 hover:text-green-500"
                                                        title="Publish Translation"
                                                    >
                                                        <Send className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {translation.status === "PUBLISHED" && translation.mangaId && (
                                                    <button
                                                        onClick={() => navigate(ROUTES.MANGA_DETAIL(translation.mangaId!))}
                                                        className="p-2.5 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors text-gray-500 hover:text-orange-500"
                                                        title="Go to Manga Detail"
                                                    >
                                                        <ExternalLink className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDeleteClick(translation)}
                                            className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-gray-500 hover:text-red-500"
                                            title="Delete Translation"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {
                                    isUploading && job && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <span>Processing Pages</span>
                                                <span>{job.uploadedPages} of {job.totalPages}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-orange-500 h-full transition-all duration-500 ease-out"
                                                    style={{ width: `${job.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    isFailed && job?.errorMessage && (
                                        <p className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-100 dark:border-red-900/20">
                                            Error: {job.errorMessage}
                                        </p>
                                    )
                                }
                            </div>
                        );
                    })}
                </div>
            )
            }

            {
                selectedTranslation && (
                    <MangaReader
                        translation={selectedTranslation}
                        onClose={() => setSelectedTranslation(null)}
                    />
                )
            }

            <ConfirmDialog
                isOpen={actionType === "DELETE"}
                title="Delete Translation?"
                message={`Are you sure you want to delete "${selectedTranslationLabel}"? This action cannot be undone.`}
                confirmText="Yes, Delete"
                variant="danger"
                onConfirm={confirmDelete}
                onClose={() => {
                    setActionType(null);
                    setSelectedItem(null);
                }}
            />

            <ConfirmDialog
                isOpen={actionType === "PUBLISH"}
                title="Publish Translation?"
                message={`Are you sure you want to publish "${selectedTranslationLabel}"? Once published, it will be visible to all users and cannot be unpublished.`}
                confirmText={isPublishing ? "Publishing..." : "Yes, Publish"}
                variant="info"
                isLoading={isPublishing}
                onConfirm={confirmPublish}
                onClose={() => {
                    if (!isPublishing) {
                        setActionType(null);
                        setSelectedItem(null);
                    }
                }}
            />

            <Modal
                isOpen={isReorderModalOpen}
                onClose={() => !isSavingOrder && setIsReorderModalOpen(false)}
                title={`Reorder Pages - ${selectedTranslationLabel}`}
            >
                <div className="space-y-6 pt-4">
                    <p className="text-sm text-gray-500">
                        Drag and drop pages to rearrange their order in the reader.
                    </p>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto p-2 custom-scrollbar border rounded-2xl border-gray-100 dark:border-gray-700">
                        {reorderingPages.map((page, idx) => (
                            <div
                                key={page.id}
                                draggable
                                onDragStart={() => setDraggedPageIndex(idx)}
                                onDragOver={(e) => handlePageDragOver(e, idx)}
                                onDragEnd={() => setDraggedPageIndex(null)}
                                className={cn(
                                    "relative aspect-[2/3] group rounded-lg overflow-hidden border transition-all cursor-move",
                                    draggedPageIndex === idx
                                        ? "opacity-40 scale-95 border-orange-500 shadow-inner"
                                        : "border-gray-100 dark:border-gray-700 hover:border-orange-500/50"
                                )}
                            >
                                <img
                                    src={page.imageUrl}
                                    alt={`Page ${idx + 1}`}
                                    className="w-full h-full object-cover pointer-events-none"
                                />
                                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                    P{idx + 1}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            color="grey"
                            onClick={() => setIsReorderModalOpen(false)}
                            disabled={isSavingOrder}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveOrder}
                            isLoading={isSavingOrder}
                        >
                            Save New Order
                        </Button>
                    </div>
                </div>
            </Modal>
        </div >
    );
};

export default MangaDashboardPage;
