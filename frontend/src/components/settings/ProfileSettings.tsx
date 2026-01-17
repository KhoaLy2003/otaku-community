import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usersApi } from '../../lib/api/users';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useToast } from '../../hooks/useToast';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ProfileSettings: React.FC = () => {
    const { user, refreshAuth } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast('File size must be less than 5MB', 'error');
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast('File size must be less than 5MB', 'error');
                return;
            }
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!avatarFile && !coverFile) {
            showToast('No changes to save', 'info');
            return;
        }

        setLoading(true);
        try {
            await usersApi.updateProfileImages(avatarFile || undefined, coverFile || undefined);
            showToast('Profile images updated successfully', 'success');
            await refreshAuth();
            setAvatarFile(null);
            setCoverFile(null);
            setAvatarPreview(null);
            setCoverPreview(null);
        } catch (error: any) {
            showToast(error.message || 'Failed to update profile images', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-6">
                    Profile Assets
                </h3>

                {/* Cover Image */}
                <div className="space-y-4 mb-8">
                    <label className="block text-sm font-medium text-gray-700">
                        Cover Image
                    </label>
                    <div
                        className={cn(
                            "relative h-48 w-full rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 transition-all",
                            !coverPreview && !user?.coverImageUrl && "hover:border-orange-400"
                        )}
                    >
                        {(coverPreview || user?.coverImageUrl) ? (
                            <img
                                src={coverPreview || user?.coverImageUrl}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <ImageIcon size={48} className="mb-2" />
                                <span>Upload a cover image</span>
                            </div>
                        )}
                        <button
                            onClick={() => coverInputRef.current?.click()}
                            className="absolute bottom-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-transform hover:scale-110"
                            title="Change cover image"
                        >
                            <Camera size={20} className="text-gray-700" />
                        </button>
                        <input
                            type="file"
                            ref={coverInputRef}
                            onChange={handleCoverChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    <p className="text-sm text-gray-500">
                        Recommended size: 1200x400 pixels. Max file size: 5MB.
                    </p>
                </div>

                {/* Avatar */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Avatar
                    </label>
                    <div className="flex items-center space-x-6">
                        <div className="relative group">
                            <Avatar
                                src={avatarPreview || user?.avatarUrl}
                                alt={user?.username}
                                className="w-24 h-24 border-4 border-white shadow-md"
                            />
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Camera size={24} className="text-white" />
                            </button>
                            <input
                                type="file"
                                ref={avatarInputRef}
                                onChange={handleAvatarChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <div className="space-y-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                Change Avatar
                            </Button>
                            <p className="text-sm text-gray-500">
                                JPG, PNG or WebP. Max 5MB.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
                <Button
                    onClick={handleSave}
                    disabled={loading || (!avatarFile && !coverFile)}
                    className="min-w-[120px]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </Button>
            </div>
        </div>
    );
};
