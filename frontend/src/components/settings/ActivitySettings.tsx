import React, { useState, useEffect } from 'react';
import { activityApi } from '../../lib/api/activity';
import type { ActivityLog } from '../../types/user';
import { Loader2, Activity, Clock, ChevronRight } from 'lucide-react';
import { cn, parseDate } from '../../lib/utils';

export const ActivitySettings: React.FC = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await activityApi.getActivityLog({ limit: 15 });
                setLogs(response.data.data);
            } catch (err: any) {
                setError(err.message || 'Failed to load activity log');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const getActionLabel = (type: string) => {
        switch (type) {
            case 'LOGIN': return 'Logged in';
            case 'LOGOUT': return 'Logged out';
            case 'CREATE_POST': return 'Created a post';
            case 'UPDATE_POST': return 'Updated a post';
            case 'DELETE_POST': return 'Deleted a post';
            case 'CREATE_COMMENT': return 'Commented on a post';
            case 'UPDATE_COMMENT': return 'Updated a comment';
            case 'DELETE_COMMENT': return 'Deleted a comment';
            case 'LIKE_POST': return 'Liked a post';
            case 'UNLIKE_POST': return 'Unliked a post';
            case 'FOLLOW_USER': return 'Followed a user';
            case 'UNFOLLOW_USER': return 'Unfollowed a user';
            case 'UPDATE_PROFILE': return 'Updated profile';
            default: return type.replace(/_/g, ' ').toLowerCase();
        }
    };

    const getActionColor = (type: string) => {
        if (type === 'LOGIN') return 'bg-blue-100 text-blue-600';
        if (type === 'LOGOUT') return 'bg-gray-100 text-gray-600';
        if (type.startsWith('CREATE_')) return 'bg-green-100 text-green-600';
        if (type.startsWith('UPDATE_')) return 'bg-purple-100 text-purple-600';
        if (type.startsWith('DELETE_')) return 'bg-red-100 text-red-600';
        if (type.includes('LIKE')) return 'bg-pink-100 text-pink-600';
        if (type.includes('FOLLOW')) return 'bg-indigo-100 text-indigo-600';
        return 'bg-gray-100 text-gray-600';
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
                    Account Activity
                </h3>

                {error ? (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <Activity size={48} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">No activity recorded yet.</p>
                    </div>
                ) : (
                    <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                        {logs.map((log) => (
                            <div key={log.id} className="relative">
                                <div className="absolute -left-[1.625rem] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-orange-500 z-10" />
                                <div className="flex flex-col">
                                    <div className="flex items-center space-x-3 mb-1">
                                        <span className={cn(
                                            "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md",
                                            getActionColor(log.actionType)
                                        )}>
                                            {getActionLabel(log.actionType)}
                                        </span>
                                        <span className="flex items-center text-sm text-gray-400">
                                            <Clock size={12} className="mr-1" />
                                            {parseDate(log.createdAt)?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <p className="text-sm text-gray-600">
                                            {log.metadata}
                                        </p>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
