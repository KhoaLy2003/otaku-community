# Anime API

This API provides endpoints for searching, retrieving, and exploring anime information.

## Endpoints

### Search Anime

- **GET** `/api/v1/anime/search`
- **Description**: Search for anime by keyword, type, and status.
- **Query Parameters**:
    - `q` (optional, string): The search keyword.
    - `type` (optional, string): The type of the anime (e.g., "tv", "movie", "ova", "special", "ona", "music").
    - `status` (optional, string): The status of the anime (e.g., "airing", "complete", "upcoming").
    - `page` (optional, integer, default: 1): The page number for pagination.
- **Responses**:
    - `200 OK`: A paginated list of anime matching the search criteria.
      ```json
      {
        "items": [
          {
            "externalId": 5114,
            "title": "Fullmetal Alchemist: Brotherhood",
            "imageUrl": "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
            "synopsis": "After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in a catastrophic new reality. ...",
            "score": 9.17,
            "status": "Finished Airing",
            "type": "TV",
            "episodes": 64,
            "genres": ["Action", "Adventure", "Drama", "Fantasy", "Magic", "Military", "Shounen"],
            "season": "spring",
            "year": 2009,
            "source": "Manga",
            "rating": "R - 17+ (violence & profanity)",
            "duration": "24 min per ep"
          }
        ],
        "totalItems": 1,
        "totalPages": 1,
        "currentPage": 1,
        "cursor": null
      }
      ```

### Get Anime Details

- **GET** `/api/v1/anime/{id}`
- **Description**: Get detailed information about a specific anime by its ID.
- **Path Parameters**:
    - `id` (required, integer): The ID of the anime.
- **Responses**:
    - `200 OK`: The detailed information of the anime.
      ```json
      {
        "externalId": 5114,
        "title": "Fullmetal Alchemist: Brotherhood",
        "imageUrl": "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
        "synopsis": "After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in a catastrophic new reality. ...",
        "score": 9.17,
        "status": "Finished Airing",
        "type": "TV",
        "episodes": 64,
        "genres": ["Action", "Adventure", "Drama", "Fantasy", "Magic", "Military", "Shounen"],
        "season": "spring",
        "year": 2009,
        "source": "Manga",
        "rating": "R - 17+ (violence & profanity)",
        "duration": "24 min per ep",
        "characters": [
          {
            "malId": 11,
            "name": "Alphonse Elric",
            "imageUrl": "https://cdn.myanimelist.net/images/characters/5/283343.jpg",
            "role": "Main",
            "voiceActors": [
              {
                "name": "Kugimiya, Rie",
                "imageUrl": "https://cdn.myanimelist.net/images/voiceactors/3/68209.jpg",
                "language": "Japanese"
              }
            ]
          }
        ],
        "relatedPosts": []
      }
      ```
    - `404 Not Found`: Anime with the given ID not found.

### Get Trending Anime

- **GET** `/api/v1/anime/trending`
- **Description**: Get a list of currently trending or airing anime.
- **Query Parameters**:
    - `page` (optional, integer, default: 1): The page number for pagination.
- **Responses**:
    - `200 OK`: A paginated list of trending anime. (Response structure is the same as in `Search Anime`)

### Get Seasonal Anime

- **GET** `/api/v1/anime/seasonal`
- **Description**: Get a list of anime for the current season.
- **Query Parameters**:
    - `page` (optional, integer, default: 1): The page number for pagination.
- **Responses**:
    - `200 OK`: A paginated list of seasonal anime. (Response structure is the same as in `Search Anime`)

## DTOs

### AnimeDto

| Field          | Type                    | Description                                            |
|----------------|-------------------------|--------------------------------------------------------|
| `externalId`   | Integer                 | The external ID of the anime (e.g., from MyAnimeList). |
| `title`        | String                  | The title of the anime.                                |
| `imageUrl`     | String                  | The URL of the anime's cover image.                    |
| `synopsis`     | String                  | A brief synopsis of the anime.                         |
| `score`        | Double                  | The score of the anime.                                |
| `status`       | String                  | The status of the anime (e.g., "Finished Airing").     |
| `type`         | String                  | The type of the anime (e.g., "TV").                    |
| `episodes`     | Integer                 | The number of episodes.                                |
| `genres`       | List<String>            | A list of genres associated with the anime.            |
| `season`       | String                  | The season the anime aired in.                         |
| `year`         | Integer                 | The year the anime aired.                              |
| `source`       | String                  | The source material of the anime (e.g., "Manga").      |
| `rating`       | String                  | The age rating of the anime.                           |
| `duration`     | String                  | The duration of each episode.                          |
| `characters`   | List<AnimeCharacterDto> | A list of characters in the anime.                     |
| `relatedPosts` | List<PostResponse>      | A list of related posts in the community.              |

### AnimeCharacterDto

| Field         | Type                | Description                               |
|---------------|---------------------|-------------------------------------------|
| `malId`       | Integer             | The MyAnimeList ID of the character.      |
| `name`        | String              | The name of the character.                |
| `imageUrl`    | String              | The URL of the character's image.         |
| `role`        | String              | The role of the character (e.g., "Main"). |
| `voiceActors` | List<VoiceActorDto> | A list of voice actors for the character. |

### VoiceActorDto

| Field      | Type   | Description                               |
|------------|--------|-------------------------------------------|
| `name`     | String | The name of the voice actor.              |
| `imageUrl` | String | The URL of the voice actor's image.       |
| `language` | String | The language the voice actor performs in. |
