import React, { useEffect, useState } from 'react';
import { MapPin, Link as LinkIcon, Calendar, Shield, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EditProfileModal } from './EditProfileModal';
import type { UserProfile } from '../../types/user';
import { usersApi } from '../../lib/api/users';
import { chatApi } from '../../lib/api/chat';
import { useAuth } from '@/hooks/useAuth';
import { UserListModal } from '../users/UserListModal';

interface ProfileHeaderProps {
    user: UserProfile;
    isOwnProfile?: boolean;
    onFollowChange?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwnProfile, onFollowChange }) => {
    const [showAllInterests, setShowAllInterests] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);
    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
    const [isStartingChat, setIsStartingChat] = useState(false);
    const { isAuthenticated, login, user: authUser } = useAuth();
    const navigate = useNavigate();

    const [userListModal, setUserListModal] = useState<{ isOpen: boolean; listType: 'followers' | 'following' | null }>({
        isOpen: false,
        listType: null,
    });

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    const joinedDate = currentUser.joinedAt ? new Date(currentUser.joinedAt) : new Date(currentUser.createdAt);

    const handleFollowToggle = async () => {
        if (!isAuthenticated) {
            login();
            return;
        }

        if (isUpdatingFollow) return;

        // Prevent following private accounts
        if (!currentUser.isFollowing && user.profileVisibility === 'PRIVATE') {
            return;
        }

        setIsUpdatingFollow(true);
        try {
            if (currentUser.isFollowing) {
                await usersApi.unfollowUser(currentUser.id);
                setCurrentUser(prev => ({
                    ...prev,
                    isFollowing: false,
                    followersCount: Math.max(0, (prev.followersCount || 0) - 1)
                }));
            } else {
                await usersApi.followUser(currentUser.id);
                setCurrentUser(prev => ({
                    ...prev,
                    isFollowing: true,
                    followersCount: (prev.followersCount || 0) + 1
                }));
            }
            // Trigger parent refresh to update restriction status
            if (onFollowChange) onFollowChange();
        } catch (error) {
            console.error('Failed to toggle follow status:', error);
        } finally {
            setIsUpdatingFollow(false);
        }
    };

    const refreshProfileData = async () => {
        try {
            const response = await usersApi.getUserProfile(user.username);
            if (response.success && response.data) {
                setCurrentUser(prev => ({
                    ...prev,
                    followersCount: response.data.followersCount,
                    followingCount: response.data.followingCount,
                    isFollowing: response.data.isFollowing
                }));
                if (onFollowChange) onFollowChange();
            }
        } catch (error) {
            console.error('Failed to refresh profile data:', error);
        }
    };

    const openUserListModal = (listType: 'followers' | 'following') => {
        setUserListModal({ isOpen: true, listType });
    };

    const closeUserListModal = () => {
        setUserListModal({ isOpen: false, listType: null });
    };

    const handleMessage = () => {
        navigate(`/chat?userId=${currentUser.id}`);
    };


    return (
        <>
            <div className="bg-white border-b border-gray-200">
                {/* Cover Image */}
                <div className="h-48 md:h-64 bg-gray-200 overflow-hidden relative">
                    {user.coverImageUrl ? (
                        <img
                            src={user.coverImageUrl}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-orange-400 to-pink-500" />
                    )}
                </div>

                {/* Profile Info Section */}
                <div className="px-4 pb-4">
                    <div className="relative flex justify-between items-end -mt-16 mb-4">
                        <div className="relative">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden bg-gray-100">
                                <img
                                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                    alt={user.displayName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="pb-2">
                            {isOwnProfile ? (
                                <Button
                                    variant="outline"
                                    color="grey"
                                    size="md"
                                    className="px-6"
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    Edit profile
                                </Button>
                            ) : (user.profileVisibility === 'PRIVATE' && !currentUser.isFollowing) ? (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 text-sm font-medium">
                                    <Shield size={16} />
                                    Private
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    {currentUser.isFollowing && (
                                        <Button
                                            variant="outline"
                                            color="blue"
                                            size="md"
                                            className="px-4"
                                            onClick={handleMessage}
                                            disabled={isStartingChat}
                                        >
                                            <MessageCircle size={18} className="mr-2" />
                                            Message
                                        </Button>
                                    )}
                                    <Button
                                        variant={currentUser.isFollowing ? "outline" : "filled"}
                                        color={currentUser.isFollowing ? "grey" : "blue"}
                                        size="md"
                                        className="px-6"
                                        onClick={handleFollowToggle}
                                        disabled={isUpdatingFollow || !authUser}
                                    >
                                        {currentUser.isFollowing ? 'Following' : 'Follow'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-2">
                        <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                            {currentUser.displayName || currentUser.username}
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base">
                            @{currentUser.username}
                        </p>
                    </div>

                    {currentUser.bio && (
                        <p className="mt-3 text-gray-800 text-sm md:text-base whitespace-pre-wrap max-w-2xl">
                            {currentUser.bio}
                        </p>
                    )}

                    {currentUser.interests && currentUser.interests.length > 0 && !user.isRestricted && (
                        <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                                {(showAllInterests ? currentUser.interests : currentUser.interests.slice(0, 8)).map((interest, index) => (
                                    <Badge key={index} variant="filled">
                                        {interest}
                                    </Badge>
                                ))}
                                {currentUser.interests.length > 8 && (
                                    <button
                                        onClick={() => setShowAllInterests(!showAllInterests)}
                                        className="text-xs font-medium text-orange-600 hover:text-orange-700 transition"
                                    >
                                        {showAllInterests ? 'Show less' : `+${currentUser.interests.length - 8} more`}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-y-2 gap-x-4 text-gray-500 text-sm md:text-base">
                        {currentUser.location && !user.isRestricted && (
                            <div className="flex items-center gap-1">
                                <MapPin size={18} />
                                <span>{currentUser.location}</span>
                            </div>
                        )}
                        {currentUser.website && !user.isRestricted && (
                            <div className="flex items-center gap-1 text-orange-600 hover:underline">
                                <LinkIcon size={18} />
                                <a href={currentUser.website} target="_blank" rel="noopener noreferrer">
                                    {currentUser.website.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Calendar size={18} />
                            <span>Joined {joinedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    {!user.isRestricted && (
                        <div className="mt-4 flex gap-5">
                            <button
                                className="hover:underline flex items-center gap-1 group"
                                onClick={() => openUserListModal('following')}
                            >
                                <span className="font-bold text-gray-900 group-hover:underline">{currentUser.followingCount || 0}</span>
                                <span className="text-gray-500">Following</span>
                            </button>
                            <button
                                className="hover:underline flex items-center gap-1 group"
                                onClick={() => openUserListModal('followers')}
                            >
                                <span className="font-bold text-gray-900 group-hover:underline">{currentUser.followersCount || 0}</span>
                                <span className="text-gray-500">Followers</span>
                            </button>
                        </div>
                    )}
                </div>
            </div >

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={currentUser}
                onUpdate={(updatedData) => {
                    setCurrentUser(prev => ({ ...prev, ...updatedData }));
                }}
            />

            {
                userListModal.isOpen && userListModal.listType && (
                    <UserListModal
                        isOpen={userListModal.isOpen}
                        onClose={closeUserListModal}
                        targetId={currentUser.id}
                        listType={userListModal.listType}
                        onUpdateSuccess={refreshProfileData}
                    />
                )
            }
        </>
    );
};

