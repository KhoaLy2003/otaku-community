import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  TrendingUp,
  Users,
  HelpCircle,
  BookOpen,
  Info,
  ChevronLeft,
  ChevronRight,
  Tv,
  Book,
  Newspaper,
} from "lucide-react";
import { Colors } from "../../constants/colors";
import { cn } from "../../lib/utils";
import { ROUTES } from "@/constants/routes";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const menuItems: MenuItem[] = [
  { id: "home", label: "Home", icon: Home, href: ROUTES.HOME },
  { id: "anime", label: "Anime", icon: Tv, href: ROUTES.ANIME_LIST },
  { id: "manga", label: "Manga", icon: Book, href: ROUTES.MANGA_LIST },
  { id: "ranking", label: "Ranking", icon: TrendingUp, href: ROUTES.RANKINGS },
  { id: "news", label: "News", icon: Newspaper, href: ROUTES.NEWS },
  { id: "communities", label: "Communities", icon: Users, href: ROUTES.COMMUNITIES },
  { id: "help", label: "Help", icon: HelpCircle, href: ROUTES.HELP },
  { id: "blog", label: "Blog", icon: BookOpen, href: ROUTES.BLOG },
  { id: "about", label: "About", icon: Info, href: ROUTES.ABOUT },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "sticky top-0 h-full border-r transition-all duration-300 bg-white hidden md:block",
        isCollapsed ? "w-16" : "w-60"
      )}
      style={{ borderColor: Colors.Grey[20] }}
    >
      <div className="flex flex-col h-full">
        {/* Collapse button */}
        <div
          className={cn(
            "relative flex items-center border-b",
            isCollapsed ? "justify-center" : "justify-between p-5"
          )}
          style={{ borderColor: Colors.Grey[20], height: 48 }}
        >
          {/* Show product name only when expanded */}
          {!isCollapsed && (
            <span className="text-sm font-semibold text-[#1a1a1b]">
              Otaku Community
            </span>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-[#F6F7F8] transition"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-[#7c7c7c]" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-[#7c7c7c]" />
            )}
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href);

              return (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    onClick={(e) => {
                      if (isActive && item.id === "home") {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent("REFRESH_FEED"));
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition",
                      "hover:bg-[#F6F7F8]",
                      isActive && "bg-[#F6F7F8]"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isActive ? "text-[#1a1a1b]" : "text-[#7c7c7c]"
                      )}
                    />
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isActive ? "text-[#1a1a1b]" : "text-[#7c7c7c]"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}