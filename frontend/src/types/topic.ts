export interface Topic {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  postsCount?: number
  followersCount?: number
  isFollowing?: boolean
}

export type TopicCategory =
  | 'anime'
  | 'manga'
  | 'japan-culture'
  | 'japan-food'
  | 'jlpt-learning'
  | 'japan-travel'
  | 'japanese-life'