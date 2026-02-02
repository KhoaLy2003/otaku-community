import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    FileText,
    Database,
    Settings,
    ChevronLeft,
    ChevronRight,
    Shield,
} from "lucide-react";
import { Colors } from "@/constants/colors";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
}

const adminMenuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: ROUTES.ADMIN_DASHBOARD },
    { id: "users", label: "User Management", icon: Users, href: ROUTES.ADMIN_USERS },
    { id: "content", label: "Content Moderation", icon: FileText, href: ROUTES.ADMIN_CONTENT },
    { id: "database", label: "Database", icon: Database, href: ROUTES.ADMIN_DATABASE },
    { id: "settings", label: "System Settings", icon: Settings, href: ROUTES.ADMIN_SETTINGS },
];

export function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    return (
        <aside
            className={cn(
                "sticky top-0 h-screen border-r transition-all duration-300 bg-white hidden md:block",
                isCollapsed ? "w-16" : "w-64"
            )}
            style={{ borderColor: Colors.Grey[20] }}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div
                    className={cn(
                        "relative flex items-center border-b px-4",
                        isCollapsed ? "justify-center" : "justify-between"
                    )}
                    style={{ borderColor: Colors.Grey[20], height: 60 }}
                >
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-[#FF4500]" />
                            <span className="text-sm font-bold text-[#1a1a1b] uppercase tracking-wider">
                                Admin Panel
                            </span>
                        </div>
                    )}
                    {isCollapsed && <Shield className="h-5 w-5 text-[#FF4500]" />}

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-[#F6F7F8] transition ml-auto"
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
                <nav className="flex-1 p-3">
                    <ul className="space-y-1">
                        {adminMenuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href));

                            return (
                                <li key={item.id}>
                                    <Link
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition",
                                            "hover:bg-[#F6F7F8]",
                                            isActive && "bg-orange-50 text-[#FF4500]"
                                        )}
                                        title={isCollapsed ? item.label : undefined}
                                    >
                                        <Icon
                                            className={cn(
                                                "h-5 w-5 flex-shrink-0",
                                                isActive ? "text-[#FF4500]" : "text-[#7c7c7c]"
                                            )}
                                        />
                                        {!isCollapsed && (
                                            <span
                                                className={cn(
                                                    "text-sm font-bold",
                                                    isActive ? "text-[#FF4500]" : "text-[#7c7c7c]"
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

                {/* Footer */}
                <div className="p-4 border-t" style={{ borderColor: Colors.Grey[20] }}>
                    {!isCollapsed && (
                        <Link to={ROUTES.HOME} className="text-xs text-gray-400 hover:text-gray-600 font-medium">
                            &larr; Back to Main Site
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    );
}
