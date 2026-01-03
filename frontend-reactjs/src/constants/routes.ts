export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FEED: "/feed",
  EXPLORE: "/explore",
  TOPICS: "/topics",
  LANDING_PAGE: "/landing-page",
  TOPIC: (slug: string) => `/topics/${slug}`,
  PROFILE: (username: string) => `/profile/${username}`,
  POST: (id: string) => `/posts/${id}`,
  EDIT_POST: (id: string) => `/posts/${id}/edit`,
} as const;
