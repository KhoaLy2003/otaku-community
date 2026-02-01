import {
    Users,
    FileText,
    AlertTriangle,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    ShieldAlert
} from "lucide-react";
import { mockAdminStats } from "@/data/admin";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Dropdown, type DropdownItem } from "@/components/ui/Dropdown";
import { useState } from "react";

const chartPeriods: DropdownItem[] = [
    { label: "Last 30 Days", value: "30D" },
    { label: "Last 7 Days", value: "7D" },
    { label: "Last 24 Hours", value: "24H" },
];

export const AdminDashboardPage = () => {
    const [period, setPeriod] = useState("30D");

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">Dashboard Overview</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back, Admin. Here's what's happening on the platform today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={mockAdminStats.totalUsers.toLocaleString()}
                    change="+12% from last month"
                    trend="up"
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Active Posts"
                    value={mockAdminStats.activePosts.toLocaleString()}
                    change="+5% from last month"
                    trend="up"
                    icon={FileText}
                    color="orange"
                />
                <StatCard
                    title="Pending Reports"
                    value={mockAdminStats.pendingReports.toString()}
                    change="-2 from yesterday"
                    trend="down"
                    icon={AlertTriangle}
                    color="red"
                    isUrgent={mockAdminStats.pendingReports > 5}
                />
                <StatCard
                    title="System Health"
                    value="99.9%"
                    change="All systems normal"
                    trend="up"
                    icon={ShieldAlert}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth/Activity Chart Placeholder */}
                <Card className="lg:col-span-2 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Historical Data</p>
                        </div>
                        <Dropdown
                            items={chartPeriods}
                            value={period}
                            onChange={setPeriod}
                            className="min-w-[160px]"
                        />
                    </div>

                    <div className="h-[300px] flex items-end gap-2 px-2">
                        {[40, 65, 45, 90, 55, 75, 50, 85, 95, 60, 40, 70, 80, 50, 60].map((height, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-orange-100 hover:bg-orange-500 rounded-t-lg transition-all duration-300 relative group/bar"
                                style={{ height: `${height}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                    +{height} Users
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute top-0 right-0 p-8">
                        <TrendingUp className="w-24 h-24 text-gray-50/50 -rotate-12 transform" />
                    </div>
                </Card>

                {/* Action Quick Links */}
                <div className="space-y-6">
                    <Card className="rounded-3xl p-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 rounded-2xl transition-all text-sm font-bold border border-transparent hover:border-orange-100">
                                <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-4 h-4" />
                                </div>
                                Review Translations ({mockAdminStats.pendingTranslations})
                            </button>
                            <button className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-2xl transition-all text-sm font-bold border border-transparent hover:border-red-100">
                                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                Handle Reports ({mockAdminStats.pendingReports})
                            </button>
                            <button className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-2xl transition-all text-sm font-bold border border-transparent hover:border-blue-100">
                                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-4 h-4" />
                                </div>
                                Approve Translators
                            </button>
                        </div>
                    </Card>

                    {/* Platform Status */}
                    <div className="bg-gray-900 rounded-3xl p-6 text-white overflow-hidden relative border border-gray-800">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-70">Platform Status</h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">Server Status</span>
                                <div className="flex items-center gap-1.5 font-bold text-xs text-green-400">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    Operational
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">API Latency</span>
                                <span className="text-xs font-bold">42ms</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">DB Connection</span>
                                <span className="text-xs font-bold text-green-400">Stable</span>
                            </div>
                        </div>
                        <Clock className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: React.ComponentType<{ className?: string }>;
    color: "blue" | "orange" | "red" | "green";
    isUrgent?: boolean;
}

const StatCard = ({ title, value, change, trend, icon: Icon, color, isUrgent }: StatCardProps) => {
    const colorMap = {
        blue: "text-blue-600 bg-blue-50 border-blue-100/50",
        orange: "text-orange-600 bg-orange-50 border-orange-100/50",
        red: "text-red-600 bg-red-50 border-red-100/50",
        green: "text-green-600 bg-green-50 border-green-100/50",
    };

    return (
        <div className={cn(
            "p-6 rounded-[2rem] border bg-white transition-all hover:shadow-xl hover:shadow-black/5 group",
            isUrgent && "border-red-200 ring-4 ring-red-500/5"
        )}>
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-2xl border transition-colors", colorMap[color])}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={cn(
                    "flex items-center text-[10px] font-black uppercase tracking-wider",
                    trend === "up" ? "text-green-500" : "text-red-500"
                )}>
                    {trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                    {change.replace(/ .*/, '')}
                </div>
            </div>
            <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{title}</p>
                <h4 className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors uppercase">{value}</h4>
                <p className="text-[10px] text-gray-500 font-medium mt-1 truncate">{change}</p>
            </div>
        </div>
    );
};
