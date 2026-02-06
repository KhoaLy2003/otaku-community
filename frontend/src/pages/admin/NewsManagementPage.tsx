import { useState, useEffect, useCallback } from "react";
import {
    Newspaper,
    Search,
    Trash2,
    RefreshCw,
    ExternalLink,
    MoreVertical,
    Filter,
    RotateCcw,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dropdown, type DropdownItem } from "@/components/ui/Dropdown";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { adminApi } from "@/lib/api/admin";
import type { AdminNewsItem } from "@/types/admin";
import { Button } from "@/components/ui/Button";

export const NewsManagementPage = () => {
    // State
    const [news, setNews] = useState<AdminNewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);

    // Filters
    const [searchQuery, setSearchQuery] = useState(""); // Note: API might not support search query yet if not added, but UI can have it
    const [sourceFilter, setSourceFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ACTIVE"); // ACTIVE or DELETED

    // Dialog
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        confirmText: string;
        variant: 'danger' | 'warning' | 'info';
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "Confirm",
        variant: 'info',
        onConfirm: () => { },
    });

    // Mock source options for now, ideally fetch from unique sources
    const sourceOptions: DropdownItem[] = [
        { label: "All Sources", value: "ALL" },
        { label: "ANN", value: "ANN" },
        { label: "Crunchyroll", value: "CRUNCHYROLL" },
        // ...
    ];

    const statusOptions: DropdownItem[] = [
        { label: "Active", value: "ACTIVE" },
        { label: "Deleted", value: "DELETED" },
    ];

    const fetchNews = useCallback(async () => {
        setIsLoading(true);
        try {
            const isDeleted = statusFilter === "DELETED";
            const source = sourceFilter === "ALL" ? undefined : sourceFilter;

            const response = await adminApi.getAdminNews({
                source,
                deleted: isDeleted,
                page: currentPage - 1,
                size: pageSize
            });

            if (response.success) {
                setNews(response.data.data);
                setTotalItems(response.data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch news:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, sourceFilter, statusFilter]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleDelete = (item: AdminNewsItem) => {
        setConfirmConfig({
            isOpen: true,
            title: "Delete News Article",
            message: `Are you sure you want to delete "${item.title}"?`,
            confirmText: "Delete",
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await adminApi.deleteNews(item.id);
                    fetchNews();
                } catch (error) {
                    console.error("Delete failed:", error);
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleRestore = (item: AdminNewsItem) => {
        setConfirmConfig({
            isOpen: true,
            title: "Restore News Article",
            message: `Restore "${item.title}"?`,
            confirmText: "Restore",
            variant: 'info',
            onConfirm: async () => {
                try {
                    await adminApi.restoreNews(item.id);
                    fetchNews();
                } catch (error) {
                    console.error("Restore failed:", error);
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-tight flex items-center gap-2">
                        <Newspaper className="w-6 h-6 text-blue-500" />
                        News Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Review, organize, and moderate aggregated news content.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative group w-full max-w-xs">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search news titles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Client side filter or need API update
                        className="w-full pl-11 pr-4 py-2.5 bg-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-2xl text-sm transition-all shadow-sm"
                    />
                </div>

                <Dropdown
                    items={sourceOptions}
                    value={sourceFilter}
                    onChange={setSourceFilter}
                    className="w-48"
                />

                <Dropdown
                    items={statusOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    className="w-40"
                />

                <button
                    onClick={() => fetchNews()}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors shadow-sm ml-auto"
                    title="Refresh"
                >
                    <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                </button>
            </div>

            {/* News Table */}
            <Card className="p-0 overflow-hidden shadow-xl shadow-black/5 bg-white border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 w-[40%]">Article Title</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Source</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                            <span className="text-sm font-medium">Loading news...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : news.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm font-medium">
                                        No news articles found.
                                    </td>
                                </tr>
                            ) : (
                                news.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-gray-900 line-clamp-2 md:line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                    {item.title}
                                                </span>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <span>Views: {item.views}</span>
                                                    <span>•</span>
                                                    <span>Bookmarks: {item.bookmarks}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                                                {item.source}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.category ? (
                                                <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                                    {item.category}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Uncategorized</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                                                {new Date(item.publishedAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                {item.deletedAt ? (
                                                    <button
                                                        onClick={() => handleRestore(item)}
                                                        className="p-2 rounded-xl transition-all hover:bg-green-50 hover:text-green-600 text-gray-400"
                                                        title="Restore"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="p-2 rounded-xl transition-all hover:bg-red-50 hover:text-red-600 text-gray-400"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <div className="w-[1px] h-4 bg-gray-100 mx-1"></div>
                                                <button className="p-2 rounded-xl transition-all hover:bg-gray-100 hover:text-gray-900 text-gray-400">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simplified) */}
                <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <span className="text-xs font-bold text-gray-500">
                        Total: {totalItems} items
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="bg-white"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={news.length < pageSize} // Crude check
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="bg-white"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>

            <ConfirmDialog
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
                variant={confirmConfig.variant}
            />
        </div>
    );
};
