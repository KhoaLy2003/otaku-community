# 📘 Jikan Integration – API Document Structure

## Conventions
- External API: Jikan (read-only)
- Internal API: Otaku Community Backend
- External schema MUST NOT be exposed directly to client
- Internal response = normalized + snapshot-based

---

## 1. Anime APIs

**Query Parameters**

* `type` 
Enum
"tv"
"movie"
"ova"
"special"
"ona"
"music"
"cm"
"pv"
"tv_special"
* `page`
* `filter` 
Enum
"airing"
"upcoming"
"bypopularity"
"favorite"
* `status` 
Enum
"airing"
"complete"
"upcoming"

---

### 1.1 Search Anime

#### External API (Jikan)
**Endpoint**
- `GET /anime`

**Query Parameters**
- `q` (string)
- `page` (number)
- `limit` (number)
- `type` (string, optional)
- `status` (string, optional)

**External Response Structure**
```json
{
  "data": [
    {
      "mal_id": 0,
      "url": "string",
      "images": {
        "jpg": {
          "image_url": "string",
          "small_image_url": "string",
          "large_image_url": "string"
        },
        "webp": {
          "image_url": "string",
          "small_image_url": "string",
          "large_image_url": "string"
        }
      },
      "trailer": {
        "youtube_id": "string",
        "url": "string",
        "embed_url": "string"
      },
      "approved": true,
      "titles": [
        {
          "type": "string",
          "title": "string"
        }
      ],
      "title": "string",
      "title_english": "string",
      "title_japanese": "string",
      "title_synonyms": [
        "string"
      ],
      "type": "TV",
      "source": "string",
      "episodes": 0,
      "status": "Finished Airing",
      "airing": true,
      "aired": {
        "from": "string",
        "to": "string",
        "prop": {
          "from": {
            "day": 0,
            "month": 0,
            "year": 0
          },
          "to": {
            "day": 0,
            "month": 0,
            "year": 0
          },
          "string": "string"
        }
      },
      "duration": "string",
      "rating": "G - All Ages",
      "score": 0.1,
      "scored_by": 0,
      "rank": 0,
      "popularity": 0,
      "members": 0,
      "favorites": 0,
      "synopsis": "string",
      "background": "string",
      "season": "summer",
      "year": 0,
      "broadcast": {
        "day": "string",
        "time": "string",
        "timezone": "string",
        "string": "string"
      },
      "producers": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "licensors": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "studios": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "genres": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "explicit_genres": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "themes": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "demographics": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ]
    }
  ],
  "pagination": {
    "last_visible_page": 0,
    "has_next_page": true,
    "current_page": 0,
    "items": {
      "count": 0,
      "total": 0,
      "per_page": 0
    }
  }
}
```

---

#### Internal API

**Endpoint**

* `GET /api/v1/anime/search`

**Query Parameters**

* `keyword`
* `cursor`
* `pageSize`

**Internal Response Structure**

```json
{
  "items": [
    {
      "id": "string",
      "externalId": 5114,

      "title": {
        "default": "Fullmetal Alchemist: Brotherhood",
        "english": "Fullmetal Alchemist: Brotherhood",
        "japanese": "鋼の錬金術師 FULLMETAL ALCHEMIST"
      },

      "coverImage": {
        "small": "string",
        "medium": "string",
        "large": "string"
      },

      "type": "TV",
      "status": "FINISHED",

      "season": {
        "year": 2009,
        "season": "SPRING"
      },

      "episodes": 64,
      "score": 9.1,

      "genres": [
        "Action",
        "Adventure",
        "Fantasy"
      ],

      "isAiring": false
    }
  ],
  "pageInfo": {
    "nextCursor": "string | null",
    "hasNextPage": true
  }
}
```

#### Mapping Rules
| Internal Field      | Source (Jikan)                |
| ------------------- | ----------------------------- |
| `externalId`        | `mal_id`                      |
| `title.default`     | `title`                       |
| `title.english`     | `title_english`               |
| `title.japanese`    | `title_japanese`              |
| `coverImage.small`  | `images.webp.small_image_url` |
| `coverImage.medium` | `images.webp.image_url`       |
| `coverImage.large`  | `images.webp.large_image_url` |
| `type`              | `type`                        |
| `status`            | `status`         |
| `season.year`       | `year`                        |
| `season.season`     | `season`                      |
| `episodes`          | `episodes`                    |
| `score`             | `score`                       |
| `genres[]`          | `genres[].name`               |
| `isAiring`          | `airing`                      |

