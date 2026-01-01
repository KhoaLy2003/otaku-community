# Task: Enhance UI/UX Experience for Social Media Platform

You are a senior product-focused frontend engineer working closely with backend APIs.

Your task is to **enhance the user experience and implement new UI features** for a social media application, following familiar behaviors from platforms like **Facebook and Twitter (X)**.

---

## 1️⃣ Home Tab – Reload Feed Behavior

### Objective

When a user clicks the **Home tab** in the main navigation menu:

- If the user is **already on the Home page**:
  - Scroll the feed to the top
  - Re-fetch the latest posts
  - Reset cursor-based pagination
- If the user is on a **different page**:
  - Navigate to Home
  - Load the feed normally

### UX Expectations

- Behavior should feel identical to Facebook:
  - Clicking "Home" acts as a **soft refresh**
- Avoid full page reload
- Show loading indicator or skeleton during refresh

### Technical Notes

- Clear existing feed state
- Re-trigger feed query
- Ensure idempotent behavior when clicking multiple times rapidly

---

## 2️⃣ Profile Page – Display User Interests

### Objective

Enhance the **Profile page** by displaying user interests.

### UI Requirements

- Display interests as:
  - Chips / tags / pills
- Position:
  - Under bio section
  - Or in a dedicated "Interests" section
- Max visible interests: 5–8
- Overflow handling:
  - "Show more" expands the list

### Data Requirements

- Interests come from user profile data
- Interests are read-only for visitors
- Editable by the profile owner (see section 3)

### UX Guidelines

- Clickable (optional): navigate to topic / interest page
- Consistent styling with existing topic tags

---

## 3️⃣ Edit Profile Feature

### Objective

Allow users to edit their own profile information.

### Entry Points

- "Edit profile" button on own profile page
- Button visible **only when viewing own profile**

---

### Editable Fields

Based on API documentation (`doc/api/user.md`, section **### 2. Update User Profile**):

- username
- bio
- interests
- location

---

### UI Flow

1. User clicks **Edit profile**
2. Open modal or dedicated edit page
3. Pre-fill form with existing user data
4. Client-side validation (length, format)
5. Submit changes
6. Update UI optimistically
7. Handle error states gracefully

---

### API Integration

- Use the **Update User Profile API**
- Handle:
  - Loading state
  - Success feedback (toast/snackbar)
  - Validation errors from backend

---

## 🧪 Edge Cases

- Cancel edit without saving
- Avatar / cover upload failure
- Network error during update
- Concurrent updates from another session

---

## 🎨 UX & UI Quality Bar

- Smooth transitions and animations
- Skeleton loaders instead of spinners where possible
- Consistent spacing, typography, and colors
- Mobile-friendly design

---

## 📦 Deliverables

- UI component structure
- State management approach
- Event flow for Home tab reload
- API integration example for Update Profile
- UX rationale for design decisions

---

Please implement with clean, maintainable, and scalable code.
Prioritize user experience and behavioral consistency with major social networks.
