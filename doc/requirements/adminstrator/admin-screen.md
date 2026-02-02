# 🖥 UI Screens Specification – Administrator Panel

This document describes the **UI screens** required for the Administrator Panel, covering User Management, Content Moderation, Database Management, and System Configuration.

---

## 1️⃣ Screen Overview Map

```text
Admin Panel Layout (Sidebar + Content Area)
 ├─ Dashboard (Overview)
 ├─ User Management
 │   ├─ User List (Filter/Search)
 │   └─ User Detail & Actions (Edit Role, Ban)
 ├─ Content Moderation
 │   ├─ Report Queue
 │   └─ Translation Review Queue
 ├─ Database Management
 │   ├─ Manga/Anime List
 │   └─ Edit Metadata Form
 ├─ Translator Management
 │   └─ Leaderboard & Badges
 └─ System Settings
     ├─ General Config
     └─ CMS / Announcements
```

---

## 2️⃣ Admin Dashboard

### Purpose

Provide a high-level overview of system health, recent activity, and pending tasks.

### Key UI Components

- **Metric Cards**: Total Users, New Users (24h), Active Posts, Pending Reports.
- **Activity Questions**: Quick links to "Review Translation (5)", "Handle Reports (3)".
- **Growth Chart**: Line chart showing user signups/activity over the last 30 days.
- **Recent Audit Logs**: Brief list of recent admin actions.

### Actions

- Navigate to specific management sections.
- Change dashboard date range filter.

---

## 3️⃣ User Management Screen

### Purpose

Search, filter, and manage user accounts and permissions.

### Key UI Components

- **Search Bar**: Search by username, email, or user ID.
- **Filters**: Role (Admin, Mod, User), Status (Active, Banned), Join Date.
- **User Data Table**: Columns for Avatar, Username, Email, Role, Status, Join Date, Actions.
- **Action Menu** (per row): Edit Role, Ban/Unban, Reset Password, View Activity.

### Actions

- Search and filter users.
- Open "Edit User" modal/drawer.
- Bulk actions (if supported): Suspend selected users.

---

## 4️⃣ User Detail & Edit Screen

### Purpose

View in-depth user info and perform sensitive account actions.

### Key UI Components

- **Profile Header**: Avatar, Username, ID, Badges.
- **Stats**: Total Posts, Comments, Translations, Likes Received.
- **Status Toggles**: Account Locked, Banned (with optional reason text field).
- **Role Selector**: Dropdown to change user role.
- **Activity Log Tab**: List of recent user actions (logins, posts).

### Actions

- Save changes to role/status.
- Force password reset email.
- Send official warning message.

---

## 5️⃣ Content Moderation Screen (Report Queue)

### Purpose

Review and resolve user-submitted reports for posts, comments, and other content.

### Key UI Components

- **Report List**:
  - **Reported Content**: Snippet of the reported text/image.
  - **Reason**: Spam, Harassment, Custom reason.
  - **Reporter**: Username of the person who reported.
  - **Status**: Pending, Reviewed, Dismissed.
- **Content Preview Modal**: Full view of the reported content in context.
- **Action Buttons**: Keep (Dismiss), Delete Content, Ban Author.

### Actions

- Filter reports by status or type.
- Take moderation action.
- Bulk dismiss frivolous reports.

---

## 6️⃣ Database Management Screen (Manga/Anime)

### Purpose

Curate the central library of Anime and Manga titles.

### Key UI Components

- **Library Table**: Thumbnails, Titles, Type (Manga/Anime), Status (Publishing/Finished).
- **Add New Button**: Opens the creation form.
- **Edit Form**:
  - **Cover Image Upload**.
  - **Metadata Inputs**: Title, Alt Titles, Synopsis, Release Year.
  - **Relation Selectors**: Linked Authors, Artists, Genres.
  - **External Links**: MAL ID, AniList ID.
  - **Lock Toggle**: Prevent non-admin edits.

### Actions

- Create new entry.
- Update existing metadata.
- Merge duplicate entries (advanced).

---

## 7️⃣ Translator Management Screen

### Purpose

Oversee translation quality and acknowledge top contributors.

### Key UI Components

- **Leaderboard Table**: Rank, Translator Name, Total Uploads, Total Views, Reputation Score.
- **Badge Management**: Interface to assign badges (Top Translator, Quality Approved) to users.
- **Action Menu**: View Uploads, Suspend Upload Privileges.

### Actions

- Grant/Revoke badges.
- Adjust reputation manually (Super Admin only).

---

## 8️⃣ System Settings & CMS

### Purpose

Configure global platform behavior and content.

### Key UI Components

- **Feature Flags**: Toggles for "Maintenance Mode", "New User Registration", "Comment System".
- **Limits Config**: Inputs for Max Upload Size, Daily Post Limit.
- **Announcement Banner**: Text input and active toggle for site-wide alerts.
- **CMS Editor**: Rich text editor for "About", "Privacy Policy", "Terms" pages.

### Actions

- Save global config.
- Publish/Unpublish announcements.
- Update static page content.

---

## 9️⃣ Empty & Error States

### Empty States

- "No users found matching filters."
- "Great job! Zero pending reports."
- "Activity log is empty."

### Error States

- "Action Failed: You cannot ban a Super Admin."
- "Update Failed: Database connection error."
- "Permission Denied: You do not have access to this section."

---

## 🔟 UX & Design Guidelines

- **Professional & Dense**: Admin screens should show more density than consumer screens for efficiency.
- **Destructive Confirmations**: Always require a confirmation modal for banning users or deleting content.
- **Clear Feedback**: Toast notifications for all success/error actions.
- **Audit Trail visibility**: When taking an action, show that it will be logged.