---

### 1.2 Anime Detail

#### External API (Jikan)

**Endpoint**

* `GET /anime/{id}`

**Path Parameters**

* `id` (mal_id)

**External Response Structure**

```json
{
  "data": {
    "mal_id": 0,
    "url": "string",
    "images": {
      "jpg": {
        "image_url": "string",
        "small_image_url": "string",
        "large_image_url": "string"
      },
      "webp": {
        "image_url": "string",
        "small_image_url": "string",
        "large_image_url": "string"
      }
    },
    "trailer": {
      "youtube_id": "string",
      "url": "string",
      "embed_url": "string"
    },
    "approved": true,
    "titles": [
      {
        "type": "string",
        "title": "string"
      }
    ],
    "title": "string",
    "title_english": "string",
    "title_japanese": "string",
    "title_synonyms": [
      "string"
    ],
    "type": "TV",
    "source": "string",
    "episodes": 0,
    "status": "Finished Airing",
    "airing": true,
    "aired": {
      "from": "string",
      "to": "string",
      "prop": {
        "from": {
          "day": 0,
          "month": 0,
          "year": 0
        },
        "to": {
          "day": 0,
          "month": 0,
          "year": 0
        },
        "string": "string"
      }
    },
    "duration": "string",
    "rating": "G - All Ages",
    "score": 0.1,
    "scored_by": 0,
    "rank": 0,
    "popularity": 0,
    "members": 0,
    "favorites": 0,
    "synopsis": "string",
    "background": "string",
    "season": "summer",
    "year": 0,
    "broadcast": {
      "day": "string",
      "time": "string",
      "timezone": "string",
      "string": "string"
    },
    "producers": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ],
    "licensors": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ],
    "studios": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ],
    "genres": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ],
    "explicit_genres": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ],
    "themes": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ],
    "demographics": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ]
  }
}
```

---

#### Internal API

**Endpoint**

* `GET /api/v1/anime/{id}`

**Path Parameters**

* `id` (internal anime id)

**Internal Response Structure**

```json
{
  "id": "string",

  "external": {
    "source": "JIKAN",
    "externalId": 5114,
    "url": "string"
  },

  "title": {
    "default": "Fullmetal Alchemist: Brotherhood",
    "english": "Fullmetal Alchemist: Brotherhood",
    "japanese": "鋼の錬金術師 FULLMETAL ALCHEMIST",
    "synonyms": [
      "Hagane no Renkinjutsushi"
    ]
  },

  "images": {
    "small": "string",
    "medium": "string",
    "large": "string"
  },

  "trailer": {
    "youtubeId": "string",
    "embedUrl": "string"
  },

  "type": "TV",
  "source": "MANGA",
  "status": "FINISHED",
  "rating": "G",

  "episodes": {
    "total": 64,
    "duration": "24 min per ep"
  },

  "airing": {
    "isAiring": false,
    "season": "SPRING",
    "year": 2009,
    "from": "2009-04-05",
    "to": "2010-07-04",
    "broadcast": {
      "day": "Sunday",
      "time": "17:00",
      "timezone": "Asia/Tokyo"
    }
  },

  "statistics": {
    "score": 9.1,
    "scoredBy": 2500000,
    "rank": 1,
    "popularity": 3,
    "members": 3500000,
    "favorites": 250000
  },

  "synopsis": "string",
  "background": "string",

  "genres": [
    "Action",
    "Adventure",
    "Fantasy"
  ],
  "explicitGenres": [
    "Violence"
  ],
  "themes": [
    "Military",
    "Alchemy"
  ],
  "demographics": [
    "Shounen"
  ],

  "studios": [
    "Bones"
  ],
  "producers": [
    "Aniplex"
  ],
  "licensors": [
    "Funimation"
  ],

  "meta": {
    "approved": true,
    "lastSyncedAt": "2026-01-06T14:32:00Z"
  }
}
```

