import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Shield,
    ShieldAlert,
    UserX,
    Mail,
    Calendar,
    Activity,
    MessageSquare,
    FileText,
    History,
    MoreVertical,
    Lock,
    Unlock,
    Gavel,
    ExternalLink,
    Download,
    Star
} from "lucide-react";
import { mockUsers } from "@/data/admin";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Dropdown, type DropdownItem } from "@/components/ui/Dropdown";
import { ROUTES } from "@/constants/routes";
import { Colors } from "@/constants/colors";

// Expanded mock data for the user detail
const mockActivityLog = [
    { id: 1, action: "User Login", location: "Tokyo, JP", ip: "192.168.1.45", device: "Chrome / MacOS", timestamp: "Oct 24, 2023 - 14:22", status: "SUCCESS" },
    { id: 2, action: "Updated Translation: #4512", location: "Tokyo, JP", ip: "192.168.1.45", device: "Chrome / MacOS", timestamp: "Oct 24, 2023 - 11:05", status: "SAVED" },
    { id: 3, action: "Report Filed (Spam)", location: "Tokyo, JP", ip: "192.168.1.45", device: "Chrome / MacOS", timestamp: "Oct 23, 2023 - 22:40", status: "PENDING" },
    { id: 4, action: "Password Changed", location: "Tokyo, JP", ip: "192.168.1.45", device: "Mobile App / iOS", timestamp: "Oct 20, 2023 - 09:15", status: "VERIFIED" },
];

const roleItems: DropdownItem[] = [
    { label: "Standard Member", value: "USER" },
    { label: "Elite Translator", value: "TRANSLATOR" },
    { label: "Moderator", value: "MODERATOR" },
    { label: "System Administrator", value: "ADMIN" },
];

export const UserDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = mockUsers.find(u => u.id === id);

    const [isLocked, setIsLocked] = useState(false);
    const [userRole, setUserRole] = useState(user?.role || "USER");
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
        setConfirmConfig({
            isOpen: true,
            title: user.status === "ACTIVE" ? "Ban User Account" : "Unban User Account",
            message: user.status === "ACTIVE"
                ? `Are you sure you want to ban ${user.username}? This will permanently revoke their access to all platform features.`
                : `Are you sure you want to unban ${user.username}? They will regain access to their account features.`,
            confirmText: user.status === "ACTIVE" ? "Apply Ban" : "Confirm Unban",
            variant: user.status === "ACTIVE" ? 'danger' : 'info',
            onConfirm: () => {
                console.log("Ban/Unban action confirmed");
                closeDialog();
            }
        });
    };

    const handleLockToggle = () => {
        setConfirmConfig({
            isOpen: true,
            title: isLocked ? "Unlock Account" : "Lock Account",
            message: isLocked
                ? `Are you sure you want to unlock ${user.username}'s account? This will allow them to change their security settings.`
                : `Are you sure you want to lock ${user.username}'s account? This prevents the user from changing password or email.`,
            confirmText: isLocked ? "Unlock Now" : "Lock Account",
            variant: 'warning',
            onConfirm: () => {
                setIsLocked(!isLocked);
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
                                <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-green-400" /> Last active: 2 hours ago</span>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <span className="bg-yellow-50 text-yellow-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-yellow-100 tracking-widest">Top Translator</span>
                                <span className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-blue-100 tracking-widest">OG Member</span>
                                <span className="bg-purple-50 text-purple-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-purple-100 tracking-widest">Wiki Contributor</span>
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
                            {/* Account Lock Toggle */}
                            <div className="flex items-center justify-between p-5 rounded-3xl border border-gray-100 bg-[#F6F7F8]/50 hover:bg-[#F6F7F8] transition-colors">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-gray-900 uppercase">Account Locked</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Prevents user from changing security critical data</p>
                                </div>
                                <button
                                    onClick={handleLockToggle}
                                    className={cn(
                                        "w-14 h-7 rounded-full transition-all relative flex items-center p-1",
                                        isLocked ? "bg-orange-500" : "bg-gray-200"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 bg-white rounded-full shadow-lg transition-all flex items-center justify-center",
                                        isLocked ? "translate-x-7" : "translate-x-0"
                                    )}>
                                        {isLocked ? <Lock className="w-3 h-3 text-orange-500" /> : <Unlock className="w-3 h-3 text-gray-300" />}
                                    </div>
                                </button>
                            </div>

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
                                            onConfirm: () => {
                                                setUserRole(newRole);
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
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Location/IP</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {mockActivityLog.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">{log.action}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{log.device}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-700">{log.location}</span>
                                                    <span className="text-[10px] font-bold text-gray-400">{log.ip}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-xs font-bold text-gray-500">
                                                {log.timestamp}
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <span className={cn(
                                                    "px-2 py-1 text-[10px] font-black rounded-lg uppercase tracking-[0.1em]",
                                                    log.status === "SUCCESS" ? "bg-green-50 text-green-600" :
                                                        log.status === "SAVED" ? "bg-blue-50 text-blue-600" :
                                                            log.status === "PENDING" ? "bg-orange-50 text-orange-600" : "bg-purple-50 text-purple-600"
                                                )}>
                                                    {log.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-gray-50/50 text-center">
                            <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors">
                                Load Full History
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
                                { label: "Total Posts", value: "1,248", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
                                { label: "Comments", value: "4,892", icon: MessageSquare, color: "text-green-500", bg: "bg-green-50" },
                                { label: "Translations", value: "156", icon: Shield, color: "text-purple-500", bg: "bg-purple-50" },
                                { label: "Platform %tile", value: "98th", icon: Star, color: "text-orange-500", bg: "bg-orange-50" },
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

                            <div className="pt-8 border-t border-gray-50 mt-4 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Reputation</p>
                                        <p className="text-xs font-black text-orange-600">84%</p>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '84%' }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trust Level</p>
                                        <p className="text-xs font-black text-blue-600">High</p>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }} />
                                    </div>
                                </div>
                            </div>
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
