import React, { useState } from 'react';
import type { AnimeCharacter } from '../../types/anime';
import { Pagination } from './Pagination';

interface AnimeCharactersProps {
    characters: AnimeCharacter[];
}

const ITEMS_PER_PAGE = 10;

export const AnimeCharacters: React.FC<AnimeCharactersProps> = ({ characters }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const headingRef = React.useRef<HTMLHeadingElement>(null);

    React.useEffect(() => {
        if (currentPage > 1 && headingRef.current) {
            headingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

    if (!characters || characters.length === 0) {
        return null;
    }

    const totalPages = Math.ceil(characters.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedCharacters = characters.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div>
            <h3 ref={headingRef} className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Characters & Voice Actors</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayedCharacters.map((char) => (
                    <div
                        key={char.malId}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/40 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800"
                    >
                        {/* Character Info */}
                        <div className="flex items-center gap-3">
                            <img
                                src={char.imageUrl}
                                alt={char.name}
                                className="w-16 h-20 object-cover"
                            />
                            <div className="py-2">
                                <p className="font-semibold text-gray-900 dark:text-white text-base line-clamp-1">{char.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{char.role}</p>
                            </div>
                        </div>

                        {/* Voice Actor Info (First listed, usually Japanese) */}
                        {char.voiceActors && char.voiceActors.length > 0 && (
                            <div className="flex items-center gap-3 pr-3 text-right">
                                <div className="py-2">
                                    <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">{char.voiceActors[0].name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{char.voiceActors[0].language}</p>
                                </div>
                                <img
                                    src={char.voiceActors[0].imageUrl}
                                    alt={char.voiceActors[0].name}
                                    className="w-12 h-16 object-cover rounded shadow-sm"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                    <p className="mt-4 text-sm text-gray-400 italic">
                        Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, characters.length)} of {characters.length} characters
                    </p>
                </div>
            )}
        </div>
    );
};