#### Mapping Rules
| Internal              | Jikan                               |
| --------------------- | ----------------------------------- |
| `external.externalId` | `mal_id`                            |
| `external.url`        | `url`                               |
| `images.*`            | `images.webp.*`                     |
| `trailer.youtubeId`   | `trailer.youtube_id`                |
| `episodes.total`      | `episodes`                          |
| `episodes.duration`   | `duration`                          |
| `airing.isAiring`     | `airing`                            |
| `airing.from / to`    | `aired.from / aired.to`             |
| `statistics.*`        | `score, rank, popularity, members…` |
| `genres[]`            | `genres[].name`                     |
| `studios[]`           | `studios[].name`                    |

---

### 1.3 Top / Trending Anime

#### External API (Jikan)

**Endpoint**

* `GET /top/anime`

**Query Parameters**

* `type` 
* `page`
* `filter` 

**External Response Structure** (*Same with endpoint search anime)

---

#### Internal API

**Endpoint**

* `GET /api/v1/anime/trending`

**Internal Response Structure** (*Same with endpoint search anime)

---

### 1.4 Seasonal Anime

#### External API (Jikan)

**Endpoint**

* `GET /seasons/now`

**External Response Structure** (*Same with endpoint search anime)

---

#### Internal API

**Endpoint**

* `GET /api/v1/anime/seasonal`

**Internal Response Structure** (*Same with endpoint search anime)

---

## 2. Anime News APIs

---

### 2.1 Anime News

#### External API (Jikan)

**Endpoint**

* `GET /anime/{id}/news`

**External Response Structure**

```json
{
  "pagination": {
    "last_visible_page": 0,
    "has_next_page": true
  },
  "data": [
    {
      "mal_id": 0,
      "url": "string",
      "title": "string",
      "date": "string",
      "author_username": "string",
      "author_url": "string",
      "forum_url": "string",
      "images": {
        "jpg": {
          "image_url": "string"
        }
      },
      "comments": 0,
      "excerpt": "string"
    }
  ]
}
```

---

#### Internal API

**Endpoint**

* `GET /api/v1/anime/{id}/news`

**Internal Response Structure**

```json
{
  "animeId": "string",

  "items": [
    {
      "id": "string",
      "externalId": 123456,

      "title": "string",
      "excerpt": "string",

      "links": {
        "newsUrl": "string",
        "forumUrl": "string"
      },

      "imageUrl": "string",

      "author": {
        "username": "string",
        "profileUrl": "string"
      },

      "statistics": {
        "comments": 42
      },

      "publishedAt": "2025-12-30T08:15:00Z",
      "source": "MYANIMELIST"
    }
  ],

  "pageInfo": {
    "hasNextPage": true
  },

  "meta": {
    "externalSource": "JIKAN",
    "lastSyncedAt": "2026-01-06T15:30:00Z"
  }
}
```

#### Mapping Rules
| Internal Field                | Jikan                      |
| ----------------------------- | -------------------------- |
| `animeId`                     | internal anime id          |
| `items[].externalId`          | `mal_id`                   |
| `items[].title`               | `title`                    |
| `items[].excerpt`             | `excerpt`                  |
| `items[].links.newsUrl`       | `url`                      |
| `items[].links.forumUrl`      | `forum_url`                |
| `items[].imageUrl`            | `images.jpg.image_url`     |
| `items[].author.username`     | `author_username`          |
| `items[].author.profileUrl`   | `author_url`               |
| `items[].statistics.comments` | `comments`                 |
| `items[].publishedAt`         | `date`                     |
| `items[].source`              | hardcode `MYANIMELIST`     |
| `pageInfo.hasNextPage`        | `pagination.has_next_page` |

---

## 3. Manga APIs


**Query Parameters**

* `type` 
Enum
"manga"
"novel"
"lightnovel"
"oneshot"
"doujin"
"manhwa"
"manhua"
* `page`
* `filter` 
Enum
"airing"
"upcoming"
"bypopularity"
"favorite"
* `status` 
Enum
"publishing"
"complete"
"hiatus"
"discontinued"
"upcoming"

### 3.1 Manga Search

#### External API (Jikan)

**Endpoint**

* `GET /manga`

**External Response Structure**

