# Manga API

This API provides endpoints for searching, retrieving, and exploring manga information.

## Endpoints

### Search Manga

- **GET** `/api/v1/manga/search`
- **Description**: Search for manga by keyword, type, and status.
- **Query Parameters**:
    - `q` (optional, string): The search keyword.
    - `type` (optional, string): The type of the manga (e.g., "manga", "novel", "one_shot", "doujinshi", "manhwa", "
      manhua").
    - `status` (optional, string): The status of the manga (e.g., "publishing", "complete", "hiatus", "discontinued", "
      upcoming").
    - `page` (optional, integer, default: 1): The page number for pagination.
- **Responses**:
    - `200 OK`: A paginated list of manga matching the search criteria.
      ```json
      {
        "items": [
          {
            "externalId": 25,
            "title": "Fullmetal Alchemist",
            "imageUrl": "https://cdn.myanimelist.net/images/manga/3/54823.jpg",
            "synopsis": "The rules of alchemy state that to obtain something, something of equal value must be lost. ...",
            "score": 9.04,
            "status": "Finished",
            "type": "Manga",
            "chapters": 108,
            "volumes": 27,
            "favorites": "225,543",
            "genres": ["Action", "Adventure", "Drama", "Fantasy", "Shounen"],
            "authors": [
              {
                "malId": 1874,
                "type": "Manga",
                "name": "Arakawa, Hiromu",
                "url": "https://myanimelist.net/people/1874/Hiromu_Arakawa"
              }
            ],
            "published": {
              "from": "2001-07-12T00:00:00+00:00",
              "to": "2010-09-11T00:00:00+00:00",
              "string": "Jul 12, 2001 to Sep 11, 2010"
            },
            "relatedPosts": []
          }
        ],
        "totalItems": 1,
        "totalPages": 1,
        "currentPage": 1,
        "cursor": null
      }
      ```

### Get Manga Details

- **GET** `/api/v1/manga/{id}`
- **Description**: Get detailed information about a specific manga by its ID.
- **Path Parameters**:
    - `id` (required, integer): The ID of the manga.
- **Responses**:
    - `200 OK`: The detailed information of the manga.
      ```json
      {
        "externalId": 25,
        "title": "Fullmetal Alchemist",
        "imageUrl": "https://cdn.myanimelist.net/images/manga/3/54823.jpg",
        "synopsis": "The rules of alchemy state that to obtain something, something of equal value must be lost. ...",
        "score": 9.04,
        "status": "Finished",
        "type": "Manga",
        "chapters": 108,
        "volumes": 27,
        "favorites": "225,543",
        "genres": ["Action", "Adventure", "Drama", "Fantasy", "Shounen"],
        "authors": [
          {
            "malId": 1874,
            "type": "Manga",
            "name": "Arakawa, Hiromu",
            "url": "https://myanimelist.net/people/1874/Hiromu_Arakawa"
          }
        ],
        "published": {
          "from": "2001-07-12T00:00:00+00:00",
          "to": "2010-09-11T00:00:00+00:00",
          "string": "Jul 12, 2001 to Sep 11, 2010"
        },
        "relatedPosts": []
      }
      ```
    - `404 Not Found`: Manga with the given ID not found.

### Get Top Manga

- **GET** `/api/v1/manga/top`
- **Description**: Get a list of top-ranked manga.
- **Query Parameters**:
    - `page` (optional, integer, default: 1): The page number for pagination.
- **Responses**:
    - `200 OK`: A paginated list of top manga. (Response structure is the same as in `Search Manga`)

## DTOs

### MangaDto

| Field          | Type                 | Description                                            |
|----------------|----------------------|--------------------------------------------------------|
| `externalId`   | Integer              | The external ID of the manga (e.g., from MyAnimeList). |
| `title`        | String               | The title of the manga.                                |
| `imageUrl`     | String               | The URL of the manga's cover image.                    |
| `synopsis`     | String               | A brief synopsis of the manga.                         |
| `score`        | Double               | The score of the manga.                                |
| `status`       | String               | The status of the manga (e.g., "Finished").            |
| `type`         | String               | The type of the manga (e.g., "Manga").                 |
| `chapters`     | Integer              | The number of chapters.                                |
| `volumes`      | Integer              | The number of volumes.                                 |
| `favorites`    | String               | The number of times the manga has been favorited.      |
| `genres`       | List<String>         | A list of genres associated with the manga.            |
| `authors`      | List<MangaAuthorDto> | A list of authors for the manga.                       |
| `published`    | MangaPublishedDto    | Information about when the manga was published.        |
| `relatedPosts` | List<PostResponse>   | A list of related posts in the community.              |

### MangaAuthorDto

| Field   | Type    | Description                                  |
|---------|---------|----------------------------------------------|
| `malId` | Integer | The MyAnimeList ID of the author.            |
| `type`  | String  | The type of the author (e.g., "Manga").      |
| `name`  | String  | The name of the author.                      |
| `url`   | String  | The URL to the author's page on MyAnimeList. |

### MangaPublishedDto

| Field    | Type    | Description                                                       |
|----------|---------|-------------------------------------------------------------------|
| `from`   | String  | The start date of publication.                                    |
| `to`     | String  | The end date of publication.                                      |
| `prop`   | PropDto | Detailed properties of the publication dates.                     |
| `string` | String  | A human-readable string representation of the publication period. |

### PropDto (within MangaPublishedDto)

| Field  | Type             | Description                     |
|--------|------------------|---------------------------------|
| `from` | MangaDatePropDto | Detailed start date properties. |
| `to`   | MangaDatePropDto | Detailed end date properties.   |

### MangaDatePropDto

| Field   | Type    | Description              |
|---------|---------|--------------------------|
| `day`   | Integer | The day of the month.    |
| `month` | Integer | The month of the year.   |
| `year`  | Integer | The year of publication. |
