import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { useChatStore } from "@/store/useChatStore";
import { chatApi } from "@/lib/api/chat";

export function ChatSocketListener() {
    const { isAuthenticated } = useAuth0();
    const {
        setChats,
        setUnreadCount,
        addMessage,
        incrementUnreadCount,
        activeChatId
    } = useChatStore();

    // Load chats on mount to populate unread counts
    useEffect(() => {
        if (isAuthenticated) {
            chatApi.getChats()
                .then(response => {
                    setChats(response.data);
                    response.data.forEach((chat) => {
                        if (chat.id) {
                            setUnreadCount(chat.id, chat.unreadCount);
                        }
                    });
                })
                .catch(console.error);
        }
    }, [isAuthenticated, setChats, setUnreadCount]);

    // Listen for real-time messages
    useChatWebSocket({
        onMessage: (message) => {
            if (message.chatId) {
                // If chat is not active, increment unread count
                if (message.chatId !== activeChatId) {
                    incrementUnreadCount(message.chatId);
                }
                // Always add message to store (if we have the chat loaded)
                // If the chat is not in store, we might need to fetch it or create it?
                // But for unread count purposes, checking if we have it in store is good enough?
                // If it's a new chat entirely, we might miss it.
                // Ideally we should re-fetch chats if we get a message for unknown chat?

                // Simple approach: Add to message store
                addMessage(message.chatId, message);
            }
        },
        onReadReceipt: (event) => {
            // We could handle this globally too
        }
    });

    return null;
}
