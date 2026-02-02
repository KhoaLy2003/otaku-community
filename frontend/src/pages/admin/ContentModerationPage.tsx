import { useState } from "react";
import {
    ShieldAlert,
    Search,
    CheckCircle,
    XSquare,
    UserMinus,
    MessageSquare,
    Image as ImageIcon,
    Flag,
    MoreHorizontal,
    FileText
} from "lucide-react";
import { mockReports } from "@/data/admin";
import { cn } from "@/lib/utils";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";

const contentTabs: TabItem[] = [
    { id: "ALL", label: "All" },
    { id: "POST", label: "Posts" },
    { id: "COMMENT", label: "Comments" },
    { id: "TRANSLATION", label: "Translations" },
];

export const ContentModerationPage = () => {
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    const filteredReports = mockReports.filter(report => {
        const matchesFilter = filter === "ALL" || report.contentType === filter;
        const matchesSearch = report.contentSnippet.toLowerCase().includes(search.toLowerCase()) ||
            report.author.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">Content Moderation</h1>
                    <p className="text-gray-500 text-sm mt-1">Review reported content and maintain community guidelines.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl flex items-center gap-2 text-xs font-bold border border-orange-100">
                        <Flag className="w-4 h-4" />
                        Pending: {mockReports.filter(r => r.status === "PENDING").length}
                    </div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 relative group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search keywords, authors..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 rounded-2xl text-sm transition-all shadow-sm shadow-black/5"
                    />
                </div>

                <Tabs
                    tabs={contentTabs}
                    activeTab={filter}
                    onChange={setFilter}
                    variant="pill"
                    className="w-full md:w-auto overflow-x-auto"
                />
            </div>

            {/* Report List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredReports.length === 0 ? (
                    <Card className="rounded-[2rem] p-20 text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-wide">Clean Queue!</h3>
                        <p className="text-gray-500 max-w-xs mx-auto text-sm">Great job keeping the community safe. No pending reports to review currently.</p>
                    </Card>
                ) : (
                    filteredReports.map((report) => (
                        <ReportCard key={report.id} report={report} />
                    ))
                )}
            </div>
        </div>
    );
};

const ReportCard = ({ report }: { report: typeof mockReports[0] }) => {
    return (
        <Card className="rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-black/5 transition-all group border-l-4 border-l-orange-500">
            {/* Content Meta */}
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "p-1.5 rounded-lg",
                            report.contentType === "POST" ? "bg-blue-50 text-blue-600" :
                                report.contentType === "COMMENT" ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"
                        )}>
                            {report.contentType === "POST" ? <FileText className="w-4 h-4" /> :
                                report.contentType === "COMMENT" ? <MessageSquare className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {report.contentType} Report • ID: {report.id}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold bg-red-50 text-red-600 px-2 py-1 rounded-lg uppercase tracking-wider">
                        <Flag className="w-2.5 h-2.5" />
                        {report.reason}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl relative">
                    <p className="text-sm font-medium text-gray-700 leading-relaxed indent-4 italic">
                        "{report.contentSnippet}"
                    </p>
                    <div className="absolute top-0 left-0 -translate-x-1 -translate-y-1 text-gray-200">
                        <MessageSquare className="w-8 h-8 fill-current" />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Author</span>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold uppercase">{report.author[0]}</div>
                                <span className="text-xs font-black text-gray-900">@{report.author}</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Reported by</span>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-[10px] font-bold uppercase">{report.reportedBy[0]}</div>
                                <span className="text-xs font-black text-gray-900">@{report.reportedBy}</span>
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-6 min-w-[160px]">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-green-500/10 transition-all">
                    <CheckCircle className="w-4 h-4" />
                    Keep
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/10 transition-all">
                    <XSquare className="w-4 h-4" />
                    Delete
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-black/10 transition-all">
                    <UserMinus className="w-4 h-4" />
                    Ban
                </button>
                <button className="flex items-center justify-center p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
        </Card>
    );
};
