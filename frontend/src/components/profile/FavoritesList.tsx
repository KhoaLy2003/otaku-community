import { useEffect, useState } from "react";
import { type FavoriteResponse, favoritesApi } from "../../lib/api/favorites";
import { FavoriteItemCard } from "./FavoriteItemCard";
import { Loader2, Plus } from "lucide-react";

interface FavoritesListProps {
    isOwner: boolean;
    onAddClick?: () => void;
}

export const FavoritesList = ({ isOwner, onAddClick }: FavoritesListProps) => {
    const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const hasFavorites = favorites.length > 0;

    const fetchFavorites = async (pageNum: number, append: boolean = false) => {
        try {
            setLoading(true);
            const response = await favoritesApi.getUserFavorites(pageNum);
            if (response.success && response.data) {
                setFavorites((prev) =>
                    append ? [...prev, ...response.data!.data] : response.data!.data
                );
                setHasMore(!response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites(0);
        setPage(0);
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchFavorites(nextPage, true);
    };

    const handleUpdate = (updatedFavorite: FavoriteResponse) => {
        setFavorites((prev) =>
            prev.map((fav) => (fav.id === updatedFavorite.id ? updatedFavorite : fav))
        );
    };

    const handleDelete = (id: string) => {
        setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    };

    return (
        <div className={hasFavorites ? "space-y-6" : ""}>
            {/* Header / Empty State with CTA */}
            <div className={`flex justify-between items-center ${hasFavorites ? "mt-6" : ""}`}>
                <h2 className="text-xl font-bold text-gray-900"></h2>
                {isOwner && favorites.length !== 0 && (
                    <button
                        onClick={onAddClick}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium text-sm"
                    >
                        <Plus size={18} />
                        Add Favorite
                    </button>
                )}
            </div>

            {loading && favorites.length === 0 ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
            ) : favorites.length === 0 ? (
                <div className="bg-white p-12 text-center border-t border-gray-200">
                    <h3 className="text-xl font-black text-gray-900 mb-2">No favorites added yet.</h3>
                    {isOwner && (
                        <button
                            onClick={onAddClick}
                            className="text-orange-500 font-medium hover:underline"
                        >
                            Start building your collection
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((favorite) => (
                        <FavoriteItemCard
                            key={favorite.id}
                            favorite={favorite}
                            isOwner={isOwner}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Load More */}
            {hasMore && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Load More"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};
