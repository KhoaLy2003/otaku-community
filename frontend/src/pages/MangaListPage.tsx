import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { Tabs } from "../components/ui/Tabs";
import { MangaFilterBar } from "../components/manga/MangaFilterBar";
import { MangaCard } from "../components/manga/MangaCard";
import { Pagination } from "../components/anime/Pagination";
import { mangaApi } from "../lib/api";
import type { Manga } from "../types/manga";

const TAB_ITEMS = [
    { id: "top", label: "Top Manga" },
    // { id: "search", label: "Search Results" },
];

const MangaListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL params
    const [activeTab, setActiveTab] = useState<"top" | "search">((searchParams.get("tab") as "top" | "search") || "top");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedType, setSelectedType] = useState(searchParams.get("type") || "");
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || "");
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mangaData, setMangaData] = useState<Manga[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Flag to skip one-time resets on mount
    const [isInitialMount, setIsInitialMount] = useState(true);

    // Update URL params when internal state changes
    useEffect(() => {
        const params: Record<string, string> = {};
        if (activeTab !== "top") params.tab = activeTab;
        if (debouncedSearchQuery) params.q = debouncedSearchQuery;
        if (selectedType) params.type = selectedType;
        if (selectedStatus) params.status = selectedStatus;
        if (currentPage > 1) params.page = currentPage.toString();

        setSearchParams(params, { replace: true });
    }, [activeTab, debouncedSearchQuery, selectedType, selectedStatus, currentPage, setSearchParams]);

    // Fetch data when tab, page, or filters change
    useEffect(() => {
        const fetchManga = async () => {
            setIsLoading(true);
            setError(null);

            try {
                let response;

                // If any filter is applied, use search endpoint
                if (debouncedSearchQuery || selectedType || selectedStatus) {
                    response = await mangaApi.searchManga({
                        q: debouncedSearchQuery || undefined,
                        type: selectedType || undefined,
                        status: selectedStatus || undefined,
                        page: currentPage,
                    });
                } else {
                    // Otherwise use top manga endpoint
                    response = await mangaApi.getTopManga(currentPage);
                }

                setMangaData(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
            } catch (err) {
                console.error("Failed to fetch manga:", err);
                setError(err instanceof Error ? err.message : "Failed to load manga");
                setMangaData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchManga();
    }, [activeTab, debouncedSearchQuery, selectedType, selectedStatus, currentPage]);

    // Reset page when filters or tab change (skip initial mount to preserve URL page)
    useEffect(() => {
        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }
        setCurrentPage(1);
    }, [debouncedSearchQuery, selectedType, selectedStatus, activeTab]);

    return (
        <div className="w-full max-w-[1280px] mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Manga Discovery
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Explore the world of manga
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <Tabs
                    tabs={TAB_ITEMS}
                    activeTab={activeTab}
                    onChange={(id) => setActiveTab(id as "top" | "search")}
                    variant="underline"
                />
            </div>

            <MangaFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
            />

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array(10).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 dark:bg-gray-700 aspect-[2/3] rounded-lg mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {mangaData.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {mangaData.map((manga) => (
                                <MangaCard key={manga.externalId} manga={manga} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                            <p className="text-lg">No manga found matching your criteria.</p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default MangaListPage;
