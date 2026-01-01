export const NotificationType = {
  LIKE: "LIKE",
  COMMENT: "COMMENT",
  REPLY: "REPLY",
  FOLLOW: "FOLLOW",
  UNFOLLOW: "UNFOLLOW",
  MENTION: "MENTION",
  SYSTEM: "SYSTEM",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export interface Notification {
  id: string;
  notificationType: NotificationType;
  sender: {
    id: string;
    username: string;
    avatarUrl: string;
  } | null;
  targetId: string;
  targetType: "POST" | "COMMENT" | "USER";
  preview: string | null;
  isRead: boolean;
  createdAt: string;
}