```json
{
  "data": [
    {
      "mal_id": 0,
      "url": "string",
      "images": {
        "jpg": {
          "image_url": "string",
          "small_image_url": "string",
          "large_image_url": "string"
        },
        "webp": {
          "image_url": "string",
          "small_image_url": "string",
          "large_image_url": "string"
        }
      },
      "approved": true,
      "titles": [
        {
          "type": "string",
          "title": "string"
        }
      ],
      "title": "string",
      "title_english": "string",
      "title_japanese": "string",
      "type": "Manga",
      "chapters": 0,
      "volumes": 0,
      "status": "Finished",
      "publishing": true,
      "published": {
        "from": "string",
        "to": "string",
        "prop": {
          "from": {
            "day": 0,
            "month": 0,
            "year": 0
          },
          "to": {
            "day": 0,
            "month": 0,
            "year": 0
          },
          "string": "string"
        }
      },
      "score": 0.1,
      "scored_by": 0,
      "rank": 0,
      "popularity": 0,
      "members": 0,
      "favorites": 0,
      "synopsis": "string",
      "background": "string",
      "authors": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "serializations": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "genres": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "explicit_genres": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "themes": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "demographics": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ]
    }
  ],
  "pagination": {
    "last_visible_page": 0,
    "has_next_page": true,
    "current_page": 0,
    "items": {
      "count": 0,
      "total": 0,
      "per_page": 0
    }
  }
}
```

---

#### Internal API

**Endpoint**

* `GET /api/v1/manga/{id}`

**Internal Response Structure**

```json
{
  "items": [
    {
      "id": "string",
      "externalId": 2,

      "title": {
        "default": "Berserk",
        "english": "Berserk",
        "japanese": "ベルセルク"
      },

      "coverImage": {
        "small": "string",
        "medium": "string",
        "large": "string"
      },

      "type": "MANGA",
      "status": "FINISHED",

      "publishing": {
        "isPublishing": false,
        "from": "1989-08-25",
        "to": "2021-09-10"
      },

      "chapters": 364,
      "volumes": 41,

      "score": 9.5,

      "genres": [
        "Action",
        "Dark Fantasy"
      ]
    }
  ],

  "pageInfo": {
    "nextCursor": "string | null",
    "hasNextPage": true
  }
}
```

#### Mapping Rules
| Internal Field            | Jikan                         |
| ------------------------- | ----------------------------- |
| `externalId`              | `mal_id`                      |
| `title.default`           | `title`                       |
| `title.english`           | `title_english`               |
| `title.japanese`          | `title_japanese`              |
| `coverImage.small`        | `images.webp.small_image_url` |
| `coverImage.medium`       | `images.webp.image_url`       |
| `coverImage.large`        | `images.webp.large_image_url` |
| `type`                    | `type`                        |
| `status`                  | `status`                      |
| `publishing.isPublishing` | `publishing`                  |
| `publishing.from`         | `published.from`              |
| `publishing.to`           | `published.to`                |
| `chapters`                | `chapters`                    |
| `volumes`                 | `volumes`                     |
| `score`                   | `score`                       |
| `genres[]`                | `genres[].name`               |

---

### 3.2 Manga Detail

#### External API (Jikan)

**Endpoint**

* `GET /manga/{id}`

**External Response Structure**

```json
{
  "data": {
    "mal_id": 0,
    "url": "string",
    "images": {
      "jpg": {
        "image_url": "string",
        "small_image_url": "string",
        "large_image_url": "string"
      },
      "webp": {
        "image_url": "string",
        "small_image_url": "string",
        "large_image_url": "string"
      }
    },
    "approved": true,
    "titles": [
      {
        "type": "string",
        "title": "string"
      }
    ],
    "title": "string",
    "title_english": "string",
    "title_japanese": "string",
    "type": "Manga",
    "chapters": 0,
    "volumes": 0,
    "status": "Finished",
    "publishing": true,
    "published": {
      "from": "string",
      "to": "string",
      "prop": {
        "from": {
          "day": 0,
          "month": 0,
          "year": 0
        },
        "to": {
          "day": 0,
          "month": 0,
          "year": 0
        },
        "string": "string"
      }
    },
    "score": 0.1,
    "scored_by": 0,
    "rank": 0,
    "popularity": 0,
    "members": 0,
    "favorites": 0,
    "synopsis": "string",
    "background": "string",
    "authors": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ],
    "serializations": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ],
    "genres": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ],
    "explicit_genres": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ],
    "themes": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ],
    "demographics": [
      {
        "mal_id": 0,
        "type": "string",
        "name": "string",
        "url": "string"
      }
    ]
  }
}
```

