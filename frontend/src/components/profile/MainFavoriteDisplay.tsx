import React from "react";
import { Quote } from "lucide-react";
import { type MainFavorite } from "../../types/user";

interface MainFavoriteDisplayProps {
    favorite: MainFavorite;
}

export const MainFavoriteDisplay: React.FC<MainFavoriteDisplayProps> = ({ favorite }) => {
    if (!favorite) return null;

    return (
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-900/20 rounded-xl p-4 md:p-6 mb-6 border border-orange-100 dark:border-orange-800/30">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Image */}
                <div className="flex-shrink-0 relative group">
                    <div className="w-32 h-48 rounded-lg overflow-hidden shadow-md rotate-[-2deg] group-hover:rotate-0 transition-transform duration-300 border-2 border-white dark:border-gray-800">
                        <img
                            src={favorite.favoriteImageUrl}
                            alt={favorite.favoriteName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <span className="text-sm">⭐</span>
                        <span className="text-[10px] font-bold uppercase tracking-wide">
                            Main {favorite.favoriteType}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {favorite.favoriteName}
                    </h3>

                    <div className="relative">
                        <Quote className="absolute -top-2 -left-2 w-4 h-4 text-orange-300 dark:text-orange-700 opacity-50 transform -scale-x-100" />
                        <p className="text-gray-600 dark:text-gray-300 italic text-md md:text-lg pl-4 pr-2 py-1 leading-relaxed">
                            "{favorite.favoriteReason}"
                        </p>
                        <Quote className="absolute -bottom-2 -right-2 w-4 h-4 text-orange-300 dark:text-orange-700 opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    );
};
