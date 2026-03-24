import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
    Home,
    TrendingUp,
    Users,
    HelpCircle,
    BookOpen,
    Info,
    Tv,
    Book,
    Newspaper,
    MessageSquare,
} from "lucide-react";
import { Colors } from "../../constants/colors";
import { cn } from "../../lib/utils";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
    { id: "home", label: "Home", icon: Home, href: ROUTES.HOME },
    { id: "anime", label: "Anime", icon: Tv, href: ROUTES.ANIME_LIST },
    { id: "manga", label: "Manga", icon: Book, href: ROUTES.MANGA_LIST },
    { id: "ranking", label: "Ranking", icon: TrendingUp, href: ROUTES.RANKINGS },
    { id: "news", label: "News", icon: Newspaper, href: ROUTES.NEWS },
    { id: "help", label: "Help", icon: HelpCircle, href: ROUTES.HELP },
    { id: "feedback", label: "Feedback", icon: MessageSquare, href: ROUTES.FEEDBACK },
    { id: "blog", label: "Blog", icon: BookOpen, href: ROUTES.BLOG },
    { id: "communities", label: "Communities", icon: Users, href: ROUTES.COMMUNITIES },
    { id: "about", label: "About", icon: Info, href: ROUTES.ABOUT },
];

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const location = useLocation();
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: Colors.Grey[20] }}>
                    <div className="flex items-center gap-2">
                        <img src="/logo.svg" alt="Logo" width={32} height={32} />
                        <span className="font-bold text-[#1a1a1b]">Otaku Community</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <X className="h-6 w-6 text-[#7c7c7c]" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-2">
                        {menuItems
                            .filter(item => !item.adminOnly || isAdmin)
                            .map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    item.href === "/"
                                        ? location.pathname === item.href
                                        : location.pathname.startsWith(item.href);

                                return (
                                    <li key={item.id}>
                                        <Link
                                            to={item.href}
                                            onClick={() => {
                                                onClose();
                                                if (isActive && item.id === "home") {
                                                    window.dispatchEvent(new CustomEvent("REFRESH_FEED"));
                                                }
                                            }}
                                            className={cn(
                                                "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                                                isActive
                                                    ? "bg-orange-50 text-orange-600"
                                                    : "text-[#7c7c7c] hover:bg-gray-50 hover:text-[#1a1a1b]"
                                            )}
                                        >
                                            <Icon className={cn("h-6 w-6", isActive ? "text-orange-600" : "text-[#7c7c7c]")} />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                    </ul>
                </nav>

                <div className="p-4 border-t" style={{ borderColor: Colors.Grey[20] }}>
                    <p className="text-xs text-center text-[#7c7c7c]">
                        © 2024 Otaku Community
                    </p>
                </div>
            </aside>
        </div>
    );
}
