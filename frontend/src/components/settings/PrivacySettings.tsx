import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usersApi } from '../../lib/api/users';
import { ProfileVisibility } from '../../types/user';
import { Button } from '../ui/Button';
import { useToast } from '../../hooks/useToast';
import { Globe, Users, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export const PrivacySettings: React.FC = () => {
    const { user, refreshAuth } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [selectedVisibility, setSelectedVisibility] = useState<ProfileVisibility>(
        user?.profileVisibility || ProfileVisibility.PUBLIC
    );

    const visibilityOptions = [
        {
            value: ProfileVisibility.PUBLIC,
            label: 'Public',
            description: 'Anyone can view your profile and posts.',
            icon: Globe,
        },
        {
            value: ProfileVisibility.FOLLOWERS_ONLY,
            label: 'Followers Only',
            description: 'Only your followers can view your detailed profile.',
            icon: Users,
        },
        {
            value: ProfileVisibility.PRIVATE,
            label: 'Private',
            description: 'Only you can view your profile. Information will be hidden from others.',
            icon: Lock,
        },
    ];

    const handleSave = async () => {
        if (selectedVisibility === user?.profileVisibility) {
            showToast('No changes to save', 'info');
            return;
        }

        setLoading(true);
        try {
            await usersApi.updatePrivacy({ profileVisibility: selectedVisibility });
            showToast('Privacy settings updated successfully', 'success');
            await refreshAuth();
        } catch (error: any) {
            showToast(error.message || 'Failed to update privacy settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-6">
                    Profile Visibility
                </h3>

                <div className="space-y-4">
                    {visibilityOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedVisibility === option.value;

                        return (
                            <div
                                key={option.value}
                                onClick={() => setSelectedVisibility(option.value)}
                                className={cn(
                                    "relative flex items-start p-4 cursor-pointer rounded-xl border-2 transition-all group",
                                    isSelected
                                        ? "border-orange-500 bg-orange-50/50 ring-1 ring-orange-500"
                                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-lg mr-4 transition-colors",
                                    isSelected ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                )}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className={cn(
                                            "block text-sm font-bold",
                                            isSelected ? "text-orange-900" : "text-gray-900"
                                        )}>
                                            {option.label}
                                        </span>
                                        {isSelected && (
                                            <ShieldCheck size={20} className="text-orange-500" />
                                        )}
                                    </div>
                                    <span className="block text-sm text-gray-500 mt-1">
                                        {option.description}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start space-x-3">
                <ShieldCheck size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                    Visibility settings affect who can see your bio, interests, location, and followers/following lists. Your public username and avatar will still be visible in search results and comments.
                </p>
            </div>

            <div className="flex justify-end pt-4 border-t mt-6">
                <Button
                    onClick={handleSave}
                    disabled={loading || selectedVisibility === user?.profileVisibility}
                    className="min-w-[120px]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Privacy'
                    )}
                </Button>
            </div>
        </div>
    );
};
