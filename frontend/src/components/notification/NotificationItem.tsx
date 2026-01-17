import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/types/notification';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/store/useNotificationStore';
import { notificationApi } from '@/lib/api/notification';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

interface NotificationItemProps {
  notification: Notification;
}

const getNotificationMessage = (notification: Notification): string => {
  const username = notification.sender?.username || 'Someone';
  const type = notification.notificationType.toLowerCase();

  switch (notification.notificationType) {
    case 'LIKE':
      return `${username} liked your ${notification.targetType === 'POST' ? 'post' : 'comment'}`;
    case 'COMMENT':
      return `${username} commented on your post`;
    case 'REPLY':
      return `${username} replied to your comment`;
    case 'FOLLOW':
      return `${username} started following you`;
    case 'UNFOLLOW':
      return `${username} unfollowed you`;
    case 'MENTION':
      return `${username} mentioned you`;
    case 'SYSTEM':
      return notification.preview || 'System notification';
    default:
      return `${username} ${type} your ${notification.targetType?.toLowerCase() || 'content'}`;
  }
};

const getNavigationPath = (notification: Notification): string | null => {
  switch (notification.notificationType) {
    case 'LIKE':
    case 'COMMENT':
    case 'MENTION':
      if (notification.targetType === 'POST') {
        return `/posts/${notification.targetId}`;
      }
      // For comments, navigate to the post that contains the comment
      return `/posts/${notification.targetId}`;
    case 'REPLY':
      // Navigate to the post containing the comment thread
      return `/posts/${notification.targetId}`;
    case 'FOLLOW':
    case 'UNFOLLOW':
      if (notification.sender?.username) {
        return `/profile/${notification.sender.username}`;
      }
      return null;
    case 'SYSTEM':
      return null;
    default:
      return null;
  }
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const navigate = useNavigate();
  const { markRead, decrementUnreadCount } = useNotificationStore();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClick = async () => {
    // Mark as read if not already read
    if (!notification.isRead) {
      try {
        await notificationApi.markAsRead(notification.id);
        markRead(notification.id);
        decrementUnreadCount();
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate to the target
    const path = getNavigationPath(notification);
    if (path) {
      navigate(path);
    }
  };

  const message = getNotificationMessage(notification);

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors',
        !notification.isRead && 'bg-blue-50'
      )}
    >
      <Avatar
        src={notification.sender?.avatarUrl || undefined}
        alt={notification.sender?.username}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          {message}
        </p>
        {notification.preview && (
          <p className="text-sm text-gray-500 mt-1 truncate">{notification.preview}</p>
        )}
        <p className="text-sm text-gray-400 mt-1">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
      {!notification.isRead && (
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full self-center flex-shrink-0"></div>
      )}
    </div>
  );
};
