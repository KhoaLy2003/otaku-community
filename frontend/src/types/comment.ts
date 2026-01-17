export interface Comment {
  id: string;
  content: string;
  imageUrl?: string;
  author: AuthorComment;
  postId: string;
  parentId?: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorComment {
  id: string;
  name: string;
  avatar: string;
}
