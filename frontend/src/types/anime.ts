export interface AnimeImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface AnimeGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeDateProp {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface AnimeAired {
  from: string | null;
  to: string | null;
  prop: {
    from: AnimeDateProp;
    to: AnimeDateProp;
  };
  string: string;
}

export interface AnimeTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images: {
    image_url: string | null;
    small_image_url: string | null;
    medium_image_url: string | null;
    large_image_url: string | null;
    maximum_image_url: string | null;
  };
}

export interface Anime {
  externalId: number;
  malId: number;
  url: string;
  images: {
    jpg: AnimeImage;
    webp: AnimeImage;
  };
  imageUrl: string;
  trailer: AnimeTrailer;
  approved: boolean;
  titles: AnimeTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: AnimeAired;
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: AnimeGenre[];
  licensors: AnimeGenre[];
  studios: AnimeGenre[];
  genres: AnimeGenre[];
  explicit_genres: AnimeGenre[];
  themes: AnimeGenre[];
  demographics: AnimeGenre[];
  characters: AnimeCharacter[];
  relatedPosts?: import("./post").FeedPost[];
}

export interface AnimePagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface AnimeApiResponse {
  pagination: AnimePagination;
  data: Anime[];
}

export interface VoiceActor {
  name: string;
  imageUrl: string;
  language: string;
}

export interface AnimeCharacter {
  malId: number;
  name: string;
  imageUrl: string;
  role: string;
  voiceActors: VoiceActor[];
}

export interface SeasonArchive {
  year: number;
  seasons: string[];
}

export interface Character {
  malId: number;
  name: string;
  imageUrl: string;
  about: string;
  favorites: number;
}
