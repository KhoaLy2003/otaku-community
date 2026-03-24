import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { Loader2, ChevronLeft } from "lucide-react";
import { chatApi } from "@/lib/api/chat";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { useAuth } from "@/hooks/useAuth";
import type { Chat } from "@/types/chat";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface ChatWindowProps {
  chat: Chat | null;
  onBack?: () => void;
}

export function ChatWindow({ chat, onBack }: ChatWindowProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    activeChatId,
    setMessages,
    addMessage,
    prependMessages,
    updateMessage,
    deleteMessage,
    setActiveChat,
    getMessages,
    addChat,
  } = useChatStore();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();
  const [deleteData, setDeleteData] = useState<{ messageId: string | null; isOpen: boolean }>({
    messageId: null,
    isOpen: false,
  });

  const chatId = chat?.id;
  const currentMessages = chatId ? getMessages(chatId) : [];
  const currentUserId = user?.id;

  // Load messages when chat changes (only if real chat)
  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    const loadMessages = async () => {
      setLoading(true);
      try {
        const response = await chatApi.getMessages(chatId);
        const messageList = response.data.messages;
        setMessages(chatId, messageList);
        setCursor(response.data.nextCursor);
        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
    setActiveChat(chatId);
  }, [chatId, setMessages, setActiveChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, chat]);

  // Load more messages (pagination)
  const loadMore = async () => {
    if (!chatId || loadingMore || !hasMore || !cursor) return;

    setLoadingMore(true);
    try {
      const response = await chatApi.getMessages(chatId, cursor);
      const newMessages = response.data.messages;
      prependMessages(chatId, newMessages);
      setCursor(response.data.nextCursor);
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Failed to load more messages", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // WebSocket integration
  const { sendMessage, markAsRead } = useChatWebSocket({
    onMessage: (message) => {
      // Always add message to store if it belongs to a known chat
      // The store handles deduplication and organization by chatId
      addMessage(message.chatId, message);

      // Handle active chat specific logic
      if (message.chatId === activeChatId) {
        // Mark as read if this is the active chat
        markAsRead({ chatId: message.chatId });
      }
    },
    onReadReceipt: (event) => {
      if (!chatId) return;

      if (event.chatId === chatId) {
        currentMessages.forEach((msg) => {
          if (msg.status !== "READ") {
            updateMessage(chatId, msg.id, { status: "READ" });
          }
        });
      }
    },
    onMessageDeleted: (event) => {
      if (!chatId) return;

      if (event.chatId === chatId && event.messageId) {
        deleteMessage(chatId, event.messageId);
      }
    },
  });

  // Mark messages as read when chat becomes active
  useEffect(() => {
    if (chatId && chatId === activeChatId) {
      markAsRead({ chatId });
    }
  }, [chatId, activeChatId, markAsRead]);

  const handleSend = async (content: string) => {
    try {
      let targetChatId = chatId;

      // If virtual chat, create it first
      if (!targetChatId && chat) {
        // Optimistic: assuming createChat works
        const response = await chatApi.createChat(chat.participant.id);
        if (response.success && response.data && response.data.id) {
          targetChatId = response.data.id;
          // Update store with the new real chat
          addChat(response.data);
          setActiveChat(targetChatId);
        } else {
          console.error("Failed to create chat: Backend returned null ID");
          return;
        }
      }

      if (targetChatId) {
        await sendMessage({ chatId: targetChatId, content });
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const confirmDelete = async () => {
    if (!chatId || !deleteData.messageId) return;
    try {
      await chatApi.deleteMessage(chatId, deleteData.messageId);
      // Optimistic update handled by socket or we can do it manually here if needed,
      // but let's rely on socket event "MESSAGE_DELETED"
    } catch (error) {
      console.error("Failed to delete message", error);
    } finally {
      setDeleteData({ messageId: null, isOpen: false });
    }
  };

  const initiateDelete = (messageId: string) => {
    setDeleteData({ messageId, isOpen: true });
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1 hover:bg-gray-100 rounded-lg mr-1"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          {(chat.participant.avatarUrl || chat.participant.avatarUrl) && (
            <img
              src={chat.participant.avatarUrl || chat.participant.avatarUrl}
              alt={chat.participant.username}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold leading-none">{chat.participant.username || chat.participant.username}</span>
          <span className="text-xs text-gray-500 mt-1">@{chat.participant.username}</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}

        {!loading && currentMessages.length === 0 && (
          <div className="flex justify-center items-center h-full text-gray-500">
            {chatId ? "No messages yet. Start the conversation!" : "Start a new conversation"}
          </div>
        )}

        {!loading && (
          <>
            {hasMore && chatId && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="text-sm text-blue-500 hover:text-blue-700 disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load older messages"}
                </button>
              </div>
            )}

            {currentMessages.map((message) => {
              const isOwn = message.sender.id === currentUserId;
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  onDelete={initiateDelete}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <MessageInput onSend={handleSend} disabled={loading} />

      <ConfirmDialog
        isOpen={deleteData.isOpen}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onClose={() => setDeleteData({ messageId: null, isOpen: false })}
        variant="danger"
      />
    </div>
  );
}

