import React from "react";
import { Link } from "react-router-dom";
import type { Manga } from "../../types/manga";
import { MangaHoverModal } from "./MangaHoverModal";
import { ROUTES } from "../../constants/routes";

interface MangaCardProps {
    manga: Manga;
}

export const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
    return (
        <Link to={ROUTES.MANGA_DETAIL(manga.externalId)} className="block group relative rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 duration-300">
            <div className="aspect-[2/3] w-full relative">
                <img
                    src={manga.imageUrl}
                    alt={manga.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                {/* Helper gradient for text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <MangaHoverModal manga={manga} />
            </div>
        </Link>
    );
};
