import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import type { UserListItem } from '../../types/user';

interface UserCardProps {
    user: UserListItem;
    isFollowing?: boolean;
    onFollowToggle?: (userId: string) => void;
    isProcessing?: boolean;
    isOwnCard?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
    user,
    isFollowing,
    onFollowToggle,
    isProcessing,
    isOwnCard,
}) => {
    const handleFollowClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onFollowToggle) {
            onFollowToggle(user.id);
        }
    };

    return (
        <div className="flex items-center p-3 hover:bg-gray-50 transition-colors duration-150 rounded-md">
            <Link to={`/profile/${user.username}`} className="flex items-center gap-3 flex-grow">
                <img
                    src={user.avatarUrl || user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                        {user.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                        @{user.username}
                    </p>
                    {user.bio && <p className="text-sm text-gray-600 mt-1 truncate">{user.bio}</p>}
                </div>
            </Link>

            {!isOwnCard && onFollowToggle && (
                <div className="ml-4 flex-shrink-0">
                    <Button
                        variant={isFollowing ? 'outline' : 'filled'}
                        color={isFollowing ? 'grey' : 'blue'}
                        size="sm"
                        className="px-5"
                        onClick={handleFollowClick}
                        disabled={isProcessing}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                </div>
            )}
        </div>
    );
};
