import { useState, useCallback, useEffect } from "react";
import { Loader2, Search, X, AlertCircle } from "lucide-react";
import { animeApi } from "../../lib/api/anime";
import { mangaApi } from "../../lib/api/manga";
import { type FavoriteResponse, favoritesApi, type PostReferenceType } from "../../lib/api/favorites";
import { Alert } from "../ui/Alert";

interface AddFavoriteModalProps {
    onClose: () => void;
    onAdded: (favorite: FavoriteResponse) => void;
}

interface SearchResult {
    externalId: number;
    title: string;
    imageUrl: string;
    type: PostReferenceType;
}

export const AddFavoriteModal = ({ onClose, onAdded }: AddFavoriteModalProps) => {
    const [activeTab, setActiveTab] = useState<PostReferenceType>("ANIME");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [addingId, setAddingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const search = useCallback(async (q: string, type: PostReferenceType) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null); // Clear error on new search
        try {
            if (type === "ANIME") {
                const response = await animeApi.searchAnime({ q });
                setResults(
                    response.data.data.map((anime) => ({
                        externalId: anime.externalId,
                        title: anime.title,
                        imageUrl: anime.imageUrl,
                        type: "ANIME",
                    }))
                );
            } else {
                const response = await mangaApi.searchManga({ q });
                setResults(
                    response.data.data.map((manga) => ({
                        externalId: manga.externalId,
                        title: manga.title,
                        imageUrl: manga.imageUrl,
                        type: "MANGA",
                    }))
                );
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            search(query, activeTab);
        }, 500);
        return () => clearTimeout(timer);
    }, [query, activeTab, search]);

    const handleAdd = async (item: SearchResult) => {
        setAddingId(item.externalId);
        setError(null);
        try {
            const response = await favoritesApi.addFavorite({
                type: item.type,
                externalId: item.externalId,
                title: item.title,
                imageUrl: item.imageUrl,
            });

            if (response.success && response.data) {
                onAdded(response.data);
            }
        } catch (error: any) {
            if (error?.message?.includes("already in your favorites")) {
                setError("This item is already in your favorites!");
            } else {
                setError("Failed to add favorite. Please try again.");
                console.error("Failed to add favorite:", error);
            }
        } finally {
            setAddingId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Add to Favorites</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* content */}
                <div className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                    {error && (
                        <Alert variant="error" icon={<AlertCircle className="w-4 h-4" />}>
                            {error}
                        </Alert>
                    )}

                    {/* Tabs */}
                    <div className="flex space-x-2">
                        {(["ANIME", "MANGA"] as PostReferenceType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setQuery("");
                                    setResults([]);
                                    setError(null);
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {tab === "ANIME" ? "Anime" : "Manga"}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={`Search for an ${activeTab === "ANIME" ? "anime" : "manga"}...`}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            autoFocus
                        />
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                    </div>

                    {/* Results List */}
                    <div className="flex-1 overflow-y-auto border rounded-md min-h-[300px]">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                            </div>
                        ) : results.length === 0 ? (
                            <div className="flex justify-center items-center h-full text-gray-500">
                                {query ? "No results found." : "Start typing to search..."}
                            </div>
                        ) : (
                            <div className="divide-y">
                                {results.map((item) => (
                                    <div
                                        key={item.externalId}
                                        className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-12 h-16 object-cover rounded bg-gray-200"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 capitalize">
                                                {item.type.toLowerCase()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleAdd(item)}
                                            disabled={addingId === item.externalId}
                                            className="px-3 py-1.5 text-sm font-medium text-orange-500 border border-orange-500 rounded hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            {addingId === item.externalId ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                "Add"
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
