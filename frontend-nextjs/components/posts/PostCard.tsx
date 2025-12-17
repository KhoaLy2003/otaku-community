"use client";

import Image from "next/image";
import {
  ArrowBigDown,
  ArrowBigUp,
  Bookmark,
  MessageSquare,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";

export interface BasePost {
  id: string;
  title: string;
  body?: string;
  image?: string;
  community: string;
  author: string;
  time: string;
  votes: number;
  comments: number;
  flair?: string;
}

interface PostCardProps {
  post: BasePost;
  variant?: "primary" | "secondary";
  showImage?: boolean;
  onShare?: () => void;
  onSave?: () => void;
  onComment?: () => void;
}

export function PostCard({
  post,
  variant = "primary",
  showImage = true,
  onShare,
  onSave,
  onComment,
}: PostCardProps) {
  const hasImage = Boolean(showImage && post.image);

  return (
    <Card className="flex overflow-hidden p-0" style={{ padding: 0 }}>
      <VoteColumn votes={post.votes} variant={variant} />
      <div className="flex flex-1 flex-col">
        {hasImage && (
          <div
            className="max-h-[520px] w-full overflow-hidden"
            style={{ backgroundColor: Colors.Grey[10] }}
          >
            <Image
              src={post.image as string}
              alt={post.title}
              width={960}
              height={540}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <PostContent
            post={post}
            onShare={onShare}
            onSave={onSave}
            onComment={onComment}
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
        {votes.toLocaleString()}
      </span>
      <ArrowBigDown
        className="h-6 w-6 cursor-pointer"
        color={Colors.Blue[40]}
      />
    </div>
  );
}

function PostActions({
  comments,
  onShare,
  onSave,
  onComment,
}: {
  comments: number;
  onShare?: () => void;
  onSave?: () => void;
  onComment?: () => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#7c7c7c]">
      <Action
        icon={MessageSquare}
        label={`${comments} Comments`}
        onClick={onComment}
      />
      <Action icon={Share2} label="Share" onClick={onShare} />
      <Action icon={Bookmark} label="Save" onClick={onSave} />
      <Action icon={MoreHorizontal} label="" />
    </div>
  );
}

function PostContent({
  post,
  onShare,
  onSave,
  onComment,
}: {
  post: BasePost;
  onShare?: () => void;
  onSave?: () => void;
  onComment?: () => void;
}) {
  return (
    <>
      <PostMeta
        community={post.community}
        author={post.author}
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
        comments={post.comments}
        onShare={onShare}
        onSave={onSave}
        onComment={onComment}
      />
    </>
  );
}

function PostMeta({
  community,
  author,
  time,
}: {
  community: string;
  author: string;
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
      <span>Posted by {author}</span>
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
  onClick?: () => void;
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
