import {
  ArrowBigDown,
  ArrowBigUp,
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
import { Card } from "../ui/Card";
import { Colors } from "../../constants/colors";
import { cn } from "../../lib/utils";
import type { PostMedia } from "../../types/post";
import { PostMediaGallery } from "./PostMediaGallery";

export interface BasePost {
  id: string;
  title: string;
  body?: string;
  image?: string;
  community: string;
  author: string;
  authorId: string;
  authorName: string;
  time: string;
  votes: number;
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
      <VoteColumn votes={post.votes} variant={variant} />
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

export function VoteColumn({
  votes,
  variant = "primary",
}: {
  votes: number;
  variant?: "primary" | "secondary";
}) {
  return (
    <div
      className="flex w-16 flex-col items-center gap-1 py-4 text-[#7c7c7c]"
      style={{
        backgroundColor:
          variant === "primary" ? Colors.Grey[10] : Colors.Grey.White,
      }}
    >
      <ArrowBigUp
        className="h-6 w-6 cursor-pointer"
        color={Colors.Orange[30]}
      />
      <span className="text-sm font-semibold text-[#1a1a1b]">
        {/* {votes.toLocaleString()} */}
      </span>
      <ArrowBigDown
        className="h-6 w-6 cursor-pointer"
        color={Colors.Blue[40]}
      />
    </div>
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isOwner = user?.id === post.authorId;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
  time,
}: {
  community: string;
  author: string;
  authorUsername: string;
  time: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs text-[#7c7c7c]">
      <div className="flex items-center gap-1 text-[#1a1a1b]">
        <span
          className="h-5 w-5 rounded-full"
          style={{ backgroundColor: Colors.Grey[20] }}
        />
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
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded px-2 py-1 transition hover:bg-[#f6f7f8]"
    >
      <Icon className="h-4 w-4" />
      {label && <span>{label}</span>}
    </button>
  );
}