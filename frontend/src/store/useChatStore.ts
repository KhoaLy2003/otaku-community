import { create } from "zustand";
import type { Chat, Message } from "@/types/chat";

interface ChatStore {
  // Chats
  chats: Chat[];
  activeChatId: string | null;

  // Messages by chat ID
  messages: Record<string, Message[]>;

  // Unread counts by chat ID
  unreadCounts: Record<string, number>;

  // Connection status
  isConnected: boolean;

  // Actions
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chatId: string | null) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;

  // Messages
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  prependMessages: (chatId: string, messages: Message[]) => void;
  updateMessage: (
    chatId: string,
    messageId: string,
    updates: Partial<Message>
  ) => void;
  deleteMessage: (chatId: string, messageId: string) => void;

  // Unread counts
  setUnreadCount: (chatId: string, count: number) => void;
  incrementUnreadCount: (chatId: string) => void;
  clearUnreadCount: (chatId: string) => void;

  // Connection
  setIsConnected: (status: boolean) => void;

  // Helpers
  getMessages: (chatId: string) => Message[];
  getUnreadCount: (chatId: string) => number;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChatId: null,
  messages: {},
  unreadCounts: {},
  isConnected: false,

  setChats: (chats) => set({ chats }),

  setActiveChat: (chatId) => set({ activeChatId: chatId }),

  addChat: (chat) =>
    set((state) => {
      // Remove any existing chat with the same participant, or any virtual chat with same participant
      const filteredChats = state.chats.filter(
        (c) => c.participant.id !== chat.participant.id && c.id !== chat.id
      );
      return {
        chats: [chat, ...filteredChats],
      };
    }),

  updateChat: (chatId, updates) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, ...updates } : chat
      ),
    })),

  setMessages: (chatId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages },
    })),

  addMessage: (chatId, message) =>
    set((state) => {
      const existingMessages = state.messages[chatId] || [];
      // Check if message already exists (avoid duplicates)
      if (existingMessages.some((m) => m.id === message.id)) {
        return state;
      }
      return {
        messages: {
          ...state.messages,
          [chatId]: [...existingMessages, message],
        },
      };
    }),

  prependMessages: (chatId, newMessages) =>
    set((state) => {
      const existingMessages = state.messages[chatId] || [];
      const existingIds = new Set(existingMessages.map((m) => m.id));
      const uniqueNewMessages = newMessages.filter(
        (m) => !existingIds.has(m.id)
      );
      return {
        messages: {
          ...state.messages,
          [chatId]: [...uniqueNewMessages, ...existingMessages],
        },
      };
    }),

  updateMessage: (chatId, messageId, updates) =>
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: chatMessages.map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          ),
        },
      };
    }),

  deleteMessage: (chatId, messageId) =>
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: chatMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, isDeleted: true, content: "This message was deleted" }
              : msg
          ),
        },
      };
    }),

  setUnreadCount: (chatId, count) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [chatId]: count },
    })),

  incrementUnreadCount: (chatId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [chatId]: (state.unreadCounts[chatId] || 0) + 1,
      },
    })),

  clearUnreadCount: (chatId) =>
    set((state) => {
      const newCounts = { ...state.unreadCounts };
      delete newCounts[chatId];
      return { unreadCounts: newCounts };
    }),

  setIsConnected: (status) => set({ isConnected: status }),

  getMessages: (chatId) => {
    return get().messages[chatId] || [];
  },

  getUnreadCount: (chatId) => {
    return get().unreadCounts[chatId] || 0;
  },
}));