---

#### Internal API

**Endpoint**

* `GET /api/v1/manga/{id}`

**Internal Response Structure**

```json
{
  "id": "string",

  "external": {
    "source": "JIKAN",
    "externalId": 2,
    "url": "string"
  },

  "title": {
    "default": "Berserk",
    "english": "Berserk",
    "japanese": "ベルセルク",
    "synonyms": []
  },

  "images": {
    "small": "string",
    "medium": "string",
    "large": "string"
  },

  "type": "MANGA",
  "status": "FINISHED",

  "publishing": {
    "isPublishing": false,
    "from": "1989-08-25",
    "to": "2021-09-10"
  },

  "chapters": 364,
  "volumes": 41,

  "statistics": {
    "score": 9.5,
    "scoredBy": 850000,
    "rank": 1,
    "popularity": 2,
    "members": 2500000,
    "favorites": 350000
  },

  "synopsis": "string",
  "background": "string",

  "genres": [
    "Action",
    "Dark Fantasy"
  ],
  "explicitGenres": [
    "Violence"
  ],
  "themes": [
    "Gore",
    "Psychological"
  ],
  "demographics": [
    "Seinen"
  ],

  "authors": [
    {
      "name": "Kentaro Miura",
      "role": "Story & Art"
    }
  ],

  "serializations": [
    "Young Animal"
  ],

  "meta": {
    "approved": true,
    "lastSyncedAt": "2026-01-06T16:10:00Z"
  }
}
```

#### Mapping Rules
| Internal Field            | Jikan                                                    |
| ------------------------- | -------------------------------------------------------- |
| `external.externalId`     | `mal_id`                                                 |
| `external.url`            | `url`                                                    |
| `images.*`                | `images.webp.*`                                          |
| `publishing.isPublishing` | `publishing`                                             |
| `publishing.from / to`    | `published.from / to`                                    |
| `statistics.*`            | `score, scored_by, rank, popularity, members, favorites` |
| `authors[].name`          | `authors[].name`                                         |
| `authors[].role`          | `authors[].type`                                         |
| `serializations[]`        | `serializations[].name`                                  |
| `genres[]`                | `genres[].name`                                          |
| `explicitGenres[]`        | `explicit_genres[].name`                                 |
| `themes[]`                | `themes[].name`                                          |
| `demographics[]`          | `demographics[].name`                                    |

---

### 3.3 Top Manga

#### External API (Jikan)

**Endpoint**

* `GET /top/manga`

**External Response Structure** (Same with search endpoint)

---

#### Internal API

**Endpoint**

* `GET /api/v1/manga/{id}`

**Internal Response Structure** (Same with search endpoint)

## 4. Character APIs (Limited MVP)

---

### 4.1 Anime Characters

#### External API (Jikan)

**Endpoint**

* `GET /anime/{id}/characters`

**External Response Structure**

```json
{
  "data": [
    {
      "character": {
        "mal_id": number,
        "name": string,
        "images": { ... }
      },
      "role": string
    }
  ]
}
```

---

#### Internal API

**Endpoint**

* `GET /api/v1/anime/{id}/characters`

**Internal Response Structure**

```json
{
  "animeId": string,
  "characters": [
    {
      "id": string,
      "externalId": number,
      "name": string,
      "imageUrl": string,
      "role": string
    }
  ]
}
```

---

## 5. Internal Cross-Feature APIs

---

### 5.1 Link Post to Anime / Manga

#### Internal API

**Endpoint**

* `POST /api/v1/posts`

**Request Structure (Partial)**

```json
{
  "content": string,
  "animeId": string | null,
  "mangaId": string | null
}
```

**Internal Response Structure**

```json
{
  "postId": string,
  "content": string,
  "reference": {
    "type": "ANIME" | "MANGA",
    "id": string,
    "title": string,
    "imageUrl": string
  }
}
```

---

## 6. Caching & Metadata (Internal Only)

### Cache Metadata Structure

```json
{
  "externalSource": "JIKAN",
  "externalId": number,
  "cachedAt": string,
  "ttl": number
}
```

---

## 7. Notes

* All internal IDs are system-generated
* External IDs are stored for traceability only
* Frontend NEVER calls Jikan directly
* External schema changes must be handled in adapter layer

---

