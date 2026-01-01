import { useEffect, useState } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { notificationApi } from '@/lib/api/notification';

export const NotificationList = () => {
  const {
    notifications,
    setNotifications,
    markAllRead,
    unreadCount,
    setUnreadCount
  } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [notifData, countData] = await Promise.all([
          notificationApi.getNotifications(0, 10),
          notificationApi.getUnreadCount(),
        ]);
        setNotifications(notifData.data.data);
        setUnreadCount(countData.data.count);
        setHasMore(notifData.data.pagination.hasNext);
        setPage(0);
      } catch (error) {
        console.error('Failed to load notifications', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [setNotifications, setUnreadCount]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const data = await notificationApi.getNotifications(
        nextPage,
        10
      );
      setNotifications([...notifications, ...data.data.data]);
      setPage(nextPage);
      setHasMore(data.data.pagination.hasNext);
    } catch (error) {
      console.error('Failed to load more notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      markAllRead();
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
      <div className="flex justify-between items-center mb-2 px-2 sticky top-0 bg-white z-10 pb-2 border-b">
        <h4 className="font-semibold">Notifications</h4>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-8">
          No notifications yet
        </div>
      )}

      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}

      {loading && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}

      {!loading && hasMore && (
        <Button
          variant="outline"
          size="sm"
          color="grey"
          onClick={loadMore}
          className="mt-2 w-full"
        >
          Load More
        </Button>
      )}
    </div>
  );
};
