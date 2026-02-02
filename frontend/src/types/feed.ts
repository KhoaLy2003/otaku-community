import type { FeedPost } from "./post";
import type { NewsResponse } from "./news";

export interface UnifiedFeedResponse {
  posts: FeedPost[];
  postCursor?: string;
  hasMorePosts: boolean;

  news: NewsResponse[];
  newsCursor?: string;
  hasMoreNews: boolean;

  totalPosts?: number;
  totalNews?: number;
}
