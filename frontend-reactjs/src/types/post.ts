import type { Comment } from "./comment";

export type PostStatus = "DRAFT" | "PUBLISHED";
export type MediaType = "IMAGE" | "VIDEO" | "GIF";

export interface PostMedia {
  id: string;
  postId: string;
  mediaUrl: string;
  mediaType: MediaType;
  orderIndex: number;
}

export interface PostTopic {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  media: PostMedia[];
  topics: PostTopic[];
}

export interface PostWithDetails extends Post {
  comments: Comment[];
  likesCount: number;
  isLiked: boolean;
  author: {
    id: string;
    name: string;
    displayName?: string;
    avatar?: string;
  };
}

export interface FeedPost {
  id: string;
  title: string;
  content: string;
  media: PostMedia[];
  image?: string; // Keep for compatibility if API also returns direct image URL
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likesCount: number;
  commentCount: number;
  isLiked?: boolean;
  topics: PostTopic[];
}
