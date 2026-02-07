import { useState, useEffect, useCallback } from "react";
import {
    Users,
    Search,
    MoreVertical,
    Shield,
    UserX,
    History,
    CheckCircle2,
    XCircle,
    Mail,
    ExternalLink,
    Lock,
    Unlock,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Dropdown, type DropdownItem } from "@/components/ui/Dropdown";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ROUTES } from "@/constants/routes";
import { adminApi } from "@/lib/api/admin";
import type { AdminUserListItem, AdminUserRole } from "@/types/admin";
import { useDebounce } from "@/hooks/useDebounce";

const roleOptions: DropdownItem[] = [
    { label: "All Roles", value: "ALL" },
    { label: "Admins", value: "ADMIN" },
    { label: "Users", value: "USER" },
];

const statusOptions: DropdownItem[] = [
    { label: "All Status", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Banned", value: "BANNED" },
];

export const UserManagementPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [users, setUsers] = useState<AdminUserListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const role = roleFilter === "ALL" ? undefined : roleFilter as AdminUserRole;
            const status = statusFilter === "ALL" ? undefined : statusFilter;

            const response = await adminApi.getUsers({
                query: debouncedSearchQuery || undefined,
                role,
                status,
                page: currentPage,
                limit: pageSize
            });

            if (response.success) {
                setUsers(response.data.data);
                setTotalUsers(response.data.pagination.total);
                setTotalPages(response.data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchQuery, roleFilter, statusFilter, currentPage, pageSize]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Dialog state
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

    const closeDialog = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

    const handleAction = (type: 'ban' | 'unban' | 'lock' | 'unlock' | 'role', user: AdminUserListItem) => {
        let config: any = {
            isOpen: true,
            onConfirm: async () => {
                try {
                    let success = false;
                    switch (type) {
                        case 'ban':
                            const banRes = await adminApi.banUser(user.id, "Violation of community guidelines");
                            success = banRes.success;
                            break;
                        case 'unban':
                            const unbanRes = await adminApi.unbanUser(user.id);
                            success = unbanRes.success;
                            break;
                        case 'lock':
                            const lockRes = await adminApi.lockUser(user.id, true);
                            success = lockRes.success;
                            break;
                        case 'unlock':
                            const unlockRes = await adminApi.lockUser(user.id, false);
                            success = unlockRes.success;
                            break;
                    }
                    if (success) {
                        fetchUsers();
                    }
                } catch (error) {
                }
                closeDialog();
            }
        };

        switch (type) {
            case 'ban':
                config = {
                    ...config,
                    title: "Ban User",
                    message: `Are you sure you want to ban ${user.username}? This will permanently revoke their access to the platform.`,
                    confirmText: "Ban User",
                    variant: 'danger',
                };
                break;
            case 'unban':
                config = {
                    ...config,
                    title: "Unban User",
                    message: `Are you sure you want to unban ${user.username}? They will be able to access the platform again.`,
                    confirmText: "Unban User",
                    variant: 'info',
                };
                break;
            case 'lock':
                config = {
                    ...config,
                    title: "Lock User",
                    message: `Are you sure you want to lock ${user.username}? They will not be able to perform any actions until unlocked.`,
                    confirmText: "Lock User",
                    variant: 'warning',
                };
                break;
            case 'unlock':
                config = {
                    ...config,
                    title: "Unlock User",
                    message: `Are you sure you want to unlock ${user.username}?`,
                    confirmText: "Unlock User",
                    variant: 'info',
                };
                break;
            case 'role':
                // In a real app, this would open a role selection modal
                return;
        }

        setConfirmConfig(config);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">User Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Search, filter, and manage user accounts and permissions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-[#F6F7F8] rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500 border border-gray-100">
                        <Users className="w-4 h-4" />
                        Total: {totalUsers}
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-2 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 rounded-2xl text-sm transition-all"
                    />
                </div>

                <Dropdown
                    items={roleOptions}
                    value={roleFilter}
                    onChange={setRoleFilter}
                    className="w-full"
                />

                <Dropdown
                    items={statusOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    className="w-full"
                />
            </div>

            {/* Users Table */}
            <Card className="p-0 overflow-hidden shadow-xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">User</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Joined Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                                            <span className="text-sm font-medium">Loading users...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm font-medium">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Link to={ROUTES.ADMIN_USER_DETAIL(user.id)} className="relative shrink-0">
                                                    <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`} alt={user.username} className="w-10 h-10 rounded-full border border-gray-100 object-cover" />
                                                    <div className={cn(
                                                        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                                                        user.status === "ACTIVE" ? "bg-green-500" : user.status === "LOCKED" ? "bg-orange-500" : "bg-red-500"
                                                    )} />
                                                </Link>
                                                <div className="flex flex-col">
                                                    <Link to={ROUTES.ADMIN_USER_DETAIL(user.id)} className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors flex items-center gap-1.5">
                                                        {user.username}
                                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                                                    </Link>
                                                    <span className="text-[10px] text-gray-400 flex items-center gap-1 uppercase font-bold tracking-tight">
                                                        <Mail className="w-2.5 h-2.5" />
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.status === "ACTIVE" ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : user.status === "LOCKED" ? (
                                                    <Lock className="w-4 h-4 text-orange-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className={cn(
                                                    "text-xs font-bold uppercase tracking-wide",
                                                    user.status === "ACTIVE" ? "text-green-600" : user.status === "LOCKED" ? "text-orange-600" : "text-red-600"
                                                )}>
                                                    {user.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <ActionButton onClick={() => handleAction('role', user)} icon={Shield} title="Edit Role" color="blue" />
                                                <ActionButton
                                                    onClick={() => handleAction(user.isLocked ? 'unlock' : 'lock', user)}
                                                    icon={user.isLocked ? Unlock : Lock}
                                                    title={user.isLocked ? "Unlock User" : "Lock User"}
                                                    color={user.isLocked ? "green" : "orange"}
                                                />
                                                <ActionButton
                                                    onClick={() => handleAction(user.status === "BANNED" ? 'unban' : 'ban', user)}
                                                    icon={user.status === "BANNED" ? CheckCircle2 : UserX}
                                                    title={user.status === "BANNED" ? "Unban User" : "Ban User"}
                                                    color={user.status === "BANNED" ? "green" : "red"}
                                                />
                                                <ActionButton onClick={() => navigate(ROUTES.ADMIN_USER_DETAIL(user.id))} icon={History} title="View Details" color="gray" />
                                                <div className="w-[1px] h-4 bg-gray-100 mx-1"></div>
                                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="bg-gray-50/50 px-6 py-4 border-t flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-medium">
                            Showing <span className="font-bold text-gray-900">{users.length}</span> of <span className="font-bold text-gray-900">{totalUsers}</span> users
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={cn(
                                            "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                                            currentPage === i + 1
                                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </Card>

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

const RoleBadge = ({ role }: { role: string }) => {
    const variants: Record<string, { bg: string; text: string; icon: any }> = {
        ADMIN: { bg: "bg-red-50", text: "text-red-600", icon: Shield },
        USER: { bg: "bg-gray-50", text: "text-gray-500", icon: Users },
    };

    const { bg, text, icon: Icon } = variants[role] || variants.USER;

    return (
        <div className={cn("px-2.5 py-1 rounded-lg flex items-center gap-1.5 w-fit border border-current opacity-80", bg, text)}>
            <Icon className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">{role}</span>
        </div>
    );
};

const ActionButton = ({ icon: Icon, title, color, onClick }: { icon: any; title: string; color: string; onClick?: () => void }) => {
    const colorMap: Record<string, string> = {
        blue: "hover:bg-blue-50 hover:text-blue-600",
        orange: "hover:bg-orange-50 hover:text-orange-600",
        red: "hover:bg-red-50 hover:text-red-600",
        green: "hover:bg-green-50 hover:text-green-600",
        gray: "hover:bg-gray-100 hover:text-gray-600",
    };

    return (
        <button
            onClick={onClick}
            className={cn("p-2 text-gray-400 rounded-xl transition-all", colorMap[color])}
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
};
