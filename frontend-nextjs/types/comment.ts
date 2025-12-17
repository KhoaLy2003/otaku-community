import type { User } from './user'

export interface Comment {
  id: string
  content: string
  author: User
  postId: string
  parentId?: string // For nested replies
  likesCount: number
  isLiked?: boolean
  createdAt: string
  updatedAt: string
}



