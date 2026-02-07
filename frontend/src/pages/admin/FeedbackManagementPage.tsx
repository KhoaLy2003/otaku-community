import { useState, useEffect } from "react";
import {
    Search,
    CheckCircle,
    MessageSquare,
    Flag,
    RefreshCw,
    Clock,
    Mail,
    ArrowUpRight,
    AlertCircle,
    Bug,
    Sparkles,
    HandMetal,
    MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminApi } from "@/lib/api/admin";
import type { AdminFeedback, FeedbackStatus, FeedbackType } from "@/types/admin";
import { Card } from "@/components/ui/Card";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/ToastProvider";

const statusTabs: TabItem[] = [
    { id: "ALL", label: "All Feedbacks" },
    { id: "NEW", label: "New" },
    { id: "IN_PROGRESS", label: "In Progress" },
    { id: "WAITING_USER", label: "Waiting" },
    { id: "RESOLVED", label: "Resolved" },
    { id: "CLOSED", label: "Closed" },
];

const typeColors: Record<FeedbackType, { icon: any, color: string, bg: string }> = {
    REPORT: { icon: Flag, color: "text-red-600", bg: "bg-red-50" },
    BUG: { icon: Bug, color: "text-orange-600", bg: "bg-orange-50" },
    SUGGESTION: { icon: Sparkles, color: "text-blue-600", bg: "bg-blue-50" },
    FEATURE_REQUEST: { icon: HandMetal, color: "text-purple-600", bg: "bg-purple-50" },
    COMPLAINT: { icon: AlertCircle, color: "text-pink-600", bg: "bg-pink-50" },
    CONTACT: { icon: Mail, color: "text-green-600", bg: "bg-green-50" },
    OTHER: { icon: MessageSquare, color: "text-gray-600", bg: "bg-gray-50" },
};

