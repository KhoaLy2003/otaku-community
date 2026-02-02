import type { Message } from "@/types/chat";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatTimeAgo } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onDelete?: (messageId: string) => void;
}

export function MessageBubble({ message, isOwn, onDelete }: MessageBubbleProps) {
  if (message.isDeleted) {
    return (
      <div className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}>
        <div className="max-w-[70%] rounded-lg px-3 py-2 bg-gray-100 text-gray-500 italic text-sm">
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2 mb-4 group", isOwn ? "justify-end" : "justify-start")}>
      {!isOwn && (
        <Avatar
          src={message.sender.avatarUrl || undefined}
          alt={message.sender.username}
        />
      )}
      <div className={cn("flex items-center gap-2", isOwn ? "flex-row-reverse" : "flex-row")}>
        <div className={cn("flex flex-col max-w-[70%]", isOwn ? "items-end" : "items-start")}>
          {!isOwn && (
            <span className="text-sm text-gray-500 mb-1 px-1">
              {message.sender.username}
            </span>
          )}
          <div
            className={cn(
              "rounded-lg px-4 py-2 text-sm",
              isOwn
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-900"
            )}
          >
            {message.content}
          </div>
          <span className="text-sm text-gray-400 mt-1 px-1">
            {formatTimeAgo(message.createdAt)}
          </span>
        </div>

        {isOwn && onDelete && (
          <button
            onClick={() => onDelete(message.id)}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
            title="Delete message"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      {isOwn && (
        <Avatar
          src={message.sender.avatarUrl || undefined}
          alt={message.sender.username}
        />
      )}
    </div>
  );
}

