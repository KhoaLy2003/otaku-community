import { useEffect, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { chatApi } from "@/lib/api/chat";
import { Avatar } from "@/components/ui/Avatar";
import { Loader2 } from "lucide-react";
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
        // Use participant ID to identify selected chat (covers both real and virtual chats)
        const isSelected = selectedChat?.participant.id === chat.participant.id;

        return (
          <button
            key={chat.id ?? `virtual-${chat.participant.id}`}
            onClick={() => onSelectChat(chat)}
            className={cn(
              "flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100",
              isSelected && "bg-blue-50"
            )}
          >
            <Avatar
              src={chat.participant.avatarUrl || undefined}
              alt={chat.participant.username}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm truncate">
                  {chat.participant.username}
                </span>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-400 ml-2">
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
              <div className="flex-shrink-0 bg-blue-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

