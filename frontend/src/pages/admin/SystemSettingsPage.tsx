import { useState, useEffect } from "react";
import {
    Settings,
    Save,
    ShieldCheck,
    UserPlus,
    MessageSquare,
    Upload,
    Bell,
    RotateCcw,
    Zap,
    Globe,
    Lock,
    Eye,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { adminApi } from "@/lib/api/admin";
import type { SystemSettings } from "@/types/admin";

export const SystemSettingsPage = () => {
    const [settings, setSettings] = useState<SystemSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await adminApi.getSystemSettings();
                setSettings(response.data);
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        try {
            await adminApi.updateSystemSettings(settings);
        } catch (error) {
            console.error("Failed to update settings:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Settings...</p>
            </div>
        );
    }

    if (!settings) return null;

    const toggleMaintenance = () => setSettings(prev => prev ? ({ ...prev, maintenanceMode: !prev.maintenanceMode }) : null);
    const toggleRegistrations = () => setSettings(prev => prev ? ({ ...prev, allowRegistrations: !prev.allowRegistrations }) : null);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">System Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Configure global platform behavior, limits, and site-wide announcements.</p>
                </div>
                <Button
                    icon={<Save className="w-4 h-4" />}
                    color="orange"
                    className="shadow-xl shadow-orange-500/20 px-6 rounded-2xl h-12"
                    onClick={handleSave}
                >
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Feature Flags */}
                <div className="space-y-6">
                    <Card className="rounded-[2rem] p-8 space-y-6 shadow-xl shadow-black/5">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4 text-orange-500" />
                            Feature Flags
                        </h3>

                        <div className="space-y-4">
                            <SettingToggle
                                label="Maintenance Mode"
                                description="Take the entire platform offline for updates."
                                enabled={settings.maintenanceMode}
                                onToggle={toggleMaintenance}
                                icon={Lock}
                            />
                            <SettingToggle
                                label="New Registrations"
                                description="Allow or block new users from signing up."
                                enabled={settings.allowRegistrations}
                                onToggle={toggleRegistrations}
                                icon={UserPlus}
                            />
                            <SettingToggle
                                label="Public Search"
                                description="Allow indexed search engines to crawl public pages."
                                enabled={true}
                                onToggle={() => { }}
                                icon={Globe}
                            />
                            <SettingToggle
                                label="Real-time Chat"
                                description="Enable or disable the global chat system."
                                enabled={true}
                                onToggle={() => { }}
                                icon={MessageSquare}
                            />
                        </div>
                    </Card>

                    <Card className="rounded-[2rem] p-8 space-y-6 shadow-xl shadow-black/5">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <Upload className="w-4 h-4 text-blue-500" />
                            Resource Limits
                        </h3>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Max Chapter Upload Size (MB)</label>
                                <input
                                    type="number"
                                    value={settings.maxUploadSizeMB}
                                    className="px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 rounded-xl text-sm transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Default Page Size</label>
                                <input
                                    type="number"
                                    defaultValue={20}
                                    className="px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 rounded-xl text-sm transition-all"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* CMS & Announcements */}
                <div className="space-y-6">
                    <Card className="rounded-[2rem] p-8 h-full space-y-6 shadow-xl shadow-black/5">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <Bell className="w-4 h-4 text-red-500" />
                            Global Announcement
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Status</span>
                                <button
                                    // onClick={() => setSettings(prev => ({ ...prev, announcementActive: !prev.announcementActive }))}
                                    className={cn(
                                        "w-10 h-5 rounded-full transition-colors relative",
                                        settings.announcementActive ? "bg-orange-500" : "bg-gray-200"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                                        settings.announcementActive ? "left-6" : "left-1"
                                    )} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Announcement Text</label>
                                <textarea
                                    rows={4}
                                    value={settings.announcement}
                                    className="px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 rounded-xl text-sm transition-all resize-none"
                                />
                            </div>

                            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100/50 flex items-start gap-3">
                                <Eye className="w-4 h-4 text-orange-600 mt-0.5" />
                                <div className="text-[10px] text-orange-800 font-bold leading-normal">
                                    <span className="block uppercase mb-1">Preview:</span>
                                    {settings.announcement}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                Audit Log Settings
                            </h3>
                            <div className="space-y-4">
                                <SettingToggle
                                    label="Detailed Logging"
                                    description="Record all API request metadata (expensive)."
                                    enabled={false}
                                    onToggle={() => { }}
                                    icon={RotateCcw}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

interface SettingToggleProps {
    label: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
    icon: any;
}

const SettingToggle = ({ label, description, enabled, onToggle, icon: Icon }: SettingToggleProps) => {
    return (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
                <div className={cn(
                    "p-2 rounded-xl",
                    enabled ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"
                )}>
                    <Icon className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{label}</p>
                    <p className="text-[10px] text-gray-500 font-medium leading-tight">{description}</p>
                </div>
            </div>
            <button
                onClick={onToggle}
                className={cn(
                    "w-12 h-6 rounded-full transition-all relative flex items-center shadow-inner",
                    enabled ? "bg-orange-500" : "bg-gray-200"
                )}
            >
                <div className={cn(
                    "absolute w-4 h-4 bg-white rounded-full shadow-lg transition-all",
                    enabled ? "left-7" : "left-1"
                )} />
            </button>
        </div>
    );
};
