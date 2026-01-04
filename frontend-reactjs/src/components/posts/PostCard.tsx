import {
  Bookmark,
  MessageSquare,
  MoreHorizontal,
  Share2,
  Edit2,
  Trash2,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { interactionsApi } from "../../lib/api/interactions";
import { Card } from "../ui/Card";
import { Colors } from "../../constants/colors";
import { cn } from "../../lib/utils";
import type { PostMedia } from "../../types/post";
import { PostMediaGallery } from "./PostMediaGallery";
import { Heart } from "lucide-react";
import { UserListModal } from "../users/UserListModal";

export interface BasePost {
  id: string;
  title: string;
  body?: string;
  image?: string;
  community: string;
  author: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  time: string;
  likesCount: number;
  isLiked: boolean;
  comments: number;
  flair?: string;
  media?: PostMedia[];
}

interface PostCardProps {
  post: BasePost;
  variant?: "primary" | "secondary";
  showImage?: boolean;
  border?: boolean;
  className?: string;
  onShare?: () => void;
  onSave?: () => void;
  onComment?: () => void;
  onDelete?: (postId: string) => void;
}

export function PostCard({
  post,
  variant = "primary",
  showImage = true,
  border = true,
  className,
  onShare,
  onSave,
  onComment,
  onDelete,
}: PostCardProps) {
  const hasImage = Boolean(showImage && post.image);

  return (
    <Card className={cn("flex overflow-hidden p-0", className)} border={border} style={{ padding: 0 }}>
      <div className="flex flex-1 flex-col">
        {post.media && post.media.length > 0 ? (
          <PostMediaGallery media={post.media} title={post.title} />
        ) : (
          hasImage && (
            <div
              className="max-h-[520px] w-full overflow-hidden"
              style={{ backgroundColor: Colors.Grey[10] }}
            >
              <img
                src={post.image as string}
                alt={post.title}
                width={960}
                height={540}
                className="h-full w-full object-cover"
              />
            </div>
          )
        )}
        <div className="p-4">
          <PostContent
            post={post}
            onShare={onShare}
            onSave={onSave}
            onComment={onComment}
            onDelete={onDelete}
          />
        </div>
      </div>
    </Card>
  );
}



function PostActions({
  post,
  onShare,
  onSave,
  onComment,
  onDelete,
}: {
  post: BasePost;
  onShare?: () => void;
  onSave?: () => void;
  onComment?: () => void;
  onDelete?: (postId: string) => void;
}) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isOwner = user?.id === post.authorId;
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLiked(post.isLiked);
    setLikesCount(post.likesCount);
  }, [post.isLiked, post.likesCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Pass current location as returnTo parameter
    const returnTo = encodeURIComponent(location.pathname);
    navigate(`/posts/${post.id}/edit?returnTo=${returnTo}`);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Redirect to login or show auth modal
      navigate('/login', { state: { from: location } });
      return;
    }

    if (isLiking) return;

    // Optimistic update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
    setIsLiking(true);

    try {
      if (newIsLiked) {
        await interactionsApi.likePost(post.id);
      } else {
        await interactionsApi.unlikePost(post.id);
      }
    } catch (error) {
      // Rollback on error
      setIsLiked(!newIsLiked);
      setLikesCount(prev => !newIsLiked ? prev + 1 : Math.max(0, prev - 1));
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(post.id);
    }
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#7c7c7c]">
      <Action
        icon={Heart}
        label={`${likesCount}`}
        onClick={handleLike}
        onLabelClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowLikesModal(true);
        }}
        active={isLiked}
        activeColor="text-red-500"
      />
      <Action
        icon={MessageSquare}
        label={`${post.comments} Comments`}
        onClick={onComment}
      />
      <Action icon={Share2} label="Share" onClick={onShare} />
      <Action icon={Bookmark} label="Save" onClick={onSave} />
      <div className="relative" ref={menuRef}>
        <Action
          icon={MoreHorizontal}
          label=""
          onClick={(e) => {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            setShowMenu(!showMenu);
          }}
        />
        {showMenu && (
          <div className="absolute bottom-full left-0 mb-2 z-50 w-32 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {isOwner ? (
              <>
                <button
                  onClick={handleEdit}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Post
                </button>
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            ) : (
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              >
                Hide Post
              </button>
            )}
          </div>
        )}
      </div>

      <UserListModal
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        targetId={post.id}
        listType="likes"
      />
    </div>
  );
}

function PostContent({
  post,
  onShare,
  onSave,
  onComment,
  onDelete,
}: {
  post: BasePost;
  onShare?: () => void;
  onSave?: () => void;
  onComment?: () => void;
  onDelete?: (postId: string) => void;
}) {
  return (
    <>
      <PostMeta
        community={post.community}
        author={post.author}
        authorUsername={post.authorName}
        authorAvatarUrl={post.authorAvatarUrl}
        time={post.time}
      />
      <h2 className="mt-2 text-lg font-semibold text-[#1a1a1b]">
        {post.title}
      </h2>
      {post.body && (
        <p className="mt-2 text-sm leading-relaxed text-[#1c1c1c]">
          {post.body}
        </p>
      )}
      <PostActions
        post={post}
        onShare={onShare}
        onSave={onSave}
        onComment={onComment}
        onDelete={onDelete}
      />
    </>
  );
}

function PostMeta({
  community,
  author,
  authorUsername,
  authorAvatarUrl,
  time,
}: {
  community: string;
  author: string;
  authorUsername: string;
  authorAvatarUrl?: string;
  time: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs text-[#7c7c7c]">
      <div className="flex items-center gap-1 text-[#1a1a1b]">
        {authorAvatarUrl ? (
          <img
            src={authorAvatarUrl}
            alt={author}
            className="h-5 w-5 rounded-full object-cover"
          />
        ) : (
          <span
            className="h-5 w-5 rounded-full"
            style={{ backgroundColor: Colors.Grey[20] }}
          />
        )}
        <span className="font-semibold">{community}</span>
      </div>
      <span>•</span>
      <span>Posted by </span>
      <Link
        to={`/profile/${authorUsername}`}
        className="font-medium hover:underline cursor-pointer transition-colors hover:text-orange-600"
        onClick={(e) => e.stopPropagation()}
      >
        {author}
      </Link>
      <span>•</span>
      <span>{time}</span>
    </div>
  );
}

function Action({
  icon: Icon,
  label,
  onClick,
  onLabelClick,
  active,
  activeColor = "text-[#1a1a1b]",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLSpanElement>) => void;
  onLabelClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  active?: boolean;
  activeColor?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center rounded transition hover:bg-[#f6f7f8]",
        active ? activeColor : "text-[#7c7c7c]"
      )}
    >
      <button
        onClick={onClick}
        className="flex items-center gap-1 p-2 focus:outline-none"
      >
        <Icon className={cn("h-4 w-4", active && "fill-current")} />
      </button>
      {label && (
        <span
          className="pr-2 cursor-pointer hover:underline py-2"
          onClick={onLabelClick || onClick}
        >
          {label}
        </span>
      )}
    </div>
  );
}