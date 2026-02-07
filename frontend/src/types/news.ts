import type { RssSource } from "./admin";

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
  source: RssSource;
  category: NewsCategory;
  publishedAt: string;
  fetchedAt: string;
  createdAt: string;
}

export interface NewsFilters {
  sourceId?: string;
  category?: NewsCategory;
  page?: number;
  limit?: number;
}
