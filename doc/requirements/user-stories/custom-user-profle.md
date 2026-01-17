```

```

# User Stories – Custom User Profile

## 1️⃣ Feature Overview

- **Feature Name** : Custom User Profile
- **Description** : Enable users to express their otaku identity through profile customization, favorite selections, and personal preferences.
- **Goal** : Increase emotional attachment and long-term engagement with the platform.
- **Status** : Draft

---

## 2️⃣ Scope of Implementation

This document covers user stories for the following features:

1. Identity-based Features
2. Main Character / All-time Favorite
3. Favorite Anime/Manga List

---

## 3️⃣ User Stories

### 3.1 Identity-based Features

| ID                 | As a            | I want to                                               | So that                                                |
| ------------------ | --------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| **US-PROFILE-001** | Registered User | select identity tags that describe my otaku preferences | my profile quickly communicates my interests to others |
| **US-PROFILE-002** | Registered User | view identity tags on other users’ profiles             | I can understand their tastes at a glance              |
| **US-PROFILE-003** | Registered User | update or remove my identity tags                       | my profile always reflects my current interests        |

#### Acceptance Criteria

- Users can select identity tags from a predefined list
- A reasonable maximum number of tags is enforced
- Identity tags are displayed consistently on profile pages
- Tags can be updated without affecting other profile data

---

### 3.2 Main Character / All-time Favorite

| ID                 | As a            | I want to                                                   | So that                                        |
| ------------------ | --------------- | ----------------------------------------------------------- | ---------------------------------------------- |
| **US-PROFILE-004** | Registered User | select one main character or series as my all-time favorite | I can highlight what defines my otaku identity |
| **US-PROFILE-005** | Registered User | add a short reason for my main favorite                     | others understand why it is meaningful to me   |
| **US-PROFILE-006** | Registered User | change my main favorite                                     | my profile stays relevant as my taste evolves  |

#### Acceptance Criteria

- Only one main favorite can be selected at a time
- Main favorite can be an anime, manga, or character
- Optional short description has a character limit
- Main favorite is visually emphasized on the profile

#### API Document

API: getCharactersSearch
Endpoint: get /characters?q={keyword}
Response:
{
"data": [
{
"mal_id": 0,
"url": "string",
"images": {
"jpg": {
"image_url": "string",
"small_image_url": "string"
},
"webp": {
"image_url": "string",
"small_image_url": "string"
}
},
"name": "string",
"name_kanji": "string",
"nicknames": [
"string"
],
"favorites": 0,
"about": "string"
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

---

### 3.3 Favorite Anime/Manga List

| ID                 | As a            | I want to                               | So that                                        |
| ------------------ | --------------- | --------------------------------------- | ---------------------------------------------- |
| **US-PROFILE-007** | Registered User | add anime or manga to my favorites list | I can showcase the works I love                |
| **US-PROFILE-008** | Registered User | remove items from my favorites list     | my list stays curated and accurate             |
| **US-PROFILE-009** | Registered User | add a personal note to a favorite item  | my favorites feel personal rather than generic |
| **US-PROFILE-010** | Visitor         | view another user’s favorite list       | I can discover titles through community taste  |

#### Acceptance Criteria

- Favorites support both anime and manga types
- Duplicate entries are prevented
- Each favorite item may include an optional note
- Favorites are displayed in a clear, readable layout

---

## 4️⃣ General Rules & Constraints

- Only authenticated users can edit their profile
- Profile changes are saved immediately or with clear feedback
- Soft deletion is preferred for removals when applicable
- All user-generated text must follow content guidelines

---

## 5️⃣ Out of Scope (For This Phase)

- Gamification or ranking systems
- Public follower counts or popularity metrics
- Group-based identity features

---

## 6️⃣ Notes

These user stories focus on **identity, expression, and emotional connection** , rather than social pressure or competition. The design prioritizes clarity, flexibility, and long-term maintainability.