export function FeedbackManagementPage() {
    const { showToast } = useToast();
    const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
            const status = statusFilter === "ALL" ? undefined : statusFilter as FeedbackStatus;
            const response = await adminApi.getFeedbacks(status, page, 10);
            setFeedbacks(response.data.data);
            setTotalElements(response.data.pagination.total);
        } catch (error) {
            console.error("Failed to fetch feedbacks:", error);
            showToast("Failed to load feedbacks", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, [statusFilter, page]);

    const handleResolve = async (id: string, status: FeedbackStatus) => {
        try {
            await adminApi.resolveFeedback(id, status, "Task completed via admin panel");
            showToast(`Feedback marked as ${status.toLowerCase()}`, "success");
            fetchFeedbacks();
        } catch (error) {
            showToast("Failed to update status", "error");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-tight uppercase tracking-tighter">Feedback Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Listen to your community and improve the platform.</p>
                </div>
                <button
                    onClick={fetchFeedbacks}
                    className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm group active:scale-95"
                >
                    <RefreshCw className={cn("w-5 h-5 text-gray-400 group-hover:text-orange-500", isLoading && "animate-spin")} />
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex-1 w-full relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by content, user, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-[1.5rem] focus:border-orange-500 outline-none transition-all shadow-sm"
                    />
                </div>
                <Tabs
                    tabs={statusTabs}
                    activeTab={statusFilter}
                    onChange={setStatusFilter}
                    variant="pill"
                    className="w-full lg:w-auto"
                />
            </div>

            {/* Content List */}
            <div className="space-y-4">
                {isLoading && feedbacks.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <RefreshCw className="w-10 h-10 text-orange-500 animate-spin" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fetching feedbacks...</p>
                    </div>
                ) : feedbacks.length === 0 ? (
                    <Card className="p-20 text-center rounded-[3rem] border-dashed border-2 border-gray-100 bg-gray-50/30">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide">All Caught Up!</h3>
                        <p className="text-gray-500 max-w-xs mx-auto text-sm">No pending feedback items match your filters.</p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {feedbacks.map((fb) => (
                            <FeedbackCard
                                key={fb.id}
                                feedback={fb}
                                onResolve={handleResolve}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination Placeholder */}
            {totalElements > 0 && (
                <div className="flex items-center justify-center pt-8 gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 bg-white border border-gray-100 rounded-xl disabled:opacity-50 text-sm font-bold"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-black text-gray-400">Page {page} of {Math.ceil(totalElements / 10)}</span>
                    <button
                        disabled={page * 10 >= totalElements}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 bg-white border border-gray-100 rounded-xl disabled:opacity-50 text-sm font-bold"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

function FeedbackCard({ feedback, onResolve }: { feedback: AdminFeedback, onResolve: (id: string, status: FeedbackStatus) => void }) {
    const typeInfo = typeColors[feedback.type] || typeColors.OTHER;
    const Icon = typeInfo.icon;

    return (
        <Card className="rounded-[2.5rem] p-6 lg:p-8 hover:shadow-2xl hover:shadow-black/5 transition-all group overflow-hidden relative border border-gray-50">
            <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                {/* Visual indicator side */}
                <div className="flex flex-row lg:flex-col items-center lg:items-center justify-between lg:justify-start gap-4 lg:w-20">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center relative", typeInfo.bg)}>
                        <Icon className={cn("w-7 h-7", typeInfo.color)} />
                        {feedback.status === "NEW" && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white rounded-full" />
                        )}
                    </div>
                    <div className="flex flex-col lg:items-center">
                        <p className={cn("text-[9px] font-black uppercase tracking-widest text-center", typeInfo.color)}>
                            {feedback.type}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">#{feedback.id.substring(0, 6)}</p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-1">
                            {feedback.title && (
                                <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                                    {feedback.title}
                                </h3>
                            )}
                            <p className="text-sm font-medium text-gray-600 leading-relaxed italic border-l-4 border-gray-100 pl-4 py-1 bg-gray-50/50 rounded-r-xl">
                                "{feedback.content}"
                            </p>
                        </div>
                        <div className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                            feedback.status === "NEW" ? "bg-orange-100 text-orange-600" :
                                feedback.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-600" :
                                    feedback.status === "RESOLVED" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                        )}>
                            {feedback.status.replace("_", " ")}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-gray-50">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Reporter</span>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-xs uppercase">
                                    {(feedback.reporterName || "A")[0]}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-gray-900">
                                        {feedback.isAnonymous ? "Anonymous User" : feedback.reporterName || "Unknown"}
                                    </span>
                                    {feedback.reporterEmail && !feedback.isAnonymous && (
                                        <span className="text-[10px] text-gray-400 font-medium">{feedback.reporterEmail}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Created At</span>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                                <Clock className="w-3.5 h-3.5 text-gray-300" />
                                {new Date(feedback.createdAt).toLocaleString()}
                            </div>
                        </div>

                        {feedback.priority && (
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Priority</span>
                                <div className={cn(
                                    "flex items-center gap-1.5 text-xs font-black uppercase tracking-widest",
                                    feedback.priority === "CRITICAL" ? "text-red-500" :
                                        feedback.priority === "HIGH" ? "text-orange-500" : "text-blue-500"
                                )}>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                    {feedback.priority}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Side Actions Area */}
                <div className="lg:w-48 flex md:flex-row lg:flex-col gap-2">
                    {feedback.status === "NEW" && (
                        <button
                            onClick={() => onResolve(feedback.id, "IN_PROGRESS")}
                            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                        >
                            Take Charge
                        </button>
                    )}
                    {(feedback.status === "NEW" || feedback.status === "IN_PROGRESS" || feedback.status === "WAITING_USER") && (
                        <button
                            onClick={() => onResolve(feedback.id, "RESOLVED")}
                            className="flex-1 px-4 py-3 bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                        >
                            Resolve
                        </button>
                    )}
                    {feedback.status !== "CLOSED" && (
                        <button
                            onClick={() => onResolve(feedback.id, "CLOSED")}
                            className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                        >
                            Close
                        </button>
                    )}
                    <button className="flex items-center justify-center p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </Card>
    );
}
