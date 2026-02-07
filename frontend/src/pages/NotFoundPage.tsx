import { useNavigate } from "react-router-dom";
import { Home, Compass, Ghost, MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden">
            <div className="max-w-3xl w-full text-center relative">
                {/* Background Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.03]">
                    <span className="text-[30rem] font-black leading-none select-none tracking-tighter">
                        404
                    </span>
                </div>

                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {/* Main Visual */}
                    <div className="relative inline-block">
                        <div className="w-40 h-40 bg-orange-50 rounded-[3rem] flex items-center justify-center mx-auto rotate-12 group hover:rotate-0 transition-all duration-700">
                            <Ghost className="w-20 h-20 text-orange-500 animate-bounce" />
                        </div>
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 rotate-12">
                            <Compass className="w-6 h-6 animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter uppercase">
                            Lost In <span className="text-orange-500">Space?</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
                            The page you are looking for has either drifted away into the void or never existed in this dimension.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            icon={<MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
                            className="px-8 py-6 rounded-2xl font-bold uppercase tracking-widest text-xs border-2 hover:bg-gray-50 group"
                        >
                            Go Back
                        </Button>
                        <Button
                            onClick={() => navigate(ROUTES.HOME)}
                            icon={<Home className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                            className="px-8 py-6 rounded-2xl font-bold uppercase tracking-widest text-xs bg-gray-900 text-white hover:bg-black shadow-2xl shadow-black/10 group"
                        >
                            Return Home
                        </Button>
                    </div>

                    {/* Sidenote */}
                    <div className="pt-12 border-t border-gray-100 max-w-sm mx-auto">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                            Error Code: 0x404_NOT_FOUND
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
