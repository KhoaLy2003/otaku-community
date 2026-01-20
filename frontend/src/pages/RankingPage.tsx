import React, { useEffect, useState } from "react";
import { Trophy, Eye, ThumbsUp, MessageSquare, TrendingUp, Award, User as UserIcon } from "lucide-react";
import { mangaApi } from "@/lib/api/manga";
import type { TranslatorRanking } from "@/types/manga";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

type RankingPeriod = "weekly" | "monthly" | "all-time";

const RankingPage: React.FC = () => {
    const [period, setPeriod] = useState<RankingPeriod>("all-time");
    const [rankings, setRankings] = useState<TranslatorRanking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            setIsLoading(true);
            try {
                const response = await mangaApi.getTranslatorRankings(period);
                if (response.success) {
                    setRankings(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch rankings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRankings();
    }, [period]);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
        if (rank === 2) return <Award className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Award className="w-6 h-6 text-orange-400" />;
        return <span className="text-gray-400 font-bold w-6 text-center">{rank}</span>;
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Translator <span className="text-orange-600">Rankings</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                    Celebrating our top contributors who bring the best manga translations to the community.
                </p>
            </header>

            {/* Period Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-2">
                    {(["weekly", "monthly", "all-time"] as RankingPeriod[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${period === p
                                ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {rankings.length > 0 ? (
                        rankings.map((user, index) => (
                            <Link
                                key={user.userId}
                                to={ROUTES.PROFILE(user.username)}
                                className="group block bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-orange-500/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="flex-shrink-0">
                                        {getRankIcon(index + 1)}
                                    </div>

                                    <div className="flex-shrink-0 relative">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                    <UserIcon className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-orange-600 transition-colors">
                                                {user.username}
                                            </h3>
                                            {user.groupName && (
                                                <span className="text-sm text-gray-400 font-medium">[{user.groupName}]</span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Eye className="w-4 h-4" />
                                                <span>{user.totalViews.toLocaleString()} views</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>{user.totalLikes.toLocaleString()} upvotes</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MessageSquare className="w-4 h-4" />
                                                <span>{user.totalComments.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 border-l border-gray-200 dark:border-gray-700 pl-4">
                                                <TrendingUp className="w-4 h-4" />
                                                <span>{user.totalTranslations.toLocaleString()} translations</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1.5 text-orange-600 font-bold text-lg">
                                            <TrendingUp className="w-5 h-5" />
                                            {Math.round(user.score).toLocaleString()}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ranking Score</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                            < TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No rankings available</h3>
                            <p className="text-gray-500">Rankings will appear once translations start gaining engagement.</p>
                        </div>
                    )}
                </div>
            )}

            <footer className="mt-12 p-6 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/20">
                <h4 className="flex items-center gap-2 text-orange-800 dark:text-orange-400 font-bold mb-2">
                    <Award className="w-5 h-5" />
                    How is the score calculated?
                </h4>
                <p className="text-sm text-orange-700/80 dark:text-orange-400/60 leading-relaxed">
                    Our ranking algorithm considers a weighted combination of <strong>Views</strong> (1pt), <strong>Upvotes</strong> (10pts), and <strong>Comments</strong> (5pts) within the selected period. This ensures that quality and engagement are prioritized over raw volume.
                </p>
            </footer>
        </div>
    );
};

export default RankingPage;
