import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatList } from "./ChatList";
import { ChatWindow } from "./ChatWindow";
import { useChatStore } from "@/store/useChatStore";
import type { Chat } from "@/types/chat";

export function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramChatId = searchParams.get("chatId");
  const paramUserId = searchParams.get("userId");

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const { chats, setActiveChat } = useChatStore();

  // Sync URL params with local state when chats are loaded
  useEffect(() => {
    if (chats.length > 0) {
      if (paramChatId) {
        const found = chats.find(c => c.id === paramChatId);
        if (found) {
          setSelectedChat(found);
          setActiveChat(paramChatId);
        }
      } else if (paramUserId) {
        const found = chats.find(c => c.participant.id === paramUserId);
        if (found) {
          setSelectedChat(found);
          setActiveChat(found.id); // might be null
        }
      }
    }
  }, [chats, paramChatId, paramUserId, setActiveChat]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setActiveChat(chat.id);

    // Update URL
    if (chat.id) {
      setSearchParams({ chatId: chat.id });
    } else {
      setSearchParams({ userId: chat.participant.id });
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Chat list sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatList
            onSelectChat={handleSelectChat}
            selectedChat={selectedChat}
          />
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        <ChatWindow chat={selectedChat} />
      </div>
    </div>
  );
}

