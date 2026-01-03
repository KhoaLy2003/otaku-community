import React, { useState, useEffect } from 'react';
import { activityApi } from '../../lib/api/activity';
import type { LoginHistory } from '../../types/user';
import { Card } from '../ui/Card';
import { Loader2, Monitor, Smartphone, Shield } from 'lucide-react';
import { parseDate } from '../../lib/utils';

export const SecuritySettings: React.FC = () => {
    const [history, setHistory] = useState<LoginHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await activityApi.getLoginHistory({ limit: 10 });
                setHistory(response.data.data);
            } catch (err: any) {
                setError(err.message || 'Failed to load login history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getDeviceIcon = (userAgent: string) => {
        const ua = userAgent.toLowerCase();
        if (ua.includes('mobi') || ua.includes('android')) return <Smartphone size={18} />;
        return <Monitor size={18} />;
    };

    const getBrowserName = (userAgent: string) => {
        const ua = userAgent.toLowerCase();
        if (ua.includes('chrome')) return 'Chrome';
        if (ua.includes('firefox')) return 'Firefox';
        if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
        if (ua.includes('edge')) return 'Edge';
        return 'Unknown Browser';
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 size={32} className="text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-6">
                    Login History
                </h3>
                <p className="text-sm text-gray-500 mb-6 flex items-center">
                    <Shield size={16} className="mr-2 text-green-500" />
                    Review your recent account access to ensure everything looks correct.
                </p>

                {error ? (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <Shield size={48} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">No login history available yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                            {getDeviceIcon(item.userAgent)}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-gray-900">
                                                    {getBrowserName(item.userAgent)}
                                                </span>
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className="text-sm text-gray-500">{item.ipAddress}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {parseDate(item.createdAt)?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                        Completed
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-6 border-t">
                <p className="text-xs text-center text-gray-400">
                    Showing last 10 login sessions. If you see suspicious activity, we recommend changing your password through Auth0.
                </p>
            </div>
        </div>
    );
};
