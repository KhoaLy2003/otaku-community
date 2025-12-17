"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { PostCard, type BasePost } from "@/components/posts/PostCard";
import { CommentCard } from "@/components/comments/CommentCard";
import { CommentForm } from "@/components/comments/CommentForm";

const mockPost: BasePost = {
  id: "1",
  title: "Teacher accused me of using ChatGPT. I need advice.",
  body: `My teacher accused me of using AI on two essays. I didn’t. She has proof from a detector and wants to meet tomorrow. Boarding school, zero tolerance. How do I defend myself?`,
  image:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
  community: "r/ChatGPT",
  author: "u/gunnarloaf",
  time: "22 hours ago",
  votes: 803,
  comments: 312,
};

const initialComments = [
  {
    id: "c1",
    author: "u/otaku_sensei",
    time: "3 hours ago",
    content:
      "Document your process and show drafts. Many detectors are unreliable.",
    votes: 120,
    isOwner: false,
    replies: [],
  },
  {
    id: "c2",
    author: "u/jlptnerd",
    time: "1 hour ago",
    content: "Bring previous essays as reference for your style. Good luck!",
    votes: 58,
    isOwner: false,
    replies: [],
  },
] as Array<{
  id: string;
  author: string;
  time: string;
  content: string;
  votes: number;
  isOwner?: boolean;
  replies?: Array<{
    id: string;
    author: string;
    time: string;
    content: string;
    votes: number;
    isOwner?: boolean;
    replies?: any[];
  }>;
}>;

export default function PostDetailPage() {
  const params = useParams();
  const [comments, setComments] = useState(initialComments);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setAlertMessage("Link copied to clipboard");
      setTimeout(() => setAlertMessage(null), 2500);
    } catch {
      setAlertMessage("Unable to copy link");
    }
  };

  const handleAddComment = (value: string, image?: File) => {
    const newComment = {
      id: Date.now().toString(),
      author: "You",
      time: "Just now",
      content: value,
      votes: 0,
      isOwner: true,
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const handleReply = (parentId: string, content: string, image?: File) => {
    const newReply = {
      id: Date.now().toString(),
      author: "You",
      time: "Just now",
      content: content,
      votes: 0,
      isOwner: true,
    };
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      })
    );
  };

  const handleEditComment = (id: string, newContent: string) => {
    const updateComment = (comments: typeof initialComments): typeof initialComments => {
      return comments.map((comment) => {
        if (comment.id === id) {
          return { ...comment, content: newContent };
        }
        if (comment.replies) {
          return { ...comment, replies: updateComment(comment.replies) };
        }
        return comment;
      });
    };
    setComments(updateComment);
  };

  const handleDeleteComment = (id: string) => {
    const deleteComment = (comments: typeof initialComments): typeof initialComments => {
      return comments.filter((comment) => {
        if (comment.id === id) return false;
        if (comment.replies) {
          comment.replies = deleteComment(comment.replies);
        }
        return true;
      });
    };
    setComments(deleteComment);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6">
      <Button
        variant="outline"
        color="grey"
        onClick={() => (window.location.href = "/")}
        className="self-start"
        size="sm"
      >
        ← Back to Feed
      </Button>

      <PostCard
        post={mockPost}
        onShare={handleShare}
        onSave={() => console.log("Save clicked")}
        onComment={() => console.log("Comment clicked")}
      />

      {alertMessage && (
        <Alert variant="info" title="Share">
          {alertMessage}
        </Alert>
      )}

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1a1a1b]">
            {comments.length} Comments
          </h2>
        </div>
        <CommentForm onSubmit={handleAddComment} />
      </Card>

      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            id={comment.id}
            author={comment.author}
            time={comment.time}
            content={comment.content}
            votes={comment.votes}
            isOwner={comment.isOwner}
            replies={comment.replies}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            onReply={handleReply}
            onLike={(id) => {
              const updateVotes = (comments: typeof initialComments): typeof initialComments => {
                return comments.map((c) => {
                  if (c.id === id) {
                    return { ...c, votes: (c.votes || 0) + 1 };
                  }
                  if (c.replies) {
                    return { ...c, replies: updateVotes(c.replies) };
                  }
                  return c;
                });
              };
              setComments(updateVotes);
            }}
            onUnlike={(id) => {
              const updateVotes = (comments: typeof initialComments): typeof initialComments => {
                return comments.map((c) => {
                  if (c.id === id) {
                    return { ...c, votes: Math.max(0, (c.votes || 0) - 1) };
                  }
                  if (c.replies) {
                    return { ...c, replies: updateVotes(c.replies) };
                  }
                  return c;
                });
              };
              setComments(updateVotes);
            }}
          />
        ))}
      </div>
    </div>
  );
}
