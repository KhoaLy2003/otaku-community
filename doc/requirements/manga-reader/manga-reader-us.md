# 📄 Feature Specification: Manga Translation Reader (SwiperJS)

## 1️⃣ Feature Overview

- **Feature Name**: Manga Translation Reader
- **Description**: Allow users to upload and read fan-made manga translations, supporting multiple translations per chapter with a swipe-based reading experience powered by Swiper.js.
- **Status**: Draft

---

## 2️⃣ User Stories

### Reader (Reading & Engagement)

| ID           | As a   | I want to                                                 | So that                                               | Status      |
| :----------- | :----- | :-------------------------------------------------------- | :---------------------------------------------------- | :---------- |
| **US-R-001** | Reader | view a list of chapters for a manga                       | I can choose which chapter to read                    | Implemented |
| **US-R-002** | Reader | see all available translations for a chapter              | I can select the version I prefer                     | Implemented |
| **US-R-003** | Reader | select a specific translation                             | I can read my preferred translation                   | Implemented |
| **US-R-004** | Reader | swipe between manga pages                                 | I can read naturally on mobile devices                | Implemented |
| **US-R-005** | Reader | switch between vertical and horizontal reading modes      | I can read in my preferred style                      | Implemented |
| **US-R-006** | Reader | enable dark mode while reading                            | I can read comfortably in low-light environments      | Implemented |
| **US-R-007** | Reader | have pages load progressively                             | the reading experience stays fast and smooth          | Implemented |
| **US-R-008** | Reader | upvote a translation                                      | I can show appreciation to the translator             | Implemented |
| **US-R-009** | Reader | see view and upvote counts                                | I can identify popular translations                   | Implemented |
| **US-R-010** | Reader | comment on a translation                                  | I can discuss the content with others                 | Implemented |
| **US-R-011** | Reader | see latest translations on the home feed                  | I can discover new content easily                     | Implemented |
| **US-R-012** | Reader | browse trending translations                              | I can find high-quality popular content               | Implemented |
| **US-R-013** | Reader | view all translations by a specific user on their profile | I can easily find more work from the same uploader    | Implemented |
| **US-R-014** | Reader | view translator rankings (weekly/monthly/all-time)        | I can discover high-quality and reliable translations | Implemented |
| **US-R-015** | Reader | filter rankings by language and individual/group          | I can find translations that match my preferences     | Planned     |

### Translator (Uploading & Management)

| ID           | As a       | I want to                                            | So that                                            | Status      |
| :----------- | :--------- | :--------------------------------------------------- | :------------------------------------------------- | :---------- |
| **US-T-001** | Translator | select an existing manga via Jikan integration       | I can attach my translation to the correct manga   | Implemented |
| **US-T-002** | Translator | upload a new translation for a chapter               | other users can read my version                    | Implemented |
| **US-T-003** | Translator | upload multiple page images asynchronously           | I do not have to wait while uploads are processing | Implemented |
| **US-T-004** | Translator | track upload progress and cancel uploads             | I stay in control of long upload processes         | Implemented |
| **US-T-005** | Translator | reorder uploaded pages                               | pages appear in the correct reading order          | Implemented |
| **US-T-006** | Translator | review my uploaded translation before publishing     | I can verify quality before making it public       | Implemented |
| **US-T-007** | Translator | publish a reviewed translation                       | readers can access my translation                  | Implemented |
| **US-T-008** | Translator | delete my own translation                            | outdated or incorrect translations are removed     | Implemented |
| **US-T-009** | Translator | view total stats (views/upvotes) on my profile       | I can track my growth and popularity               | Implemented |
| **US-T-010** | Translator | customize my profile bio and group info              | I can build my brand in the community              | Implemented |
| **US-T-011** | Translator | add notes and credits to my translation              | readers understand context and authorship          | Implemented |
| **US-T-012** | Translator | view my current rank and earned badges on my profile | I feel recognized for my contributions             | Implemented |

### Moderator (Review & Policy)

| ID           | As a      | I want to                          | So that                                 | Status  |
| :----------- | :-------- | :--------------------------------- | :-------------------------------------- | :------ |
| **US-M-001** | Moderator | review newly uploaded translations | inappropriate content can be controlled | Planned |
| **US-M-002** | Moderator | hide or remove a translation       | community guidelines are enforced       | Planned |

### System (Core Infrastructure)

| ID           | As a   | I want to                                 | So that                                  | Status      |
| :----------- | :----- | :---------------------------------------- | :--------------------------------------- | :---------- |
| **US-S-001** | System | support multiple translations per chapter | community contributions can coexist      | Implemented |
| **US-S-002** | System | manage long-running upload jobs           | upload state is reliable and recoverable | Implemented |
| **US-S-003** | System | optimize image delivery                   | manga pages load quickly on all devices  | Implemented |

---

## 3️⃣ Acceptance Criteria (AC)

### AC for Critical User Stories

#### US-R-004: Swipe-based Reading

- Swiper.js handles horizontal and vertical modes
- Swipe gestures work on both touch and mouse devices
- Current page index is maintained on re-render

#### US-T-002 & US-T-003: Upload Translation (Async)

- Translator must select manga from Jikan-powered search
- Chapter must exist before upload starts
- Upload runs asynchronously and does not block UI
- Each page upload reports progress percentage
- Upload can be cancelled by the user at any time
- Cancelled uploads do not create partial translations

#### US-T-004: Upload Progress Management

- Upload status includes: Pending, Uploading, Completed, Failed, Cancelled
- User can navigate away and still see upload status later
- Failed uploads show clear retry options

#### US-T-005 & US-T-006: Review and Publish Flow

- Successful upload creates a "Draft" translation
- Draft translations are visible only to the translator
- Reader cannot access draft translations
- Translator can preview pages exactly as reader view
- Publish action makes translation publicly readable

#### US-T-008: Delete Translation

- Translator can delete only their own translations
- Deleted translations are soft-deleted
- Deleted translations are hidden from reader views

---

## 4️⃣ Technical Specifications

### 4.1. API Architecture

- `GET /api/v1/manga/{id}/chapters`: Fetch chapter list
- `GET /api/v1/chapters/{id}/translations`: Fetch translations for a chapter
- `GET /api/v1/translations/{id}`: Fetch translation detail and pages
- `POST /api/v1/translations`: Upload a new translation

### 4.2. Database Schema

- **Manga**
- **Chapter**
- **Translation**
- **TranslationPage**
- **User**

Indexes are recommended on `chapter_id`, `translation_id`, and `user_id`.

---

## 5️⃣ Performance & Security

- Images are served via CDN with lazy loading enabled
- Reader interactions respond within acceptable mobile latency
- Only authenticated users can upload or modify translations
- Authorization checks ensure users can only edit their own translations

---

## 6️⃣ Edge Cases & Error Handling

- Display empty state when no translations are available for a chapter
- Show clear validation errors for invalid uploads (size, format)
- Prevent unauthorized access to unpublished or removed translations
