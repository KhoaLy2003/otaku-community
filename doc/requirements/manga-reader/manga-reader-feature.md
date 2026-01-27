# Manga Translation Reader Feature (SwiperJS)

## 1. Overview

This feature allows users to **upload, publish, and read fan-made manga translations** on the platform. A single manga chapter can have **multiple translations** created by different users or groups. Other users can freely select and read any available translation, similar to popular online manga reader websites.

The reading experience is implemented using **Swiper.js** to ensure smooth, mobile-first navigation with swipe gestures, optimized performance, and flexible reading modes.

- **Status**: Active (Core features implemented)
- **Last Updated**: 2026-01-24

---

## 2. Goals

- Enable community-driven manga translation publishing
- Support multiple translations for the same manga chapter
- Provide a smooth, mobile-friendly manga reading experience
- **Increase user engagement through social features (comments, upvotes, views)**
- **Highlight fresh and popular content via Home Feed integration**
- **Support translator branding and growth with dedicated profile pages**

---

## 3. Key Features

- **✅ Multiple translations per chapter**
- **✅ Swipe-based manga reader using Swiper.js**
- **✅ Vertical and horizontal reading modes**
- **✅ Lazy loading for manga pages**
- **✅ Translation selector (by user / group)**
- **✅ Translator notes and credits**
- **✅ Dark mode support**
- **✅ Mobile-first UX**
- **✅ Async Page Upload & Progress Tracking**
- **✅ Page Reordering & Draft Management**
- **🚀 Translation view count and upvote count (New)**
- **🚀 Translation comments (New)**
- **🚀 Home Feed Integration (New)**
- **🚀 Trending & Latest Filters (New)**
- **🚀 Translator Profile Pages (New)**
- **🚀 Translator Ranking (Weekly/Monthly/All-time) (New)**

---

## 4. User Roles

- **Guest** : Can read public translations
- **Registered User** : Can read, upload translations, and manage their own translations
- **Moderator / Admin** : Can review, hide, or remove translations

---

## 5. User Stories (Summary)

### Reader

- **✅** View a list of chapters for a manga
- **✅** See all available translations for a chapter
- **✅** Select a translation to read
- **✅** Swipe to navigate between pages
- **✅** Switch reading mode (vertical / horizontal)
- **✅** Enable dark mode while reading
- **🚀** Vote for favorite translations
- **🚀** Comment on specific translations

### Translator / Uploader

- **✅** Upload a new translation for a chapter
- **✅** Upload multiple pages at once (Async)
- **✅** Reorder pages before publishing
- **✅** Add translator notes and credits
- **✅** Publish from Draft state
- **✅** Delete their own translation
- **🚀** Manage bio and group info on profile

### Moderation

- **✅** Review newly published translations via Moderation Queue
- **✅** Approve or Reject translations

---

## 6. Social & Discoverability (New Features)

### 6.1 Translation Stats (Views & Upvotes)

- Every translation track its own **View Count** (registered on reader open).
- Users can **Upvote/Like** a translation to show appreciation.
- Stats are displayed in the manga detail page chapter list and the reader overlay.

### 6.2 Comment System

- Each translation has a dedicated comment section.
- Support for threaded replies and mentions.
- Moderation tools integrated for translators to manage their own comment sections.

### 6.3 Home Feed Integration

- A new **"Translations" tab** on the Home page.
- Lists the **Latest** translations across the whole platform.
- Users can quickly jump to the reader from the feed.

### 6.4 Trending Translations

- Algorithm-based ranking using View Count and Upvote velocity.
- Featured on the Home Feed and Manga explore pages.

### 6.5 Translator Profile Integration

- Integrated into the existing **Profile Page** as a new **"Translations" tab**.
- Lists all translations published by the user/group.
- Shows aggregate stats (Total Views, Total Upvotes) in the profile context.
- Customizable Bio/Group info remains part of the main user profile.

### 6.6 Translator Ranking (New)

- **Purpose**: Recognize high-quality translators and help readers find reliable content.
- **Periods**: Weekly, Monthly, and All-time rankings.
- **Metrics**: Based on a weighted score of views, upvotes, upvote ratio, comment engagement, and consistency.
- **Badges**: System-awarded badges for "Rising Translator", "Top Translator", etc.
- **Anti-Abuse**: Includes view deduplication and anomaly detection.
- **Detailed Specification**: See [manga-reader-translator-ranking.md](./manga-reader-translator-ranking.md) for full details.

---

## 7. Reader UX Design (Swiper.js)

### 7.1 Swiper Configuration

- **Horizontal Mode** : Page-by-page swipe (LTR / RTL support)
- **Vertical Mode** : Continuous scroll (webtoon-style)
- **Lazy Loading** : Load nearby pages only
- **Keyboard Support** : Arrow keys for navigation (desktop)
- **Touch Gestures** : Swipe, tap, double-tap (mobile)

### 7.2 Reading Modes

- Horizontal (classic manga)
- Vertical (long strip)

---

## 8. Data Model (High-level)

- Manga
- Chapter
- Translation
- TranslationPage
- User

Relationships:

- Manga → Chapters (1:N)
- Chapter → Translations (1:N)
- Translation → Pages (1:N)
- Translation → User (N:1)

---

## 9. Non-Functional Requirements

- High performance on mobile devices
- Image lazy loading and CDN support
- Responsive layout (mobile / tablet / desktop)
- Accessibility-friendly navigation
- Scalability for large image volumes

---

## 10. Legal & Moderation Considerations

- All translations are marked as **fan-made, non-commercial content**
- Copyright disclaimer displayed on reader pages
- Report and takedown mechanism for rights holders
- Soft-delete for translations

---

## 11. Future Enhancements

- Rating and voting for translations
- Comment system per translation
- Follow translator / group
- Reading progress tracking
- Offline reading (PWA)

---

## 12. Technical Stack (Frontend)

- Framework: ReactJs

Reader: Swiper.js

Styling: Tailwind CSS

State & Fetching: TanStack Query

---

## 13. Success Metrics (Updated)

- Number of uploaded translations
- **Engagement rate per translation (Upvotes/Comments)**
- **Home Feed click-through rate to translations**
- **Translator retention and profile growth**

---

**End of Document**
