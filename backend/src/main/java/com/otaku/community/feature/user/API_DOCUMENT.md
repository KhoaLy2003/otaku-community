# User API

This API provides endpoints for managing users, user settings, and user follows.

## Authentication

Most endpoints require authentication. The API uses a bearer token for authentication.

## User Endpoints

### Get User Profile by Username

- **GET** `/api/users/username/{username}`
- **Description**: Retrieves a user's public profile by their username.
- **Path Parameters**:
    - `username` (required, string): The username of the user to retrieve.
- **Responses**:
    - `200 OK`: The user's profile.
      ```json
      {
        "message": "Success",
        "data": {
          "id": "c3a8c8a0-0b7f-4b1a-8b0a-0e1b0b2a0c1a",
          "username": "testuser",
          "email": "testuser@example.com",
          "avatarUrl": "https://example.com/avatar.jpg",
          "coverImageUrl": "https://example.com/cover.jpg",
          "bio": "This is a test user.",
          "interests": ["anime", "manga"],
          "location": "Tokyo, Japan",
          "profileVisibility": "PUBLIC",
          "followersCount": 10,
          "followingCount": 5,
          "postsCount": 2,
          "isFollowing": false,
          "isRestricted": false,
          "createdAt": "2024-07-27T10:00:00Z"
        }
      }
      ```

### Update User Profile

- **PUT** `/api/users/me`
- **Description**: Updates the authenticated user's profile.
- **Request Body**: `UpdateUserRequest`
- **Responses**:
    - `200 OK`: Profile updated successfully.

### Search Users

- **GET** `/api/users/search`
- **Description**: Searches for users by username.
- **Query Parameters**:
    - `q` (required, string): The search query.
    - `page` (optional, integer, default: 1): The page number for pagination.
    - `limit` (optional, integer, default: 20): The number of items per page.
- **Responses**:
    - `200 OK`: A paginated list of users.

### Sync User with Auth0

- **POST** `/api/users/sync`
- **Description**: Synchronizes user data between Auth0 and the database. This is typically called after a user logs in
  or signs up with Auth0.
- **Request Body**: `UserSyncRequest`
- **Responses**:
    - `200 OK`: User synchronized successfully.

### Get Current User

- **GET** `/api/users/me`
- **Description**: Gets the currently authenticated user's profile.
- **Responses**:
    - `200 OK`: The current user's profile.

## Follow Endpoints

### Follow User

- **POST** `/api/users/{id}/follow`
- **Description**: Follows a user.
- **Path Parameters**:
    - `id` (required, UUID): The ID of the user to follow.
- **Responses**:
    - `200 OK`: User followed successfully.

### Unfollow User

- **DELETE** `/api/users/{id}/follow`
- **Description**: Unfollows a user.
- **Path Parameters**:
    - `id` (required, UUID): The ID of the user to unfollow.
- **Responses**:
    - `200 OK`: User unfollowed successfully.

### Get Followers List

- **GET** `/api/users/{id}/followers`
- **Description**: Retrieves a paginated list of followers for a user.
- **Path Parameters**:
    - `id` (required, UUID): The ID of the user.
- **Query Parameters**:
    - `page` (optional, integer, default: 1): The page number for pagination.
    - `limit` (optional, integer, default: 20): The number of items per page.
- **Responses**:
    - `200 OK`: A paginated list of followers.
      ```json
      {
        "message": "Success",
        "data": {
          "items": [
            {
              "id": "d4b9d9b0-1c8g-5c2b-9c1b-1f2c1d3b1e2b",
              "username": "follower1",
              "avatarUrl": "https://example.com/avatar2.jpg",
              "bio": "I follow interesting people.",
              "isFollowing": true,
              "profileVisibility": "PUBLIC"
            }
          ],
          "totalItems": 1,
          "totalPages": 1,
          "currentPage": 1
        }
      }
      ```

### Get Following List

- **GET** `/api/users/{id}/following`
- **Description**: Retrieves a paginated list of users that the specified user is following.
- **Path Parameters**:
    - `id` (required, UUID): The ID of the user.
- **Query Parameters**:
    - `page` (optional, integer, default: 1): The page number for pagination.
    - `limit` (optional, integer, default: 20): The number of items per page.
- **Responses**:
    - `200 OK`: A paginated list of users the specified user is following.

## User Settings Endpoints

### Update Avatar and Cover Image

- **PUT** `/api/v1/users/me/profile`
- **Description**: Allows user to upload new avatar and cover images.
- **Request Body**: `multipart/form-data` with `avatar` and/or `cover` files.
- **Responses**:
    - `200 OK`: Profile images updated successfully.

