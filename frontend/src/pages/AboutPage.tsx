import React from "react";
import {
    Users,
    Target,
    Layers,
    Code,
    Cpu,
    Heart,
    FileText,
    Link as LinkIcon,
    MessageSquare,
    ShieldCheck,
    Activity,
    Github
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useNavigate } from "react-router-dom";

const AboutPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-20">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold tracking-wide uppercase">
                    <Heart className="w-4 h-4 fill-current" />
                    The Ultimate Otaku Hub
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight">
                    Celebrate Anime & Manga <br />
                    <span className="text-orange-600">Culture Together</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    Otaku Community is a community-driven platform designed for enthusiasts to share, discuss, and connect through the works they love most.
                </p>
            </section>

            {/* Vision & Principles */}
            <div className="grid md:grid-cols-2 gap-8">
                <Card
                    className="p-8 border-none bg-orange-600 shadow-xl shadow-orange-600/20"
                    style={{ backgroundColor: '#ea580c' }} // Explicitly override Card's default white background
                >
                    <div className="text-white">
                        <Target className="w-12 h-12 mb-6 opacity-80" />
                        <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                        <p className="text-orange-50 leading-relaxed text-lg">
                            To become a trusted and engaging hub where otaku culture thrives through
                            high-quality discussions, accurate anime/manga information, and strong
                            community interactions.
                        </p>
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: Users, title: "Community First", desc: "Built for healthy interaction" },
                        { icon: LinkIcon, title: "Contextual Content", desc: "Linked to real anime data" },
                        { icon: Cpu, title: "Scalable Tech", desc: "Built for long-term growth" },
                        { icon: ShieldCheck, title: "Clean Design", desc: "Maintainable & modern" },
                    ].map((principle, idx) => (
                        <Card key={idx} className="p-6 flex flex-col justify-center items-center text-center hover:border-orange-200 transition-colors">
                            <principle.icon className="w-8 h-8 text-orange-600 mb-3" />
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{principle.title}</h3>
                            <p className="text-sm text-gray-500">{principle.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Key Features Section */}
            <section className="space-y-12">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Core Platform Features</h2>
                    <div className="h-1.5 w-24 bg-orange-600 mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: FileText,
                            title: "Rich Content & Posts",
                            features: [
                                "Share related discussions",
                                "Rich text & media support",
                                "Structured references"
                            ]
                        },
                        {
                            icon: Layers,
                            title: "Anime/Manga Integration",
                            features: [
                                "Synced with external sources",
                                "Deep meta-data linking",
                                "Enhanced discovery tools"
                            ]
                        },
                        {
                            icon: MessageSquare,
                            title: "Real-time Interaction",
                            features: [
                                "One-to-one private chat",
                                "Secure message handling",
                                "Cursor-based pagination"
                            ]
                        }
                    ].map((feature, idx) => (
                        <Card key={idx} className="p-8 hover:shadow-lg transition-shadow border-gray-100 dark:border-gray-800">
                            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mb-6">
                                <feature.icon className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 dark:text-white">{feature.title}</h3>
                            <ul className="space-y-3">
                                {feature.features.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Tech Architecture */}
            <section className="bg-gray-900 dark:bg-black p-12 rounded-[3rem] text-white">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black">Modern Architecture</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            We leverage a domain-oriented modular backend and a highly responsive SPA frontend to ensure the best performance and maintainability.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {["Spring Boot 3", "React 18", "PostgreSQL", "Auth0", "Tailwind CSS"].map((tech) => (
                                <span key={tech} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <Code className="w-8 h-8 text-orange-400 mb-4" />
                            <div className="text-2xl font-bold mb-1">Domain-Driven</div>
                            <div className="text-gray-500 text-sm">Clean modular design</div>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <Activity className="w-8 h-8 text-orange-400 mb-4" />
                            <div className="text-2xl font-bold mb-1">Deep Logging</div>
                            <div className="text-gray-500 text-sm">System & activity tracking</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Current Status & Call to Action */}
            <section className="text-center bg-orange-50 dark:bg-orange-900/10 p-12 rounded-[3rem] border border-orange-100 dark:border-orange-900/30">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Project Status</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                    Currently in **Active Development (MVP)**. We are focusing on core posting, anime integration, and foundational infrastructure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* <a
                        href="https://github.com/KhoaLy2003/otaku-community"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                    >
                        <Github className="w-5 h-5" />
                        Check Github
                    </a> */}
                    <button
                        className="px-8 py-4 border-2 border-orange-200 dark:border-gray-700 text-orange-600 dark:text-orange-400 font-bold rounded-2xl hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all"
                        onClick={() => navigate('/signup')}
                    >
                        Join the Community
                    </button>
                </div>
            </section>

            {/* Closing Note */}
            <footer className="text-center pt-8 border-t border-gray-100 dark:border-gray-800">
                <p className="italic text-gray-500 dark:text-gray-400">
                    Otaku Community Project: Where content, data, and community come together.
                </p>
            </footer>
        </div>
    );
};

export default AboutPage;
