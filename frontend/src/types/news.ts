export const NEWS_SOURCES = ["CRUNCHYROLL", "ANIME_NEWS_NETWORK"] as const;

export type NewsSource = (typeof NEWS_SOURCES)[number];

export const NEWS_CATEGORIES = [
  "ANIME",
  "MANGA",
  "GAME",
  "INDUSTRY",
  "FEATURES",
  "LATEST_NEWS",
  "ANNOUNCEMENTS",
  "INTERVIEWS",
  "REVIEWS",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export interface NewsResponse {
  id: string;
  title: string;
  summary: string;
  content: string;
  link: string;
  imageUrl?: string;
  author?: string;
  source: NewsSource;
  category: NewsCategory;
  publishedAt: string;
  fetchedAt: string;
  createdAt: string;
}

export interface NewsFilters {
  source?: NewsSource;
  category?: NewsCategory;
  page?: number;
  limit?: number;
}
