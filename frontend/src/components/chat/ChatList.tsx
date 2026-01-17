import { useEffect, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { chatApi } from "@/lib/api/chat";
import { Avatar } from "@/components/ui/Avatar";
import { Loader2, MoreVertical, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
function formatTimeAgo(date: string): string {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return messageDate.toLocaleDateString();
}
import { cn } from "@/lib/utils";
import type { Chat } from "@/types/chat";

interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
  selectedChat: Chat | null;
}

export function ChatList({ onSelectChat, selectedChat }: ChatListProps) {
  const navigate = useNavigate();
  const { chats, setChats, unreadCounts, setUnreadCount } = useChatStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadChats = async () => {
      setLoading(true);
      try {
        const response = await chatApi.getChats();
        setChats(response.data);

        // Set unread counts for chats with IDs
        response.data.forEach((chat) => {
          if (chat.id) {
            setUnreadCount(chat.id, chat.unreadCount);
          }
        });
      } catch (error) {
        console.error("Failed to load chats", error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [setChats, setUnreadCount]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {chats.map((chat) => {
        const unreadCount = chat.id ? (unreadCounts[chat.id] || 0) : 0;
        const isSelected = selectedChat?.participant.id === chat.participant.id;

        return (
          <div
            key={chat.id ?? `virtual-${chat.participant.id}`}
            className={cn(
              "flex items-center group hover:bg-gray-50 transition-colors border-b border-gray-100 relative",
              isSelected && "bg-blue-50"
            )}
          >
            <button
              onClick={() => onSelectChat(chat)}
              className="flex-1 flex items-center gap-3 p-3 text-left min-w-0"
            >
              <Avatar
                src={chat.participant.avatarUrl || undefined}
                alt={chat.participant.username}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm truncate">
                    {chat.participant.username}
                  </span>
                  {chat.lastMessage && (
                    <span className="text-sm text-gray-400 ml-2">
                      {formatTimeAgo(chat.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                {chat.lastMessage ? (
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage.content}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Start a conversation
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <div className="flex-shrink-0 bg-blue-500 text-white text-sm font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </button>

            <div className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-black/5 rounded-full transition-colors outline-none">
                    <MoreVertical size={16} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-1 bg-white dark:bg-gray-800 border shadow-md" align="end">
                  <button
                    onClick={() => navigate(`/profile/${chat.participant.username}`)}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <User size={14} />
                    View Profile
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );
      })}
    </div>
  );
}

