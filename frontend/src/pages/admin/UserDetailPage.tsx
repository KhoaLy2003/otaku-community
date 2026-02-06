import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Shield,
    ShieldAlert,
    UserX,
    Calendar,
    Activity,
    FileText,
    History,
    Gavel,
    Download,
    Star,
    Loader2} from "lucide-react";
import { cn, formatTimeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Dropdown, type DropdownItem } from "@/components/ui/Dropdown";
import { ROUTES } from "@/constants/routes";
import { adminApi } from "@/lib/api/admin";
import type { AdminUserDetail, AdminUserRole } from "@/types/admin";

// Expanded mock data for the user detail
// Role items for the dropdown
const roleItems: DropdownItem[] = [
    { label: "Standard Member", value: "USER" },
    { label: "System Administrator", value: "ADMIN" },
];

export const UserDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<AdminUserDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>("USER");

    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        confirmText: string;
        variant: 'danger' | 'warning' | 'info';
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "Confirm",
        variant: 'info',
        onConfirm: () => { },
    });

    const fetchUser = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const response = await adminApi.getUserDetail(id);
            if (response.success) {
                setUser(response.data);
                setUserRole(response.data.role);
            }
        } catch (error) {
            console.error("Failed to fetch user detail:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading user profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserX className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-black text-gray-900 uppercase">User Not Found</h2>
                <p className="text-gray-500 max-w-xs">The user you are looking for does not exist or has been removed.</p>
                <Button onClick={() => navigate(ROUTES.ADMIN_USERS)} variant="outline">
                    Back to Users
                </Button>
            </div>
        );
    }

    const closeDialog = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

    const handleBanAction = () => {
        const isBanned = user.status === "BANNED";
        setConfirmConfig({
            isOpen: true,
            title: isBanned ? "Activate Account" : "Ban User Account",
            message: isBanned
                ? `Are you sure you want to unban ${user.username}? They will regain access to their account features.`
                : `Are you sure you want to ban ${user.username}? This will permanently revoke their access to all platform features.`,
            confirmText: isBanned ? "Confirm Activate" : "Apply Ban",
            variant: isBanned ? 'info' : 'danger',
            onConfirm: async () => {
                try {
                    const res = isBanned
                        ? await adminApi.unbanUser(user.id)
                        : await adminApi.banUser(user.id, "Violation of platform terms");

                    if (res.success) {
                        fetchUser();
                    }
                } catch (error) {
                }
                closeDialog();
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
                <Link to={ROUTES.ADMIN_USERS} className="text-gray-400 hover:text-orange-600 font-bold transition-colors">User Management</Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900 font-black uppercase tracking-tight">{user.username} (ID: #{user.id})</span>
            </div>

            {/* Profile Header Card */}
            <Card className="rounded-[2.5rem] p-8 border-none shadow-xl shadow-black/5 bg-white overflow-hidden relative group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                    <div className="flex gap-8 items-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-[#F6F7F8] overflow-hidden shadow-inner shrink-0 bg-gray-100">
                                <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                            </div>
                            <div className={cn(
                                "absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm",
                                user.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                            )} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-gray-900 leading-tight flex items-center gap-3">
                                {user.username}
                                <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-lg border border-orange-100 uppercase tracking-widest">ID: #{user.id}</span>
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 font-medium">
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-orange-400" /> Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full hidden md:block" />
                                <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-green-400" /> Last active: {formatTimeAgo(user.updatedAt)}</span>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <span className={cn(
                                    "text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border tracking-widest",
                                    user.role === "ADMIN" ? "bg-red-50 text-red-700 border-red-100" : "bg-gray-50 text-gray-700 border-gray-100"
                                )}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none border-none bg-gray-50 hover:bg-gray-100 text-gray-700 px-6 rounded-2xl h-11">
                            Message
                        </Button>
                        <Button color="orange" className="flex-1 md:flex-none px-6 rounded-2xl h-11 shadow-lg shadow-orange-500/10">
                            Edit Profile
                        </Button>
                    </div>
                </div>
                {/* Background Decoration */}
                <Shield className="absolute -top-10 -right-10 w-48 h-48 text-gray-50/50 -rotate-12 transition-transform group-hover:rotate-0" />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Account Controls */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] p-8 space-y-8 border-none shadow-xl shadow-black/5">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="p-2 bg-orange-100 rounded-xl text-orange-600">
                                <ShieldAlert className="w-4 h-4" />
                            </span>
                            Account Control & Access
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Role Selector */}
                            <div className="flex flex-col gap-3 p-5 rounded-3xl border border-gray-100">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned User Role</label>
                                <Dropdown
                                    items={roleItems}
                                    value={userRole}
                                    onChange={(newRole) => {
                                        setConfirmConfig({
                                            isOpen: true,
                                            title: "Change User Role",
                                            message: `Confirm changing ${user.username}'s role to ${roleItems.find(r => r.value === newRole)?.label}? This will update their permissions immediately.`,
                                            confirmText: "Update Role",
                                            variant: 'info',
                                            onConfirm: async () => {
                                                try {
                                                    const res = await adminApi.updateUserRole(user.id, newRole as AdminUserRole);
                                                    if (res.success) {
                                                        setUserRole(newRole);
                                                        fetchUser();
                                                    }
                                                } catch (error) {
                                                }
                                                closeDialog();
                                            }
                                        });
                                    }}
                                    className="w-full"
                                />
                            </div>

                            {/* Ban Section */}
                            <div className={cn(
                                "flex items-center justify-between p-6 rounded-3xl border transition-all mt-4",
                                user.status === "ACTIVE"
                                    ? "bg-red-50 border-red-100 text-red-600"
                                    : "bg-green-50 border-green-100 text-green-600"
                            )}>
                                <div className="space-y-1">
                                    <p className="text-sm font-black uppercase">{user.status === "ACTIVE" ? "Ban Account" : "Activate Account"}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-tight opacity-70">
                                        {user.status === "ACTIVE"
                                            ? "Permanently revoke access to all platform features"
                                            : "Restore user access and platform capabilities"}
                                    </p>
                                </div>
                                <Button
                                    onClick={handleBanAction}
                                    className={cn(
                                        "px-6 rounded-2xl h-10 shadow-lg font-black uppercase tracking-widest text-[10px]",
                                        user.status === "ACTIVE" ? "bg-red-600 hover:bg-red-700 shadow-red-600/10" : "bg-green-600 hover:bg-green-700 shadow-green-600/10"
                                    )}
                                    icon={user.status === "ACTIVE" ? <Gavel className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                >
                                    {user.status === "ACTIVE" ? "Apply Ban" : "Activate"}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Activity Log */}
                    <Card className="rounded-[2.5rem] p-0 overflow-hidden border-none shadow-xl shadow-black/5">
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                                <span className="p-2 bg-blue-100 rounded-xl text-blue-600">
                                    <History className="w-4 h-4" />
                                </span>
                                Recent Activity Log
                            </h3>
                            <button className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1.5">
                                <Download className="w-3.5 h-3.5" />
                                Download CSV
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#F6F7F8]/50 border-b border-gray-50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Details</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {user.recentActivities && user.recentActivities.length > 0 ? (
                                        user.recentActivities.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <span className="text-sm font-bold text-gray-900">{log.actionType}</span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className="text-sm text-gray-700 line-clamp-1">{log.metadata || "No details"}</span>
                                                </td>
                                                <td className="px-8 py-4 text-right text-xs font-bold text-gray-500">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-8 text-center text-gray-500 text-sm">
                                                No recent activity found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-gray-50/50 text-center">
                            <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors">
                                View Full History
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="rounded-[2.5rem] p-8 border-none shadow-xl shadow-black/5 h-full relative overflow-hidden">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3 mb-8">
                            <span className="p-2 bg-green-100 rounded-xl text-green-600">
                                <Activity className="w-4 h-4" />
                            </span>
                            User Insights
                        </h3>

                        <div className="space-y-8 relative z-10">
                            {[
                                // { label: "Total Posts", value: "1,248", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" }, // Stats not available in DTO yet
                                // { label: "Comments", value: "4,892", icon: MessageSquare, color: "text-green-500", bg: "bg-green-50" },
                                { label: "Manga Views", value: user.totalMangaViews?.toLocaleString() || "0", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
                                { label: "Manga Upvotes", value: user.totalMangaUpvotes?.toLocaleString() || "0", icon: Star, color: "text-orange-500", bg: "bg-orange-50" },
                                { label: "Translations", value: user.totalTranslations?.toLocaleString() || "0", icon: Shield, color: "text-purple-500", bg: "bg-purple-50" },
                                { label: "Trust Level", value: "High", icon: ShieldAlert, color: "text-green-500", bg: "bg-green-50" },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-5">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", stat.bg)}>
                                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-gray-900 leading-tight">{stat.value}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Background Decoration */}
                        <Star className="absolute -bottom-10 -right-10 w-40 h-40 text-gray-50/50 -rotate-12" />
                    </Card>
                </div>
            </div>

            <ConfirmDialog
                isOpen={confirmConfig.isOpen}
                onClose={closeDialog}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
                variant={confirmConfig.variant}
            />
        </div>
    );
};
