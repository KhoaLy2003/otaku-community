import React, { useState } from "react";
import {
    Search,
    BookOpen,
    UserPlus,
    MessageSquare,
    Shield,
    Settings,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    FileText,
    Database,
    Terminal,
    Mail,
    ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface HelpSection {
    id: string;
    title: string;
    icon: React.ElementType;
    content: React.ReactNode;
}

const HelpPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started"]);

    const toggleSection = (id: string) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const sections: HelpSection[] = [
        {
            id: "getting-started",
            title: "Getting Started",
            icon: UserPlus,
            content: (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Creating an Account</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Sign up using our supported authentication methods. Once registered, complete your profile to personalize your experience.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Navigating the Platform</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Use the sidebar to access Home, Anime, Manga, and your Profile. Features marked as "Coming Soon" are currently in development.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "posts-content",
            title: "Posts & Content",
            icon: FileText,
            content: (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Creating a Post</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Share your thoughts on anime and manga. You can link your posts to specific series to help others find your content through those series' detail pages.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Linked Data</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Linked anime/manga enriching your posts with official metadata. You can manage your references during post creation or editing.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "anime-manga-data",
            title: "Anime & Manga Data",
            icon: Database,
            content: (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Data Sources</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Our information is synced from trusted external providers. While we strive for accuracy, metadata updates may depend on source availability.
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            Notice incorrect data? You can report it through our feedback channels for manual review.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "chat-messaging",
            title: "Chat & Messaging",
            icon: MessageSquare,
            content: (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Private Chats</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            We support real-time one-to-one messaging. Current features include message search and cursor-based historical loading.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Safety First</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Maintain respectful communication. Use the block feature or report tool if you encounter harassment.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "troubleshooting",
            title: "Troubleshooting",
            icon: HelpCircle,
            content: (
                <div className="space-y-4 text-sm">
                    <div className="border-l-2 border-orange-200 pl-4 py-1">
                        <p className="font-bold text-gray-900 dark:text-white">"Page Not Found" or "Coming Soon"</p>
                        <p className="text-gray-500">This usually means the feature is still under development. Check back soon!</p>
                    </div>
                    <div className="border-l-2 border-orange-200 pl-4 py-1">
                        <p className="font-bold text-gray-900 dark:text-white">Content doesn't load</p>
                        <p className="text-gray-500">Check your internet connection or try refreshing the page. Clear your cache if issues persist.</p>
                    </div>
                </div>
            )
        },
        {
            id: "contributors",
            title: "For Contributors",
            icon: Terminal,
            content: (
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        Interested in helping build the Otaku Community? We follow a modular domain-oriented architecture and welcome technical contributions.
                    </p>
                    <button className="text-orange-600 hover:text-orange-700 font-bold text-sm flex items-center gap-2">
                        View Developer Documentation <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const filteredSections = sections.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white">How can we help you?</h1>
                <p className="text-gray-500 dark:text-gray-400">Find guidance on features and platform usage.</p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative group mt-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search help articles..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:border-orange-500 outline-none transition-all shadow-sm group-hover:shadow-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Sections Grid */}
            <div className="grid gap-6">
                {filteredSections.map((section) => {
                    const isExpanded = expandedSections.includes(section.id);
                    const Icon = section.icon;

                    return (
                        <div key={section.id} className="overflow-hidden">
                            <button
                                onClick={() => toggleSection(section.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-6 bg-white dark:bg-gray-800 border-2 transition-all rounded-2xl text-left",
                                    isExpanded ? "border-orange-500 shadow-md" : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                        isExpanded ? "bg-orange-100 text-orange-600" : "bg-gray-50 dark:bg-gray-700 text-gray-500"
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white">{section.title}</span>
                                </div>
                                {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </button>

                            <div className={cn(
                                "transition-all duration-300 ease-in-out",
                                isExpanded ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0 overflow-hidden"
                            )}>
                                <div className="p-8 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                                    {section.content}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredSections.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                        <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No matching help topics found for "{searchQuery}"</p>
                    </div>
                )}
            </div>

            {/* Quick Contact Footer */}
            <section className="bg-orange-600 rounded-[2rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-orange-600/20">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Still need help?</h2>
                    <p className="text-orange-100 opacity-90">Our team is here to support your experience.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Contact Support
                    </button>
                </div>
            </section>

            {/* Footer Meta */}
            <footer className="text-center py-8">
                <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">
                    Otaku Community • Last Updated January 2026
                </p>
            </footer>
        </div>
    );
};

export default HelpPage;
