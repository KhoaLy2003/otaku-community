import { useState } from "react";
import { type FavoriteResponse, favoritesApi } from "../../lib/api/favorites";
import { Colors } from "../../constants/colors";

import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Edit2, Trash2 } from "lucide-react";

interface FavoriteItemCardProps {
    favorite: FavoriteResponse;
    isOwner: boolean;
    onUpdate: (updatedFavorite: FavoriteResponse) => void;
    onDelete: (id: string) => void;
}

export const FavoriteItemCard = ({
    favorite,
    isOwner,
    onUpdate,
    onDelete,
}: FavoriteItemCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [note, setNote] = useState(favorite.note || "");
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            const response = await favoritesApi.updateFavorite(favorite.id, { note });
            if (response.success && response.data) {
                onUpdate(response.data);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to update favorite note:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = () => {
        setShowConfirmDelete(true);
        setIsEditing(false); // Close edit mode if open
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        try {
            await favoritesApi.removeFavorite(favorite.id);
            onDelete(favorite.id);
        } catch (error) {
            console.error("Failed to remove favorite:", error);
            setIsLoading(false); // Only stop loading on error, on success component unmounts
        }
    };

    return (
        <div
            className="flex gap-4 p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
            style={{ borderColor: Colors.Grey[20] }}
        >
            {/* Image */}
            <div className="flex-shrink-0 w-24 h-36 rounded-md overflow-hidden bg-gray-100">
                {favorite.imageUrl ? (
                    <img
                        src={favorite.imageUrl}
                        alt={favorite.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-sm font-bold text-orange-500 uppercase tracking-wide">
                                {favorite.type}
                            </span>
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                                {favorite.title}
                            </h3>
                        </div>
                        {isOwner && !isEditing && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                                    title="Edit note"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={handleDeleteClick}
                                    className="p-1.5 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                                    title="Remove"
                                    disabled={isLoading}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-3">
                        {showConfirmDelete ? (
                            <ConfirmDialog
                                isOpen={showConfirmDelete}
                                onClose={() => setShowConfirmDelete(false)}
                                onConfirm={handleConfirmDelete}
                                title="Remove favorite?"
                                message="Are you sure to remove this item from your favorites ?"
                                confirmText={isLoading ? "Removing..." : "Yes, remove"}
                                cancelText="Cancel"
                                isLoading={isLoading}
                                variant="danger"
                            />
                        ) : isEditing ? (
                            <div className="space-y-2">
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add a personal note..."
                                    className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                    rows={3}
                                    maxLength={500}
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setNote(favorite.note || "");
                                        }}
                                        className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        className="px-3 py-1 text-sm font-medium text-white bg-orange-500 rounded hover:bg-orange-600 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Saving..." : "Save Note"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 italic">
                                {favorite.note || (
                                    <span className="text-gray-400 not-italic text-sm">
                                        No personal note added.
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer/Links */}
                {/* Could add link to detail page here if needed */}
            </div>
        </div>
    );
};
