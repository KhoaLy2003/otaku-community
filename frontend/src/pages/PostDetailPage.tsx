import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PostCard, type BasePost } from "@/components/posts/PostCard";
import { CommentCard } from "@/components/comments/CommentCard";
import { CommentForm } from "@/components/comments/CommentForm";
import { postsApi } from "@/lib/api/posts";
import { commentsApi } from "@/lib/api/comments";
import { timeAgo } from "@/lib/utils";
import type { PostWithDetails } from "@/types/post";
import type { Comment } from "@/types/comment";
import { useAuth } from '@/hooks/useAuth';

// Interface for comments to be passed to CommentCard
interface CommentCardData {
  id: string;
  author: string;
  time: string;
  content: string;
  imageUrl?: string;
  votes: number;
  isOwner?: boolean;
  replies: CommentCardData[];
}

// Helper to build a hierarchical comment tree from a flat list
const buildCommentTree = (
  comments: Comment[],
  currentUserId?: string | null,
  parentId: string | null = null
): CommentCardData[] => {
  return comments
    .filter((comment) => comment.parentId === parentId)
    .map((comment) => ({
      id: comment.id,
      author: comment.author?.name || "Unknown",
      time: timeAgo(comment.createdAt),
      content: comment.content,
      imageUrl: comment.imageUrl,
      votes: comment.likesCount,
      isOwner: currentUserId ? comment.author?.id === currentUserId : false,
      replies: buildCommentTree(comments, currentUserId, comment.id),
    }))
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
};

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const currentUserId = user?.id;

  // Get returnTo parameter, default to feed
  const returnTo = searchParams.get('returnTo') || '/';
  const backButtonText = returnTo.startsWith('/profile') ? '← Back to Profile' : '← Back to Feed';

  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsData, setCommentsData] = useState<CommentCardData[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Post ID is missing.");
      setLoading(false);
      return;
    }

    const fetchPostDetails = async () => {
      try {
        const response = await postsApi.getPostDetails(id);
        if (response.success && response.data) {
          setPost(response.data);
          setCommentsData(buildCommentTree(response.data.comments, currentUserId));
        } else {
          setError(response.message || "Post not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch post details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id, currentUserId]);

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

  const handleAddComment = async (value: string, image?: File) => {
    if (!id || !user) return;

    let optimisticImageUrl = undefined;
    if (image) {
      optimisticImageUrl = URL.createObjectURL(image);
    }

    const optimisticComment: CommentCardData = {
      id: Date.now().toString(),
      author: user.username,
      time: "Just now",
      content: value,
      imageUrl: optimisticImageUrl,
      votes: 0,
      isOwner: true,
      replies: [],
    };
    setCommentsData((prev) => [optimisticComment, ...prev]);

    try {
      const response = await commentsApi.createComment({ postId: id, content: value }, image);
      if (response.success && response.data) {
        setCommentsData((prev) =>
          prev.map((c) => (c.id === optimisticComment.id ? buildCommentTree([response.data as any], user.id)[0] : c))
        );
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      setCommentsData((prev) => prev.filter((c) => c.id !== optimisticComment.id));
    }
  };

  const handleReply = async (parentId: string, content: string, image?: File) => {
    if (!id || !user) return;

    let optimisticImageUrl = undefined;
    if (image) {
      optimisticImageUrl = URL.createObjectURL(image);
    }

    const optimisticReply: CommentCardData = {
      id: Date.now().toString(),
      author: user.username,
      time: "Just now",
      content: content,
      imageUrl: optimisticImageUrl,
      votes: 0,
      isOwner: true,
      replies: [],
    };

    const addOptimisticReply = (comments: CommentCardData[]): CommentCardData[] => {
      return comments.map((comment) => {
        if (comment.id === parentId) {
          return { ...comment, replies: [optimisticReply, ...comment.replies] };
        }
        if (comment.replies.length > 0) {
          return { ...comment, replies: addOptimisticReply(comment.replies) };
        }
        return comment;
      });
    };
    setCommentsData(addOptimisticReply);

    try {
      const response = await commentsApi.createComment({ postId: id, content, parentId }, image);
      if (response.success && response.data) {
        const newReply: CommentCardData = {
          id: response.data.id,
          author: response.data.author.name,
          time: timeAgo(response.data.createdAt),
          content: response.data.content,
          imageUrl: response.data.imageUrl,
          votes: response.data.likesCount,
          isOwner: response.data.author.id === user.id,
          replies: [],
        };
        const addFinalReply = (comments: CommentCardData[]): CommentCardData[] => {
          return comments.map(comment => {
            if (comment.id === parentId) {
              const filteredReplies = comment.replies.filter(r => r.id !== optimisticReply.id);
              return { ...comment, replies: [newReply, ...filteredReplies] };
            }
            if (comment.replies.length > 0) {
              return { ...comment, replies: addFinalReply(comment.replies) };
            }
            return comment;
          });
        }
        setCommentsData(addFinalReply);
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
      const removeOptimisticReply = (comments: CommentCardData[]): CommentCardData[] => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            return { ...comment, replies: comment.replies.filter(r => r.id !== optimisticReply.id) };
          }
          if (comment.replies.length > 0) {
            return { ...comment, replies: removeOptimisticReply(comment.replies) };
          }
          return comment;
        });
      };
      setCommentsData(removeOptimisticReply);
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    const oldComments = commentsData;
    const updateOptimisticComment = (comments: CommentCardData[]): CommentCardData[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, content: newContent };
        }
        if (comment.replies.length > 0) {
          return { ...comment, replies: updateOptimisticComment(comment.replies) };
        }
        return comment;
      });
    };
    setCommentsData(updateOptimisticComment);

    try {
      await commentsApi.updateComment(commentId, { content: newContent });
    } catch (error) {
      console.error("Failed to edit comment:", error);
      setCommentsData(oldComments);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const oldComments = commentsData;
    const removeOptimisticComment = (comments: CommentCardData[]): CommentCardData[] => {
      return comments.filter((comment) => {
        if (comment.id === commentId) return false;
        if (comment.replies.length > 0) {
          comment.replies = removeOptimisticComment(comment.replies);
        }
        return true;
      });
    };
    setCommentsData(removeOptimisticComment);

    try {
      await commentsApi.deleteComment(commentId);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setCommentsData(oldComments);
    }
  };

  const handleLikeComment = (commentId: string) => {
    // API call for liking comments should be implemented here
  };

  const handleUnlikeComment = (commentId: string) => {
    // API call for unliking comments should be implemented here
  };


  const handleDeletePost = (postId: string) => {
    setShowDeleteDialog(true);
  };

  const confirmDeletePost = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const response = await postsApi.deletePost(id);
      if (response.success) {
        setShowDeleteDialog(false);
        navigate(returnTo);
      } else {
        setAlertMessage(response.message || 'Failed to delete post');
        setShowDeleteDialog(false);
      }
    } catch (error: any) {
      setAlertMessage(error.message || 'An error occurred while deleting the post');
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <p>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <Alert variant="error" title="Error">
          {error}
        </Alert>
        <Button
          variant="outline"
          color="grey"
          onClick={() => navigate(returnTo)}
          className="self-start"
          size="sm"
        >
          {backButtonText}
        </Button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <Alert variant="info" title="Not Found">
          Post not found.
        </Alert>
        <Button
          variant="outline"
          color="grey"
          onClick={() => navigate(returnTo)}
          className="self-start"
          size="sm"
        >
          {backButtonText}
        </Button>
      </div>
    );
  }

  const adaptedPost: BasePost = {
    id: post.id,
    title: post.title,
    body: post.content,
    media: post.media,
    image: post.media && post.media.length > 0 ? post.media[0].mediaUrl : undefined,
    community: post.topics && post.topics.length > 0 ? post.topics[0].name : 'General',
    author: post.author.name,
    authorId: post.author.id,
    authorName: post.author.name,
    authorAvatarUrl: post.author.avatar,
    time: timeAgo(post.createdAt),
    likesCount: post.likesCount,
    isLiked: post.isLiked,
    comments: post.comments.length,
    references: post.references,
  };

  return (
    <div className="mx-auto flex flex-col gap-4">
      <Button
        variant="outline"
        color="grey"
        onClick={() => navigate(returnTo)}
        className="self-start"
        size="sm"
      >
        {backButtonText}
      </Button>

      <PostCard
        post={adaptedPost}
        onShare={handleShare}
        onSave={() => console.log("Save clicked")}
        onComment={() => console.log("Comment clicked")}
        onDelete={handleDeletePost}
      />

      {alertMessage && (
        <Alert variant="info" title="Share">
          {alertMessage}
        </Alert>
      )}

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1a1a1b]">
            {commentsData.length} Comments
          </h2>
        </div>
        <CommentForm onSubmit={handleAddComment} />
      </Card>

      <div className="space-y-3">
        {commentsData.map((comment) => (
          <CommentCard
            key={comment.id}
            id={comment.id}
            author={comment.author}
            time={comment.time}
            content={comment.content}
            imageUrl={comment.imageUrl}
            votes={comment.votes}
            isOwner={comment.isOwner}
            replies={comment.replies}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            onReply={handleReply}
            onLike={handleLikeComment}
            onUnlike={handleUnlikeComment}
          />
        ))}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeletePost}
        title="Delete post?"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}