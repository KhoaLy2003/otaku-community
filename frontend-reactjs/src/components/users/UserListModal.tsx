import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../ui/Modal';
import { UserCard } from './UserCard';
import { usersApi } from '../../lib/api/users';
import { postsApi } from '../../lib/api/posts';
import type { UserListItem } from '../../types/user';

interface UserListModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetId: string;
    listType: 'followers' | 'following' | 'likes';
    onUpdateSuccess?: () => void;
}

export const UserListModal: React.FC<UserListModalProps> = ({ isOpen, onClose, targetId, listType, onUpdateSuccess }) => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingFollowId, setProcessingFollowId] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        if (!isOpen) return;
        setLoading(true);
        try {
            let response;
            if (listType === 'likes') {
                response = await postsApi.getPostLikes(targetId, { limit: 20 });
            } else {
                const apiCall = listType === 'followers' ? usersApi.getFollowers : usersApi.getFollowing;
                response = await apiCall(targetId, { limit: 20 });
            }

            if (response.success && response.data?.data) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error(`Error fetching ${listType}:`, error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [isOpen, listType, targetId]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleFollowToggle = async (targetUserId: string) => {
        if (processingFollowId) return;

        const userToUpdate = users.find(u => u.id === targetUserId);
        if (!userToUpdate) return;

        // Prevent following private accounts
        if (!userToUpdate.isFollowing && userToUpdate.profileVisibility === 'PRIVATE') {
            return;
        }

        setProcessingFollowId(targetUserId);
        try {
            const isCurrentlyFollowing = userToUpdate.isFollowing;
            if (isCurrentlyFollowing) {
                await usersApi.unfollowUser(targetUserId);
            } else {
                await usersApi.followUser(targetUserId);
            }

            // Update local state instead of refetching everything
            setUsers(prevUsers => {
                // If we're looking at our OWN following list and we unfollowed someone, remove them
                if (listType === 'following' && targetId === currentUser?.id && isCurrentlyFollowing) {
                    return prevUsers.filter(u => u.id !== targetUserId);
                }

                // Otherwise just toggle the following status
                return prevUsers.map(u =>
                    u.id === targetUserId ? { ...u, isFollowing: !isCurrentlyFollowing } : u
                );
            });

            if (onUpdateSuccess) {
                onUpdateSuccess();
            }
        } catch (error) {
            console.error('Failed to toggle follow:', error);
        } finally {
            setProcessingFollowId(null);
        }
    };

    const title = listType.charAt(0).toUpperCase() + listType.slice(1);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="max-h-[60vh] -mx-4 -my-2 divide-y divide-gray-200">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No users to display.</div>
                ) : (
                    <div className="overflow-y-auto">
                        {users.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                isFollowing={user.isFollowing}
                                onFollowToggle={handleFollowToggle}
                                isProcessing={processingFollowId === user.id}
                                isOwnCard={user.id === currentUser?.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};
