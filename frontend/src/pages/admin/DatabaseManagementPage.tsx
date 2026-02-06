import { useState } from "react";
import {
    Database,
    Search,
    Plus,
    Tv,
    Book,
    Edit3,
    Link as LinkIcon,
    ExternalLink,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Mock data for library
const mockLibrary = [
    { id: 1, title: "One Piece", type: "MANGA", status: "ONGOING", episodes: "1100+", chapters: "1110+", releaseYear: 1997, malId: 13 },
    { id: 2, title: "Frieren: Beyond Journey's End", type: "ANIME", status: "FINISHED", episodes: "28", chapters: null, releaseYear: 2023, malId: 52991 },
    { id: 3, title: "Solo Leveling", type: "ANIME", status: "ONGOING", episodes: "12", chapters: null, releaseYear: 2024, malId: 52299 },
    { id: 4, title: "Berserk", type: "MANGA", status: "ONGOING", episodes: null, chapters: "375", releaseYear: 1989, malId: 2 },
    { id: 5, title: "Jujutsu Kaisen", type: "ANIME", status: "FINISHED", episodes: "47", chapters: null, releaseYear: 2020, malId: 40748 },
];

const databaseTabs: TabItem[] = [
    { id: "ALL", label: "All" },
    { id: "ANIME", label: "Anime" },
    { id: "MANGA", label: "Manga" },
];

export const DatabaseManagementPage = () => {
    const [activeTab, setActiveTab] = useState("ALL");
    const [search, setSearch] = useState("");

    const filteredLibrary = mockLibrary.filter(item => {
        const matchesTab = activeTab === "ALL" || item.type === activeTab;
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">Database Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Curate and manage the central library of Anime and Manga titles.</p>
                </div>
                <Button
                    icon={<Plus className="w-4 h-4" />}
                    color="grey"
                    className="bg-gray-900 border-none hover:bg-black text-white px-6 rounded-2xl"
                >
                    Add New Title
                </Button>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row items-center gap-6">
                <Tabs
                    tabs={databaseTabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    variant="pill"
                    className="w-full md:w-auto overflow-x-auto"
                />

                <div className="flex-1 relative group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 rounded-2xl text-sm transition-all"
                    />
                </div>
            </div>

            {/* Library Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLibrary.map((item) => (
                    <LibraryCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

const LibraryCard = ({ item }: { item: typeof mockLibrary[0] }) => {
    return (
        <Card className="rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-black/5 transition-all group relative overflow-hidden">
            <div className="flex items-start justify-between mb-6">
                <div className={cn(
                    "p-3 rounded-2xl border",
                    item.type === "ANIME" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-orange-50 text-orange-600 border-orange-100"
                )}>
                    {item.type === "ANIME" ? <Tv className="w-5 h-5" /> : <Book className="w-5 h-5" />}
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-black text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 uppercase tracking-tight">
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.type}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            item.status === "ONGOING" ? "text-green-500" : "text-gray-400"
                        )}>{item.status}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Release</p>
                        <p className="text-xs font-bold text-gray-700">{item.releaseYear}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                            {item.type === "ANIME" ? "Episodes" : "Chapters"}
                        </p>
                        <p className="text-xs font-bold text-gray-700">{item.type === "ANIME" ? item.episodes : item.chapters}</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-dashed flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                            <LinkIcon className="w-3.5 h-3.5" />
                            MAL: {item.malId}
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Manage Content</span>
                        <ChevronRight className="w-3.5 h-3.5 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Background Decorative Icon */}
            <Database className="absolute -bottom-6 -right-6 w-24 h-24 text-gray-50 pointer-events-none group-hover:text-gray-100 transition-colors" />
        </Card>
    );
};
