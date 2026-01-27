import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Shield,
    Check,
    X,
    ExternalLink,
    AlertCircle,
    Eye
} from "lucide-react";
import { MangaReader } from "../components/manga/MangaReader";
import { EmptyState } from "../components/ui/EmptyState";
import { cn } from "../lib/cn";
import type { TranslationPage } from "../types/manga";

interface ModerationItem {
    id: string;
    mangaId: number;
    mangaTitle: string;
    chapterNumber: number;
    chapterTitle: string;
    translationName: string;
    submitter: string;
    submittedAt: string;
    status: "PENDING" | "REJECTED" | "APPROVED";
    mangaImage: string;
    pages?: TranslationPage[];
}

export const MangaModerationPage = () => {
    const [queue, setQueue] = useState<ModerationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"PENDING" | "REJECTED" | "ALL">("PENDING");
    const [previewItem, setPreviewItem] = useState<ModerationItem | null>(null);

    useEffect(() => {
        const fetchQueue = async () => {
            try {
                // Mocking the moderation queue request
                const response = await fetch("/src/data/moderation.queue.json");
                const data = await response.json();
                setQueue(data.items);
            } catch (error) {
                console.error("Failed to fetch queue", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQueue();
    }, []);

    const handleAction = (id: string, action: "APPROVE" | "REJECT") => {
        setQueue(prev => prev.filter(item => item.id !== id));
        // In a real app, this would call an API
        alert(`Translation ${id} ${action === "APPROVE" ? "approved" : "rejected"}`);
    };

    const filteredQueue = queue.filter(item => {
        if (filter === "ALL") return true;
        return item.status === filter;
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600">
                        <Shield className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Moderation Queue</h1>
                        <p className="text-gray-500 text-sm">Review pending manga translations and updates.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    {(["PENDING", "REJECTED", "ALL"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider",
                                filter === f
                                    ? "bg-white dark:bg-gray-700 text-orange-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-gray-700/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Content</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Submitter</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-6 py-4"><div className="h-10 bg-gray-50 dark:bg-gray-900/40 rounded-xl" /></td>
                                    </tr>
                                ))
                            ) : filteredQueue.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <EmptyState
                                            icon={Check}
                                            title="Queue is empty"
                                            description="No pending translations to review at the moment. Great job keeping the community clean!"
                                            className="border-none bg-transparent py-0"
                                        />
                                    </td>
                                </tr>
                            ) : (
                                filteredQueue.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={item.mangaImage} alt="" className="w-10 h-14 object-cover rounded-lg shadow-sm" />
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white leading-tight">{item.mangaTitle}</p>
                                                    <p className="text-sm text-orange-600 font-medium">{item.chapterTitle}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{item.translationName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold">
                                                    {item.submitter.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold dark:text-gray-300">{item.submitter}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold dark:text-gray-300">{new Date(item.submittedAt).toLocaleDateString()}</span>
                                                <span className="text-[10px] text-gray-400">{new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 text-right">
                                                <button
                                                    onClick={() => {
                                                        setPreviewItem({
                                                            ...item,
                                                            pages: [
                                                                { id: "p1", imageUrl: item.mangaImage, pageIndex: 0 },
                                                                { id: "p2", imageUrl: "https://res.cloudinary.com/dfdwupiah/image/upload/v1703666680/demo/samples/landscapes/beach.jpg", pageIndex: 1 }
                                                            ]
                                                        });
                                                    }}
                                                    className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-400 hover:text-orange-500"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <Link
                                                    to={`/manga/${item.mangaId}`}
                                                    className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-400 hover:text-blue-500"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleAction(item.id, "APPROVE")}
                                                    className="p-2.5 bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:hover:bg-green-500/20 rounded-xl transition-colors text-green-600"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(item.id, "REJECT")}
                                                    className="p-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition-colors text-red-600"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {previewItem && (
                <MangaReader
                    translation={{
                        chapterId: previewItem.id,
                        translationId: previewItem.id,
                        name: previewItem.translationName,
                        status: "PUBLISHED", // Moderation items are treated as published for preview
                        translator: previewItem.submitter,
                        pages: previewItem.pages || [],
                        createdAt: previewItem.submittedAt,
                        chapterNumber: previewItem.chapterNumber,
                        mangaId: previewItem.mangaId,
                        mangaTitle: previewItem.mangaTitle,
                        chapterTitle: previewItem.chapterTitle
                    }}
                    onClose={() => setPreviewItem(null)}
                />
            )}

            <div className="mt-8 bg-orange-50 dark:bg-orange-900/10 p-6 rounded-3xl border border-orange-100 dark:border-orange-500/20 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-orange-600 shrink-0" />
                <div>
                    <h3 className="font-bold text-orange-900 dark:text-orange-400 mb-1">Moderator Guidelines</h3>
                    <p className="text-sm text-orange-800/70 dark:text-orange-300/60 leading-relaxed">
                        Please ensure that translations do not contain explicit content beyond the original manga's rating.
                        Check image quality and ensure all pages are present and in order. Verification of translation accuracy is encouraged but not strictly required.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MangaModerationPage;
