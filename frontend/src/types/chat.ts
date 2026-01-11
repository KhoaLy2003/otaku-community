export const MessageStatus = {
  SENT: "SENT",
  DELIVERED: "DELIVERED",
  READ: "READ",
} as const;

export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus];

export interface User {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface Message {
  id: string;
  chatId: string;
  sender: User;
  content: string;
  status: MessageStatus;
  isDeleted: boolean;
  createdAt: string;
}

export interface MessagePreview {
  id: string;
  content: string;
  createdAt: string;
  status: MessageStatus;
}

export interface Chat {
  id: string | null;
  participant: User;
  lastMessage: MessagePreview | null;
  unreadCount: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MessageListResponse {
  messages: Message[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount: number;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
}

export interface MarkReadRequest {
  chatId: string;
}

export interface ChatWebSocketEvent {
  eventType:
    | "CHAT_MESSAGE_RECEIVE"
    | "CHAT_MESSAGE_READ"
    | "CHAT_MESSAGE_DELETED";
  chatId?: string;
  messageId?: string;
  readBy?: string;
  message?: Message;
}
