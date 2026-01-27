export interface MangaImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface MangaTitle {
  type: string;
  title: string;
}

export interface MangaGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface MangaDateProp {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface MangaPublished {
  from: string | null;
  to: string | null;
  prop: {
    from: MangaDateProp;
    to: MangaDateProp;
  };
  string: string;
}

export interface MangaAuthor {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Manga {
  id: string;
  externalId: number;
  mal_id: number;
  url: string;
  imageUrl: string;
  images: {
    jpg: MangaImage;
    webp: MangaImage;
  };
  approved: boolean;
  titles: MangaTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string;
  chapters: number | null;
  volumes: number | null;
  status: string;
  publishing: boolean;
  published: MangaPublished;
  score: number | null;
  scored: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  authors: MangaAuthor[];
  serializations: MangaGenre[];
  genres: string[];
  explicit_genres: MangaGenre[];
  themes: MangaGenre[];
  demographics: MangaGenre[];
  relatedPosts?: import("./post").FeedPost[];
  chapterList?: Chapter[];
}

export interface MangaPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface MangaApiResponse {
  pagination: MangaPagination;
  data: Manga[];
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  //publishedAt: string;
}

export interface Translator {
  id: string;
  username: string;
}

export interface TranslationStats {
  views: number;
  likes: number;
  comments: number;
}

export interface TranslationComment {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  replies: TranslationComment[];
}

export interface UserTranslationsResponse {
  items: TranslationSummary[];
  totalViews: number;
  totalLikes: number;
}

export interface TranslationSummary {
  translationId: string; // Internal UUID
  name: string;
  notes?: string;
  translator: string;
  translatorAvatar?: string;
  chapter?: string;
  chapterId?: string;
  chapterNumber?: number;
  mangaId?: number; // mal_id
  mangaTitle?: string;
  mangaUrl?: string;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN";
  createdAt: string;
  publishedAt?: string;
  uploadJob?: UploadJob;
  stats?: TranslationStats;
}

export interface TranslationPage {
  id: string;
  pageIndex: number;
  imageUrl: string;
}

export interface TranslationDetail extends TranslationSummary {
  chapterId: string;
  chapterNumber: number;
  chapterTitle?: string;
  mangaId: number;
  mangaTitle: string;
  pages: TranslationPage[];
  stats?: TranslationStats;
}

export interface TranslationListResponse {
  chapterId: string;
  translations: TranslationSummary[];
}

export interface UploadJob {
  errorMessage: boolean | undefined;
  uploadJobId: string;
  translationId: string;
  status: "UPLOADING" | "COMPLETED" | "FAILED" | "CANCELLED";
  totalPages: number;
  uploadedPages: number;
  progress: number;
}

export type TranslationActionType = "DELETE" | "PUBLISH" | null;

export interface TranslatorRanking {
  userId: string;
  username: string;
  avatarUrl?: string;
  groupName?: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalTranslations: number;
  score: number;
  rank: number;
}
