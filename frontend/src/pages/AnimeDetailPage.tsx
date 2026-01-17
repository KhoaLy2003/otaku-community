import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, Clock, Tv, MessageSquare } from "lucide-react";
import { animeApi } from "../lib/api";
import type { Anime, AnimeCharacter } from "../types/anime";
import { AnimeCharacters } from "../components/anime/AnimeCharacters";
import RelatedPosts from "@/components/posts/RelatedPosts";

const AnimeDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [anime, setAnime] = useState<Anime | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError("No anime ID provided");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const data = await animeApi.getAnimeById(id);
                setAnime(data);
            } catch (err) {
                console.error("Failed to fetch anime data:", err);
                setError(err instanceof Error ? err.message : "Failed to load anime details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !anime) {
        return (
            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to list
                </button>
                <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        {error || "Anime not found"}
                    </h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-orange-600 hover:text-orange-700 underline"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 mb-6 transition-colors font-medium"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to list
            </button>

            <div className="flex flex-col gap-8">
                {/* Anime Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Hero Section with Backdrop simulation */}
                    <div className="relative h-48 md:h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-md opacity-40 scale-110"
                            style={{ backgroundImage: `url(${anime.imageUrl})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
                    </div>

                    <div className="relative px-6 pb-8 md:px-10 -mt-24 md:-mt-32">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Poster */}
                            <div className="flex-shrink-0 mx-auto md:mx-0">
                                <img
                                    src={anime.imageUrl}
                                    alt={anime.title}
                                    className="w-40 md:w-56 rounded-lg shadow-xl border-4 border-white dark:border-gray-800"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-4 md:pt-10 text-center md:text-left">
                                <div className="mb-4">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                        {anime.title}
                                    </h1>
                                    {anime.title_english && (
                                        <h2 className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                                            {anime.title_english}
                                        </h2>
                                    )}
                                </div>

                                {/* Meta Tags */}
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 rounded-full text-sm font-bold border border-yellow-100 dark:border-yellow-900/30">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        {anime.score}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-500 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-900/30">
                                        <Tv className="w-3.5 h-3.5" />
                                        {anime.type}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-500 rounded-full text-sm font-medium border border-green-100 dark:border-green-900/30">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {anime.year || "N/A"}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-500 rounded-full text-sm font-medium border border-purple-100 dark:border-purple-900/30">
                                        <Clock className="w-3.5 h-3.5" />
                                        {anime.episodes ? `${anime.episodes} eps` : "Unknown"}
                                    </div>
                                </div>

                                {/* Genres */}
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                                    {anime.genres.map(genre => (
                                        <span key={genre.name} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-md text-[11px] font-medium uppercase tracking-wider">
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>

                                {/* Synopsis */}
                                <div className="prose dark:prose-invert max-w-none text-left">
                                    <h3 className="text-sm font-bold mb-2 uppercase tracking-wide text-gray-400">Synopsis</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line line-clamp-6 hover:line-clamp-none cursor-pointer transition-all">
                                        {anime.synopsis}
                                    </p>
                                </div>

                                {/* Additional Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Status</span>
                                        <span className="text-sm font-medium dark:text-gray-200">{anime.status}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Source</span>
                                        <span className="text-sm font-medium dark:text-gray-200">{anime.source}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Duration</span>
                                        <span className="text-sm font-medium dark:text-gray-200">{anime.duration}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Rating</span>
                                        <span className="text-sm font-medium dark:text-gray-200">{anime.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Characters Section */}
                {anime.characters && anime.characters.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-6 py-8 md:px-10">
                        <AnimeCharacters characters={anime.characters} />
                    </div>
                )}

                {/* Related Discussions Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <MessageSquare className="w-5 h-5 text-orange-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Related Discussions</h2>
                    </div>
                    <RelatedPosts type="ANIME" initialPosts={anime.relatedPosts} />
                </div>
            </div>
        </div>
    );
};

export default AnimeDetailPage;
