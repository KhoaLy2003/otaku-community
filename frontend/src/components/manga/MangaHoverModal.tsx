import React from "react";
import type { Manga } from "../../types/manga";
import { Star } from "lucide-react";

interface MangaHoverModalProps {
    manga: Manga;
}

export const MangaHoverModal: React.FC<MangaHoverModalProps> = ({ manga }) => {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black/80 backdrop-blur-sm p-4 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto rounded-lg">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
                    {manga.title}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">{manga.score ?? "N/A"}</span>
                    </div>
                    <span className="text-sm px-2 py-0.5 bg-white/20 rounded-full">
                        {manga.type}
                    </span>
                </div>

                <div className="flex flex-wrap gap-1 text-sm text-gray-300 mb-2">
                    {manga.genres.slice(0, 3).map((genre) => (
                        <span key={genre.name} className="bg-primary-500/20 text-primary-200 px-1.5 py-0.5 rounded">
                            {genre.name}
                        </span>
                    ))}
                </div>

                <p className="text-sm text-gray-400">
                    {manga.status} • {manga.chapters ?? "?"} ch
                </p>
            </div>
        </div>
    );
};
