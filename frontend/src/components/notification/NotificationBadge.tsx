import { Bell } from 'lucide-react';

import { NotificationList } from './NotificationList';
import { useNotificationStore } from '@/store/useNotificationStore';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';

export const NotificationBadge = () => {
  const { unreadCount, isConnected } = useNotificationStore();

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none">
            <Bell className={cn("h-6 w-6", isConnected ? "text-gray-700" : "text-gray-400")} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full min-w-[18px]">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" side="bottom" className="w-[360px]">
          <NotificationList />
        </PopoverContent>
      </Popover>
    </div>
  );
};
