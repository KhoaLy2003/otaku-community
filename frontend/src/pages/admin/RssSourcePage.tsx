import { useState, useEffect } from "react";
import {
    Rss,
    Plus,
    RefreshCw,
    Edit2,
    Play,
    CheckCircle2,
    XCircle,
    Globe,
    AlertCircle,
    Loader2,
    Power
} from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { adminApi } from "@/lib/api/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Dropdown } from "@/components/ui/Dropdown";
import type { RssSource, CreateRssSourceRequest } from "@/types/admin";

export const RssSourcePage = () => {
    const [sources, setSources] = useState<RssSource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [syncingIds, setSyncingIds] = useState<string[]>([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSource, setEditingSource] = useState<RssSource | null>(null);
    const [formData, setFormData] = useState<CreateRssSourceRequest>({
        name: "",
        url: "",
        priority: 5,
        enabled: true
    });
    const [formError, setFormError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Confirm Dialog State
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

    const fetchSources = async () => {
        setIsLoading(true);
        try {
            const response = await adminApi.getRssSources();
            if (response.success) {
                setSources(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch RSS sources:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSources();
    }, []);

    const handleSync = async (id: string) => {
        setSyncingIds(prev => [...prev, id]);
        try {
            await adminApi.syncRssSource(id);
            setTimeout(fetchSources, 2000);
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setTimeout(() => {
                setSyncingIds(prev => prev.filter(sid => sid !== id));
            }, 1000);
        }
    };

    const handleToggleStatus = async (source: RssSource) => {
        const newStatus = !source.enabled;
        const action = newStatus ? "enable" : "disable";

        try {
            await adminApi.updateRssSource(source.id, { enabled: newStatus });
            fetchSources();
        } catch (error) {
            console.error(`Failed to ${action} source:`, error);
        }
    };

    const openEditModal = (source: RssSource) => {
        setEditingSource(source);
        setFormData({
            name: source.name,
            url: source.url,
            priority: source.priority,
            enabled: source.enabled
        });
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingSource(null);
        setFormData({
            name: "",
            url: "",
            priority: 5,
            enabled: true
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        setIsSaving(true);
        try {
            if (!formData.name || !formData.url) {
                throw new Error("Name and URL are required.");
            }

            if (editingSource) {
                await adminApi.updateRssSource(editingSource.id, formData);
            } else {
                await adminApi.createRssSource(formData);
            }
            setIsModalOpen(false);
            fetchSources();
        } catch (error: any) {
            setFormError(error.message || "Failed to save source.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-tight flex items-center gap-2">
                        <Rss className="w-6 h-6 text-orange-500" />
                        RSS Sources
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and monitor external news feeds.</p>
                </div>
                <Button
                    onClick={openCreateModal}
                    className="shadow-xl shadow-orange-500/20 px-6 rounded-2xl h-11"
                    color="orange"
                    icon={<Plus className="w-4 h-4" />}
                >
                    Add Source
                </Button>
            </div>

            {/* Content */}
            <Card className="p-0 overflow-hidden shadow-xl shadow-black/5 bg-white border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Source Name</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">URL</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Priority</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Last Sync</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                                            <span className="text-sm font-medium">Loading sources...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : sources.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm font-medium">
                                        No RSS sources configured.
                                    </td>
                                </tr>
                            ) : (
                                sources.map((source) => (
                                    <tr key={source.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                                    <Rss className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{source.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-orange-600 transition-colors max-w-[200px] truncate">
                                                <Globe className="w-3 h-3" />
                                                {source.url}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                                                {source.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {source.enabled ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-100">
                                                    <CheckCircle2 className="w-3 h-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest border border-gray-200">
                                                    <XCircle className="w-3 h-3" /> Disabled
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-700">
                                                    {source.lastSyncAt ? timeAgo(source.lastSyncAt) : "Never"}
                                                </span>
                                                {source.lastSyncStatus && (
                                                    <span className={cn(
                                                        "text-[10px] font-medium truncate max-w-[150px]",
                                                        source.lastSyncStatus.startsWith("FAILED") ? "text-red-500" : "text-green-500"
                                                    )}>
                                                        {source.lastSyncStatus}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleSync(source.id)}
                                                    disabled={syncingIds.includes(source.id)}
                                                    className={cn(
                                                        "p-2 rounded-xl transition-all hover:bg-blue-50 hover:text-blue-600 text-gray-400",
                                                        syncingIds.includes(source.id) && "animate-spin text-blue-500"
                                                    )}
                                                    title="Sync Now"
                                                >
                                                    {syncingIds.includes(source.id) ? <RefreshCw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(source)}
                                                    className="p-2 rounded-xl transition-all hover:bg-gray-100 hover:text-gray-900 text-gray-400"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(source)}
                                                    className={cn(
                                                        "p-2 rounded-xl transition-all",
                                                        source.enabled
                                                            ? "hover:bg-red-50 hover:text-red-600 text-gray-400"
                                                            : "hover:bg-green-50 hover:text-green-600 text-gray-400"
                                                    )}
                                                    title={source.enabled ? "Disable" : "Enable"}
                                                >
                                                    <Power className={cn("w-4 h-4", !source.enabled && "text-red-500")} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md p-6 rounded-[2rem] shadow-2xl relative bg-white">
                        <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                            {editingSource ? <Edit2 className="w-5 h-5 text-orange-500" /> : <Plus className="w-5 h-5 text-orange-500" />}
                            {editingSource ? "Edit RSS Source" : "Add New Source"}
                        </h2>

                        {formError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Source Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 rounded-xl text-sm font-medium transition-all"
                                    placeholder="e.g. Anime News Network"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">RSS Feed URL</label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 rounded-xl text-sm font-medium transition-all"
                                    placeholder="https://example.com/feed.xml"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Priority (1-10)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 rounded-xl text-sm font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                                    <Dropdown
                                        items={[
                                            { label: "Active", value: "active" },
                                            { label: "Disabled", value: "disabled" }
                                        ]}
                                        value={formData.enabled ? "active" : "disabled"}
                                        onChange={(val) => setFormData({ ...formData, enabled: val === "active" })}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    color="orange"
                                    className="rounded-xl px-6"
                                    disabled={isSaving}
                                    icon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            <ConfirmDialog
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
                variant={confirmConfig.variant}
            />
        </div>
    );
};
