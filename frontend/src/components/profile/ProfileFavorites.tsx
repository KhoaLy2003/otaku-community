import { useState } from "react";
import { type FavoriteResponse } from "../../lib/api/favorites";
import { FavoritesList } from "./FavoritesList";
import { AddFavoriteModal } from "./AddFavoriteModal";

interface ProfileFavoritesProps {
    isOwner: boolean;
}

export const ProfileFavorites = ({ isOwner }: ProfileFavoritesProps) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleFavoriteAdded = (newFavorite: FavoriteResponse) => {
        // We can trigger a refresh of the list
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <>
            <FavoritesList
                key={refreshTrigger} // Force re-mount/refresh when trigger changes
                isOwner={isOwner}
                onAddClick={() => setShowAddModal(true)}
            />

            {showAddModal && (
                <AddFavoriteModal
                    onClose={() => setShowAddModal(false)}
                    onAdded={handleFavoriteAdded}
                />
            )}
        </>
    );
};
