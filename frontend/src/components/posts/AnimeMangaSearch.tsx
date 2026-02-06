import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { animeApi } from '@/lib/api/anime';
import { mangaApi } from '@/lib/api/manga';
import { TextInput } from '@/components/ui/TextInput';
import { Card } from '@/components/ui/Card';
import type { Anime } from '@/types/anime';
import type { Manga } from '@/types/manga';
import type { PostReferenceRequest } from '@/types/post';

interface AnimeMangaSearchProps {
    onSelect: (reference: PostReferenceRequest) => void;
    selectedReferences: PostReferenceRequest[];
    onRemove: (externalId: number) => void;
}

const AnimeMangaSearch: React.FC<AnimeMangaSearchProps> = ({ onSelect, selectedReferences, onRemove }) => {
    const [query, setQuery] = useState('');
    const [type, setType] = useState<'ANIME' | 'MANGA'>('ANIME');
    const [results, setResults] = useState<(Anime | Manga)[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        if (inputRef.current && results.length > 0) {
            const rect = inputRef.current.getBoundingClientRect()
            setDropdownStyle({
                position: 'fixed',
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
                maxHeight: 300,
                overflowY: 'auto',
                zIndex: 9999,
            })
        }
    }, [results])


    const search = useCallback(async (q: string, t: 'ANIME' | 'MANGA') => {
        if (!q.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            if (t === 'ANIME') {
                const response = await animeApi.searchAnime({ q });
                setResults(response.data.data);
            } else {
                const response = await mangaApi.searchManga({ q });
                setResults(response.data.data);
            }
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            search(query, type);
        }, 500);
        return () => clearTimeout(timer);
    }, [query, type, search]);

    const handleSelect = (item: Anime | Manga) => {
        const isAnime = 'type' in item; // Simple check, Anime type usually has 'type'
        const reference: PostReferenceRequest = {
            referenceType: type,
            externalId: item.externalId,
            title: item.title,
            imageUrl: item.imageUrl,
        };
        onSelect(reference);
        setQuery('');
        setResults([]);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <button
                    onClick={() => setType('ANIME')}
                    className={`px-3 py-1 text-sm font-medium rounded-full border transition ${type === 'ANIME' ? 'bg-[#ff4500] text-white border-[#ff4500]' : 'bg-white text-[#7c7c7c] border-[#edeff1]'
                        }`}
                >
                    Anime
                </button>
                <button
                    onClick={() => setType('MANGA')}
                    className={`px-3 py-1 text-sm font-medium rounded-full border transition ${type === 'MANGA' ? 'bg-[#ff4500] text-white border-[#ff4500]' : 'bg-white text-[#7c7c7c] border-[#edeff1]'
                        }`}
                >
                    Manga
                </button>
            </div>

            <div ref={inputRef} className="relative">
                <TextInput
                    placeholder={`Search ${type.toLowerCase()} to link...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                    pill={false}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7c7c7c]" />
                {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#7c7c7c]" />}
            </div>

            {results.length > 0 && (
                <Card style={dropdownStyle} className="absolute z-10 w-full max-h-[300px] overflow-y-auto p-0 shadow-lg border-[#edeff1]">
                    {results.map((item) => {
                        const isSelected = selectedReferences.some(r => r.externalId === item.externalId && r.referenceType === type);
                        return (
                            <button
                                key={item.externalId}
                                disabled={isSelected}
                                onClick={() => handleSelect(item)}
                                className={`w-full flex items-center gap-3 p-2 hover:bg-[#f6f7f8] transition border-b border-[#edeff1] last:border-0 ${isSelected ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <img src={item.imageUrl} alt={item.title} className="w-10 h-14 object-cover rounded" />
                                <div className="text-left">
                                    <p className="text-sm font-medium text-[#1a1a1b] line-clamp-1">{item.title}</p>
                                    <p className="text-sm text-[#7c7c7c]">{type}</p>
                                </div>
                                {isSelected && <span className="ml-auto text-sm text-[#ff4500] font-medium">Linked</span>}
                            </button>
                        );
                    })}
                </Card>
            )}

            {selectedReferences.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {selectedReferences.map((ref) => (
                        <div key={`${ref.referenceType}-${ref.externalId}`} className="relative group">
                            <div className="flex items-center gap-2 p-2 rounded-lg border border-[#edeff1] bg-[#f6f7f8]">
                                <img src={ref.imageUrl} alt={ref.title} className="w-8 h-10 object-cover rounded" />
                                <div className="max-w-[150px]">
                                    <p className="text-sm font-medium text-[#1a1a1b] truncate">{ref.title}</p>
                                    <p className="text-[10px] text-[#7c7c7c]">{ref.referenceType}</p>
                                </div>
                                <button
                                    onClick={() => onRemove(ref.externalId)}
                                    className="p-1 rounded-full hover:bg-gray-200"
                                >
                                    <X className="h-3 w-3 text-[#7c7c7c]" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnimeMangaSearch;
