import { useState } from "react";
import { Card } from "../ui/Card";
import { Colors } from "../../constants/colors";
import { Button } from "../ui/Button";
import { CommentForm } from "./CommentForm";
import {
  ArrowBigUp,
  ArrowBigDown,
  Reply,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";

interface CommentCardProps {
  id: string;
  author: string;
  time: string;
  content: string;
  votes?: number;
  isOwner?: boolean;
  onEdit?: (id: string, newContent: string) => void;
  onDelete?: (id: string) => void;
  onReply?: (id: string, content: string, image?: File) => void;
  onLike?: (id: string) => void;
  onUnlike?: (id: string) => void;
  replies?: CommentCardProps[];
}

export function CommentCard({
  id,
  author,
  time,
  content,
  votes = 0,
  isOwner = false,
  onEdit,
  onDelete,
  onReply,
  onLike,
  onUnlike,
  replies = [],
}: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      onUnlike?.(id);
    } else {
      setIsLiked(true);
      setIsDisliked(false);
      onLike?.(id);
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      setIsLiked(false);
    }
  };

  const handleSaveEdit = () => {
    onEdit?.(id, editContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };
  return (
    <div className="space-y-2">
      <Card
        className="p-0"
        style={{
          borderColor: Colors.Grey[20],
          backgroundColor: Colors.Grey.White,
        }}
      >
        <div className="p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-[#7c7c7c]">
              <span className="font-semibold text-[#1a1a1b]">{author}</span>
              <span>•</span>
              <span>{time}</span>
              {votes !== 0 && (
                <>
                  <span>•</span>
                  <span>
                    {votes} {votes === 1 ? "point" : "points"}
                  </span>
                </>
              )}
            </div>

            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded hover:bg-[#F6F7F8]"
                >
                  <MoreHorizontal className="h-4 w-4 text-[#7c7c7c]" />
                </button>

                {showMenu && (
                  <div
                    className="absolute right-0 top-8 z-10 rounded border shadow-lg py-1 min-w-[120px]"
                    style={{
                      backgroundColor: Colors.Grey.White,
                      borderColor: Colors.Grey[20],
                    }}
                  >
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[#F6F7F8]"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.(id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[#F6F7F8] text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[80px] rounded border p-2 text-sm outline-none resize-none"
                style={{
                  borderColor: Colors.Grey[20],
                  backgroundColor: Colors.Grey.White,
                }}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  color="grey"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-[#1a1a1b]">{content}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-[#7c7c7c]">
            {/* Vote buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleLike}
                className="p-1 rounded hover:bg-[#F6F7F8]"
              >
                <ArrowBigUp
                  className="h-4 w-4"
                  style={{
                    color: isLiked ? Colors.Orange[30] : Colors.Grey[70],
                  }}
                />
              </button>
              <span className="min-w-[20px] text-center text-[#1a1a1b]">
                {votes + (isLiked ? 1 : 0) - (isDisliked ? 1 : 0)}
              </span>
              <button
                onClick={handleDislike}
                className="p-1 rounded hover:bg-[#F6F7F8]"
              >
                <ArrowBigDown
                  className="h-4 w-4"
                  style={{
                    color: isDisliked ? Colors.Blue[40] : Colors.Grey[70],
                  }}
                />
              </button>
            </div>

            {/* Reply button */}
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#F6F7F8]"
            >
              <Reply className="h-4 w-4" />
              Reply
            </button>
          </div>
        </div>
      </Card>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="ml-6 mt-2">
          <CommentForm
            placeholder="Add a reply..."
            autoFocus={true}
            onSubmit={(replyContent, image) => {
              onReply?.(id, replyContent, image);
              setShowReplyForm(false);
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div
          className="ml-6 space-y-2 border-l-2 pl-4"
          style={{ borderColor: Colors.Grey[20] }}
        >
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              {...reply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReply={onReply}
              onLike={onLike}
              onUnlike={onUnlike}
            />
          ))}
        </div>
      )}
    </div>
  );
}