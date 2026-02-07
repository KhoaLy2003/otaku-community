import React, { useState } from "react";
import {
    MessageSquare,
    Bug,
    Sparkles,
    HandMetal,
    Flag,
    HelpCircle,
    Info,
    Send,
    CheckCircle2,
    ShieldCheck,
    Mail,
    User
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { feedbackApi, type FeedbackRequest } from "@/lib/api/feedback";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/ToastProvider";
import type { FeedbackType } from "@/types/admin";

interface FeedbackOption {
    type: FeedbackType;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

const FEEDBACK_OPTIONS: FeedbackOption[] = [
    {
        type: "SUGGESTION",
        label: "Suggestion",
        description: "Have an idea to make the community better?",
        icon: Sparkles,
        color: "text-blue-500 bg-blue-50 border-blue-100"
    },
    {
        type: "BUG",
        label: "Bug Report",
        description: "Something not working correctly?",
        icon: Bug,
        color: "text-red-500 bg-red-50 border-red-100"
    },
    {
        type: "FEATURE_REQUEST",
        label: "Feature",
        description: "Missing something you'd love to see?",
        icon: HandMetal,
        color: "text-purple-500 bg-purple-50 border-purple-100"
    },
    {
        type: "REPORT",
        label: "Report",
        description: "Found content that violates guidelines?",
        icon: Flag,
        color: "text-orange-500 bg-orange-50 border-orange-100"
    },
    {
        type: "CONTACT",
        label: "Contact",
        description: "General inquiry or support request.",
        icon: Mail,
        color: "text-green-500 bg-green-50 border-green-100"
    },
    {
        type: "OTHER",
        label: "Other",
        description: "Anything else on your mind?",
        icon: MessageSquare,
        color: "text-gray-500 bg-gray-50 border-gray-100"
    }
];

const FeedbackPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedType, setSelectedType] = useState<FeedbackType>("SUGGESTION");

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        reporterName: user?.username || "",
        reporterEmail: user?.email || "",
        isAnonymous: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.content.trim()) {
            showToast("Please provide your feedback content.", "error");
            return;
        }

        setIsLoading(true);
        try {
            const request: FeedbackRequest = {
                type: selectedType,
                title: formData.title,
                content: formData.content,
                reporterName: formData.isAnonymous ? undefined : formData.reporterName,
                reporterEmail: formData.isAnonymous ? undefined : formData.reporterEmail,
                anonymous: formData.isAnonymous
            };

            await feedbackApi.submit(request);
            setIsSubmitted(true);
            showToast("Feedback submitted successfully!", "success");
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            showToast("Failed to submit feedback. Please try again later.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100/50">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Got it!</h1>
                    <p className="text-xl text-gray-500 font-medium">
                        Thank you for your feedback. We appreciate your contribution to making Otaku Community better.
                    </p>
                </div>
                <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg shadow-black/10 uppercase tracking-widest text-sm"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20 animate-in fade-in duration-700">
            <div className="grid lg:grid-cols-5 gap-12">
                {/* Left Side: Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs font-black uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" />
                            Community Driven
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 leading-[1.1] uppercase tracking-tighter">
                            Shape the <span className="text-orange-500">Future</span> of Otaku Community
                        </h1>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                            Your feedback is the heart of our development. Whether it's a bug report or a wild new idea, we're listening.
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <div className="flex gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900 uppercase text-sm tracking-wide">Privacy First</h3>
                                <p className="text-sm text-gray-500">Reports can be submitted anonymously. Your data is handled with care.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                                <HelpCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900 uppercase text-sm tracking-wide">Fast Review</h3>
                                <p className="text-sm text-gray-500">Our moderators review feedback daily to ensure the platform stays healthy.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-xl font-bold italic">"Alone we are fans, together we are a community."</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-black text-sm">OC</div>
                                <div>
                                    <p className="text-sm font-bold">The Development Team</p>
                                    <p className="text-xs text-gray-400">Otaku Community Project</p>
                                </div>
                            </div>
                        </div>
                        <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:col-span-3">
                    <Card className="rounded-[3rem] p-1 shadow-2xl shadow-orange-500/5 bg-white border-2 border-orange-100/50">
                        <div className="p-10 space-y-10">
                            {/* Type Selector */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Select Feedback Type</h3>
                                    <Info className="w-4 h-4 text-gray-300" />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {FEEDBACK_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.type}
                                            onClick={() => setSelectedType(opt.type)}
                                            className={cn(
                                                "flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all group",
                                                selectedType === opt.type
                                                    ? "border-orange-500 bg-orange-50/30 shadow-lg shadow-orange-500/10"
                                                    : "border-gray-50 bg-white hover:border-gray-200"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                                opt.color,
                                                selectedType === opt.type && "scale-110 shadow-sm"
                                            )}>
                                                <opt.icon className="w-6 h-6" />
                                            </div>
                                            <div className="text-center">
                                                <p className={cn(
                                                    "text-[10px] font-black uppercase tracking-wider mb-0.5",
                                                    selectedType === opt.type ? "text-orange-600" : "text-gray-900"
                                                )}>{opt.label}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 absolute left-5 -top-2 bg-white px-2">Title (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="What's this about?"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-orange-500 outline-none transition-all placeholder:text-gray-300 font-bold"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 absolute left-5 -top-2 bg-white px-2">Message Content</label>
                                        <textarea
                                            placeholder="Share your thoughts with us..."
                                            rows={6}
                                            required
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-orange-500 outline-none transition-all placeholder:text-gray-300 font-medium resize-none"
                                        />
                                    </div>

                                    {!isAuthenticated && !formData.isAnonymous && (
                                        <div className="grid sm:grid-cols-2 gap-4">

                                            {/* NAME */}
                                            <div className="relative group pt-3">
                                                <label className="absolute left-5 top-0 z-10 bg-gray-50 px-2 text-[10px] font-black uppercase tracking-widest text-gray-400 pointer-events-none">
                                                    Your Name
                                                </label>

                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                                                    <input
                                                        type="text"
                                                        placeholder="Name"
                                                        value={formData.reporterName}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, reporterName: e.target.value })
                                                        }
                                                        className="w-full pl-11 pr-4 pt-5 pb-3 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* EMAIL */}
                                            <div className="relative group pt-3">
                                                <label className="absolute left-5 top-0 z-10 bg-gray-50 px-2 text-[10px] font-black uppercase tracking-widest text-gray-400 pointer-events-none">
                                                    Your Email
                                                </label>

                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                                                    <input
                                                        type="email"
                                                        placeholder="Email address"
                                                        value={formData.reporterEmail}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, reporterEmail: e.target.value })
                                                        }
                                                        className="w-full pl-11 pr-4 pt-5 pb-3 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}>
                                        <div className={cn(
                                            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                            formData.isAnonymous ? "bg-orange-500 border-orange-500" : "border-gray-200 group-hover:border-orange-200"
                                        )}>
                                            {formData.isAnonymous && <ShieldCheck className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className="text-sm font-bold text-gray-600">Submit anonymously</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={cn(
                                        "w-full py-5 bg-gray-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-black/10 hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-[0.98]",
                                        isLoading && "opacity-70 cursor-not-allowed"
                                    )}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Push Feedback
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
