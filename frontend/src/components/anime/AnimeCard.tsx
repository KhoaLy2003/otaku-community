import React from "react";
import { Link } from "react-router-dom";
import type { Anime } from "../../types/anime";
import { AnimeHoverModal } from "./AnimeHoverModal";
import { ROUTES } from "../../constants/routes";

interface AnimeCardProps {
    anime: Anime;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
    return (
        <Link to={ROUTES.ANIME_DETAIL(anime.externalId)} className="block group relative rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 duration-300">
            <div className="aspect-[2/3] w-full relative">
                <img
                    src={anime.imageUrl}
                    alt={anime.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                {/* Helper gradient for text visibility if we were showing text overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <AnimeHoverModal anime={anime} />
            </div>
        </Link>
    );
};
