# 🖥 UI Screens Specification – Manga Translation Feature

This document describes **all UI screens** required to implement the Manga Translation & Reader feature, covering **Reader** , **Translator** , and **Moderation** flows.

---

## 1️⃣ Screen Overview Map

```text
Manga Detail Page
 ├─ Chapter List
 │   └─ Translation Selector
 │       └─ Reader Screen
 │
 └─ Upload Translation Flow (Translator)
     ├─ Select Manga & Chapter
     ├─ Upload Pages
     ├─ Upload Progress
     ├─ Draft Preview
     └─ Publish Confirmation
```

---

## 2️⃣ Manga Detail Screen

### Purpose

Allow users to explore manga information and access chapters.

### Primary Users

- Reader
- Translator

### Key UI Components

- Manga cover image
- Title & metadata
- Chapter list (ascending / descending)
- "Upload Translation" CTA (Translator only)

### Actions

- Select a chapter
- Navigate to translation list
- Start upload translation flow

---

## 3️⃣ Translation Selector Screen

### Purpose

Allow users to choose between multiple translations of the same chapter.

### Key UI Components

- Chapter title & number
- List of available translations
  - Translation name
  - Translator / group
  - Publish date
- Default selected translation

### Actions

- Select translation
- Enter Reader screen

---

## 4️⃣ Reader Screen (Swiper-based)

### Purpose

Provide a smooth, mobile-friendly manga reading experience.

### Key UI Components

- Swiper page container
- Page indicator (current / total)
- Reading mode toggle (vertical / horizontal)
- Dark mode toggle
- Translation info (name, credits)

### Interactions

- Swipe to navigate pages
- Tap to show / hide controls
- Keyboard navigation (desktop)

---

## 5️⃣ Select Manga & Chapter Screen (Translator)

### Purpose

Allow translators to select the correct manga and chapter before uploading.

### Key UI Components

- Manga search input (Jikan-powered)
- Manga search results
- Chapter dropdown

### Actions

- Search manga
- Select manga
- Select chapter
- Continue to upload

---

## 6️⃣ Upload Pages Screen

### Purpose

Allow translators to upload manga pages.

### Key UI Components

- Drag & drop upload area
- Image preview grid
- Page index labels
- Reorder via drag & drop

### Actions

- Upload multiple images
- Reorder pages
- Start upload job

---

## 7️⃣ Upload Progress Screen

### Purpose

Display progress of async upload jobs.

### Key UI Components

- Progress bar (% uploaded)
- Uploaded pages counter
- Upload status badge (Uploading / Completed / Failed / Cancelled)
- Cancel upload button

### Actions

- Monitor upload
- Cancel upload
- Retry failed uploads

---

## 8️⃣ Draft Preview Screen

### Purpose

Allow translators to review uploaded translations before publishing.

### Key UI Components

- Reader-like preview (same as Reader Screen)
- Translation metadata (name, notes)
- Edit metadata button
- Reorder pages button

### Actions

- Preview pages
- Edit notes or title
- Reorder pages
- Proceed to publish

---

## 9️⃣ Publish Confirmation Screen

### Purpose

Confirm final publication of a translation.

### Key UI Components

- Summary of translation
- Warning message (public visibility)
- Publish button
- Cancel / Back button

### Actions

- Publish translation
- Return to manga detail

---

## 🔟 Manage Translations Screen (Translator Dashboard)

### Purpose

Allow translators to manage all their translations.

### Key UI Components

- List of translations
- Status badges (Draft / Published / Hidden)
- Action menu (Edit / Delete / Preview)

### Actions

- Edit translation
- Delete translation
- View upload status

---

## 1️⃣1️⃣ Moderation Review Screen

### Purpose

Allow moderators to review and manage translations.

### Key UI Components

- Translation list with status
- Translation preview
- Moderation actions (Hide / Delete)

### Actions

- Review translation
- Hide or remove translation

---

## 1️⃣2️⃣ Empty & Error States

### Empty States

- No translations available
- No chapters available
- No uploads in progress

### Error States

- Upload failed
- Network error
- Permission denied

---

## 1️⃣3️⃣ UX & Design Guidelines

- Mobile-first design
- Minimal UI while reading
- Clear status indicators
- Non-blocking upload experience
- Consistent navigation patterns

---

## 1️⃣4️⃣ Future Screen Extensions

- Translation rating screen
- Comment section per translation
- Offline reading manager
- Group / scanlation team management

---

**End of UI Screens Document**
