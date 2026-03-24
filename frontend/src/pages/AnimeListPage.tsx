import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { Tabs } from "../components/ui/Tabs";
import { FilterBar } from "../components/anime/FilterBar";
import { AnimeCard } from "../components/anime/AnimeCard";
import { Pagination } from "../components/anime/Pagination";
import { animeApi } from "../lib/api";
import type { Anime, SeasonArchive } from "../types/anime";

const TAB_ITEMS = [
    { id: "seasonal", label: "Seasonal Anime" },
    { id: "top", label: "Top Anime" },
];

const AnimeListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL params
    const [activeTab, setActiveTab] = useState<"seasonal" | "top">((searchParams.get("tab") as "seasonal" | "top") || "seasonal");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedType, setSelectedType] = useState(searchParams.get("type") || "");
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || "");
    const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || "");
    const [selectedSeason, setSelectedSeason] = useState(searchParams.get("season") || "");
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [animeData, setAnimeData] = useState<Anime[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [seasonsArchive, setSeasonsArchive] = useState<SeasonArchive[]>([]);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    // Use raw search query when it's empty to flush filters immediately (e.g. on tab change)
    const effectiveSearchQuery = searchQuery === "" ? "" : debouncedSearchQuery;

    // Flag to skip one-time resets on mount
    const [isInitialMount, setIsInitialMount] = useState(true);

    // Fetch seasons archive on mount
    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await animeApi.getSeasonsArchive();
                setSeasonsArchive(response.data);
            } catch (err) {
                console.error("Failed to fetch seasons archive:", err);
            }
        };
        fetchSeasons();
    }, []);

    // Update URL params when internal state changes
    useEffect(() => {
        const params: Record<string, string> = {};
        if (activeTab !== "top") params.tab = activeTab;
        if (effectiveSearchQuery) params.q = effectiveSearchQuery;
        if (selectedType) params.type = selectedType;
        if (selectedStatus) params.status = selectedStatus;
        if (activeTab === "seasonal") {
            if (selectedYear) params.year = selectedYear;
            if (selectedSeason) params.season = selectedSeason;
        }
        if (currentPage > 1) params.page = currentPage.toString();


        setSearchParams(params, { replace: true });
    }, [activeTab, effectiveSearchQuery, selectedType, selectedStatus, selectedYear, selectedSeason, currentPage, setSearchParams]);


    // Fetch data when tab, page, or filters change
    useEffect(() => {
        const fetchAnime = async () => {
            setIsLoading(true);
            setError(null);

            try {
                let response;

                if (activeTab === "top") {
                    if (effectiveSearchQuery || selectedType || selectedStatus) {
                        response = await animeApi.searchAnime({
                            q: effectiveSearchQuery || undefined,
                            type: selectedType || undefined,
                            status: selectedStatus || undefined,
                            page: currentPage,
                        });
                    } else {
                        response = await animeApi.getTrendingAnime(currentPage);
                    }
                } else {
                    if (effectiveSearchQuery || selectedType || selectedStatus) {
                        response = await animeApi.searchAnime({
                            q: effectiveSearchQuery || undefined,
                            type: selectedType || undefined,
                            status: selectedStatus || undefined,
                            page: currentPage,
                        });
                    } else {
                        response = await animeApi.getSeasonalAnime(
                            currentPage,
                            selectedYear ? parseInt(selectedYear, 10) : undefined,
                            selectedSeason || undefined
                        );
                    }
                }

                setAnimeData(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
            } catch (err) {
                console.error("Failed to fetch anime:", err);
                setError(err instanceof Error ? err.message : "Failed to load anime");
                setAnimeData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnime();
    }, [activeTab, effectiveSearchQuery, selectedType, selectedStatus, selectedYear, selectedSeason, currentPage]);

    // Reset page when filters or tab change (skip initial mount to preserve URL page)
    useEffect(() => {
        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }
        setCurrentPage(1);
    }, [effectiveSearchQuery, selectedType, selectedStatus, activeTab, selectedYear, selectedSeason]);

    return (
        <div className="w-full max-w-[1280px] mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div
                id="anime-list-top"
                className="scroll-mt-[80px]"
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Anime Discovery
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Explore the world of anime
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <Tabs
                    tabs={TAB_ITEMS}
                    activeTab={activeTab}
                    onChange={(id) => {
                        const newTab = id as "top" | "seasonal";
                        if (newTab !== activeTab) {
                            setActiveTab(newTab);
                            setSearchQuery("");
                            setSelectedType("");
                            setSelectedStatus("");
                            setSelectedYear("");
                            setSelectedSeason("");
                        }
                    }}
                    variant="underline"
                />
            </div>

            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                // New seasonal filters
                selectedYear={activeTab === "seasonal" ? selectedYear : undefined}
                onYearChange={setSelectedYear}
                selectedSeason={activeTab === "seasonal" ? selectedSeason : undefined}
                onSeasonChange={setSelectedSeason}
                yearOptions={activeTab === "seasonal" ? [
                    { label: "Season", value: "" },
                    ...seasonsArchive.map(s => ({ label: s.year.toString(), value: s.year.toString() }))
                ] : undefined}
                seasonOptions={activeTab === "seasonal" && selectedYear ? [
                    { label: "All Seasons", value: "" },
                    ...(seasonsArchive.find(s => s.year.toString() === selectedYear)?.seasons.map(season => ({
                        label: season.charAt(0).toUpperCase() + season.slice(1),
                        value: season
                    })) || [])
                ] : undefined}
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
                    {animeData.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {animeData.map((anime) => (
                                <AnimeCard key={anime.externalId} anime={anime} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                            <p className="text-lg">No anime found matching your criteria.</p>
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

export default AnimeListPage;
