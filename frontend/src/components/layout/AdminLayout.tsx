import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { UserMenu } from "./UserMenu";
import { Bell, Search } from "lucide-react";
import { Colors } from "@/constants/colors";

export function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Admin Header */}
                <header
                    className="h-[60px] bg-white border-b flex items-center justify-between px-6 sticky top-0 z-20"
                    style={{ borderColor: Colors.Grey[20] }}
                >
                    <div className="flex-1 max-w-xl hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search users, posts, or help docs..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 rounded-xl text-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

                        <UserMenu />
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