### Update Profile Visibility Setting

- **PUT** `/api/v1/users/me/privacy`
- **Description**: Updates the user's profile visibility setting.
- **Request Body**: `UpdatePrivacyRequest`
- **Responses**:
    - `200 OK`: Privacy settings updated successfully.

## DTOs

### UpdateUserRequest

| Field       | Type     | Description               |
|-------------|----------|---------------------------|
| `username`  | String   | The user's new username.  |
| `bio`       | String   | The user's new bio.       |
| `interests` | String[] | The user's new interests. |
| `location`  | String   | The user's new location.  |

### UserProfileResponse

| Field               | Type              | Description                                      |
|---------------------|-------------------|--------------------------------------------------|
| `id`                | UUID              | The user's ID.                                   |
| `username`          | String            | The user's username.                             |
| `email`             | String            | The user's email.                                |
| `avatarUrl`         | String            | The URL of the user's avatar.                    |
| `coverImageUrl`     | String            | The URL of the user's cover image.               |
| `bio`               | String            | The user's bio.                                  |
| `interests`         | String[]          | The user's interests.                            |
| `location`          | String            | The user's location.                             |
| `profileVisibility` | ProfileVisibility | The user's profile visibility setting.           |
| `followersCount`    | Long              | The number of followers the user has.            |
| `followingCount`    | Long              | The number of users the user is following.       |
| `postsCount`        | Long              | The number of posts the user has made.           |
| `isFollowing`       | Boolean           | Whether the current user is following this user. |
| `isRestricted`      | Boolean           | Whether the user's profile is restricted.        |
| `createdAt`         | Instant           | The timestamp when the user was created.         |

### UserResponse

| Field               | Type              | Description                              |
|---------------------|-------------------|------------------------------------------|
| `id`                | UUID              | The user's ID.                           |
| `username`          | String            | The user's username.                     |
| `email`             | String            | The user's email.                        |
| `avatarUrl`         | String            | The URL of the user's avatar.            |
| `coverImageUrl`     | String            | The URL of the user's cover image.       |
| `bio`               | String            | The user's bio.                          |
| `interests`         | String[]          | The user's interests.                    |
| `location`          | String            | The user's location.                     |
| `profileVisibility` | ProfileVisibility | The user's profile visibility setting.   |
| `createdAt`         | Instant           | The timestamp when the user was created. |

### UserSummaryDto

| Field               | Type              | Description                                      |
|---------------------|-------------------|--------------------------------------------------|
| `id`                | UUID              | The user's ID.                                   |
| `username`          | String            | The user's username.                             |
| `avatarUrl`         | String            | The URL of the user's avatar.                    |
| `bio`               | String            | The user's bio.                                  |
| `isFollowing`       | Boolean           | Whether the current user is following this user. |
| `profileVisibility` | ProfileVisibility | The user's profile visibility setting.           |

### UserSyncRequest

| Field       | Type   | Description                   |
|-------------|--------|-------------------------------|
| `auth0Id`   | String | The user's Auth0 ID.          |
| `email`     | String | The user's email.             |
| `username`  | String | The user's username.          |
| `avatarUrl` | String | The URL of the user's avatar. |
| `name`      | String | The user's name.              |
| `nickname`  | String | The user's nickname.          |
| `locale`    | String | The user's locale.            |

### UserSyncResponse

| Field                     | Type              | Description                                   |
|---------------------------|-------------------|-----------------------------------------------|
| `id`                      | UUID              | The user's ID.                                |
| `auth0Id`                 | String            | The user's Auth0 ID.                          |
| `username`                | String            | The user's username.                          |
| `email`                   | String            | The user's email.                             |
| `avatarUrl`               | String            | The URL of the user's avatar.                 |
| `bio`                     | String            | The user's bio.                               |
| `interests`               | String[]          | The user's interests.                         |
| `location`                | String            | The user's location.                          |
| `profileVisibility`       | ProfileVisibility | The user's profile visibility setting.        |
| `coverImageUrl`           | String            | The URL of the user's cover image.            |
| `role`                    | String            | The user's role.                              |
| `isNewUser`               | boolean           | Whether the user is new.                      |
| `unreadNotificationCount` | long              | The number of unread notifications.           |
| `createdAt`               | Instant           | The timestamp when the user was created.      |
| `updatedAt`               | Instant           | The timestamp when the user was last updated. |

### UpdatePrivacyRequest

| Field               | Type              | Description                                |
|---------------------|-------------------|--------------------------------------------|
| `profileVisibility` | ProfileVisibility | The user's new profile visibility setting. |
