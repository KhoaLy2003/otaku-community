export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FEED: '/feed',
  EXPLORE: '/explore',
  TOPICS: '/topics',
  TOPIC: (slug: string) => `/topics/${slug}`,
  PROFILE: (username: string) => `/profile/${username}`,
  POST: (id: string) => `/posts/${id}`,
} as const