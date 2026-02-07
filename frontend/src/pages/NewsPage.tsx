import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { newsApi } from "../lib/api";
import { NewsCard } from "../components/news/NewsCard";
import { Pagination } from "../components/anime/Pagination";
import { Dropdown } from "../components/ui/Dropdown";
import { type NewsResponse, type NewsCategory, NEWS_CATEGORIES } from "../types/news";
import { type RssSource } from "../types/admin";
import { Search, RefreshCw } from "lucide-react";

const NewsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [news, setNews] = useState<NewsResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [sources, setSources] = useState<RssSource[]>([]);

    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const selectedSourceId = searchParams.get("sourceId") || undefined;
    const selectedCategory = (searchParams.get("category") as NewsCategory) || undefined;

    const fetchNews = async (isManual = false) => {
        if (isManual) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            const response = await newsApi.getNews({
                page: currentPage,
                limit: 20,
                sourceId: selectedSourceId,
                category: selectedCategory,
            });

            if (response.success) {
                setNews(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
                setTotalElements(response.data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch news:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const fetchSources = async () => {
        try {
            const response = await newsApi.getSources();
            if (response.success) {
                setSources(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch sources:", error);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [currentPage, selectedSourceId, selectedCategory]);

    useEffect(() => {
        fetchSources();
    }, []);

    const handlePageChange = (page: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", page.toString());
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleFilterChange = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                        Otaku <span className="text-orange-500">News</span>
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl">
                        Stay updated with the latest happenings in the world of Anime, Manga, and Games.
                    </p>
                </div>

                <button
                    onClick={() => fetchNews(true)}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 text-orange-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {isRefreshing ? 'Refreshing...' : 'Refresh Feed'}
                    </span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
                <Dropdown
                    className="flex-1 min-w-[200px] md:max-w-xs"
                    value={selectedSourceId || ""}
                    onChange={(value) => handleFilterChange("sourceId", value)}
                    items={[
                        { label: "All Sources", value: "" },
                        ...sources.map((source) => ({
                            label: source.name,
                            value: source.id,
                        })),
                    ]}
                />

                <Dropdown
                    className="flex-1 min-w-[200px] md:max-w-xs"
                    value={selectedCategory || ""}
                    onChange={(value) => handleFilterChange("category", value)}
                    items={[
                        { label: "All Categories", value: "" },
                        ...NEWS_CATEGORIES.map((category) => ({
                            label: category.replace("_", " "),
                            value: category,
                        })),
                    ]}
                />

                <div className="ml-auto self-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Showing {totalElements} articles
                    </span>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm animate-pulse">
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2" />
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                        </div>
                    ))}
                </div>
            ) : news.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {news.map((item) => (
                            <NewsCard key={item.id} news={item} />
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">No matching news found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search keywords.</p>
                    <button
                        onClick={() => {
                            setSearchParams(new URLSearchParams());
                        }}
                        className="mt-6 text-orange-500 font-bold hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewsPage;
