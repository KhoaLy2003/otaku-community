import React from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Construction, ArrowLeft, Stars } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const ComingSoonPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6 bg-gradient-to-b from-white to-orange-50/30 dark:from-gray-900 dark:to-gray-800">
            <div className="relative w-full max-w-2xl text-center space-y-8">
                {/* Decorative elements */}
                <div className="absolute top-0 left-1/4 -translate-y-1/2 opacity-20 animate-pulse">
                    <Stars className="w-12 h-12 text-orange-400" />
                </div>
                <div className="absolute bottom-0 right-1/4 translate-y-1/2 opacity-20 animate-bounce delay-700">
                    <Stars className="w-8 h-8 text-orange-500" />
                </div>

                {/* Main Content Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white dark:border-gray-700 transform hover:scale-[1.01] transition-transform duration-500">

                    <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-8 relative">
                        <Construction className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-orange-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center animate-bounce">
                            <Rocket className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        Under Construction
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                        We're working hard to bring this feature to the Otaku community. Stay tuned for updates!
                    </p>

                    <div className="pt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate(ROUTES.HOME)}
                            className="group flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full shadow-lg shadow-orange-600/20 transition-all active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Go Back Home
                        </button>
                        <button
                            className="px-8 py-3 border-2 border-orange-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 text-orange-600 dark:text-orange-400 font-semibold rounded-full transition-colors"
                            onClick={() => window.history.back()}
                        >
                            Return Previous
                        </button>
                    </div>
                </div>

                {/* Bottom indicator */}
                <div className="flex justify-center items-center gap-6 pt-8 opacity-40grayscale overflow-hidden">
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Future Experience</span>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-300 dark:via-gray-600 to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonPage;
