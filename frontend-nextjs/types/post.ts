import type { User } from './user'
import type { Topic } from './topic'
import type { Comment } from './comment'

export interface Post {
  id: string
  content: string
  images?: string[]
  author: User
  topics: Topic[]
  likesCount: number
  commentsCount: number
  isLiked?: boolean
  createdAt: string
  updatedAt: string
}

export interface PostWithDetails extends Post {
  comments: Comment[]
}



