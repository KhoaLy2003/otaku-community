import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { UserCard } from './UserCard';
import { usersApi } from '../../lib/api/users';
import type { UserListItem } from '../../types/user';

interface UserListModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    listType: 'followers' | 'following';
    onUpdateSuccess?: () => void;
}

export const UserListModal: React.FC<UserListModalProps> = ({ isOpen, onClose, userId, listType, onUpdateSuccess }) => {
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingFollowId, setProcessingFollowId] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        if (!isOpen) return;
        setLoading(true);
        try {
            const apiCall = listType === 'followers' ? usersApi.getFollowers : usersApi.getFollowing;
            const response = await apiCall(userId, { limit: 20 });
            if (response.success && response.data?.data) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error(`Error fetching ${listType}:`, error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [isOpen, listType, userId]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleFollowToggle = async (targetUserId: string) => {
        if (processingFollowId) return;

        setProcessingFollowId(targetUserId);
        try {
            const userToUpdate = users.find(u => u.id === targetUserId);
            if (!userToUpdate) return;

            if (userToUpdate.isFollowing) {
                await usersApi.unfollowUser(targetUserId);
            } else {
                await usersApi.followUser(targetUserId);
            }
            // Refetch to get the most updated follow statuses for everyone in the list
            fetchUsers();
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
                                isOwnCard={user.id === userId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};
