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
  genres: MangaGenre[];
  explicit_genres: MangaGenre[];
  themes: MangaGenre[];
  demographics: MangaGenre[];
  relatedPosts?: import("./post").FeedPost[];
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
