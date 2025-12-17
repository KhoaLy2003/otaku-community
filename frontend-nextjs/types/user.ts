export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  interests?: string[]
  location?: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowing?: boolean
}



