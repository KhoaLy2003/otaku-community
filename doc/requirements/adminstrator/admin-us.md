# 📄 Feature Specification: Administrator Dashboard & Tools

## 1️⃣ Feature Overview

- **Feature Name**: Administrator Dashboard & Tools
- **Description**: A comprehensive suite of tools for Admins to manage users, moderate content (posts, comments, translations), maintain the manga/anime database, oversee translators, and configure system settings.
- **Status**: Draft

---

## 2️⃣ User Stories

### User & Permission Management

| ID           | As a  | I want to                                         | So that                                                 | Status  |
| :----------- | :---- | :------------------------------------------------ | :------------------------------------------------------ | :------ |
| **US-A-001** | Admin | view a paginated list of all users                | I can find specific users to manage                     | Planned |
| **US-A-002** | Admin | filter users by role, status, or activity         | I can quickly locate specific user segments             | Planned |
| **US-A-003** | Admin | search for a user by username or email            | I can access a specific user's account details          | Planned |
| **US-A-004** | Admin | update a user's role (e.g., promote to Moderator) | I can delegate responsibilities or correct permissions  | Planned |
| **US-A-005** | Admin | ban or lock a user account                        | I can prevent abusive users from accessing the platform | Planned |
| **US-A-006** | Admin | view user profile details including activity logs | I can investigate suspicious behavior and status        | Planned |

### Content Moderation (Feed & Translations)

| ID           | As a  | I want to                                                       | So that                                                | Status  |
| :----------- | :---- | :-------------------------------------------------------------- | :----------------------------------------------------- | :------ |
| **US-A-007** | Admin | view a list of reported content (posts, comments, translations) | I can address community violations                     | Planned |
| **US-A-008** | Admin | delete or hide a post/comment                                   | I can remove toxic or spam content                     | Planned |
| **US-A-009** | Admin | review and approve/reject uploaded translations                 | quality standards are maintained before public release | Planned |
| **US-A-010** | Admin | flag a translation as "Verified" or "Quality Checked"           | readers know which content is trusted                  | Planned |
| **US-A-011** | Admin | rollback a translation to a previous version                    | I can undo vandalism or errors                         | Planned |

### Manga & Anime Database Management

| ID           | As a  | I want to                               | So that                                                  | Status  |
| :----------- | :---- | :-------------------------------------- | :------------------------------------------------------- | :------ |
| **US-A-012** | Admin | add new Anime or Manga entries manually | the database stays up-to-date with new releases          | Planned |
| **US-A-013** | Admin | edit metadata for existing Manga/Anime  | information like genres, authors, and status is accurate | Planned |
| **US-A-014** | Admin | merge duplicate database entries        | the content library remains organized and clean          | Planned |
| **US-A-015** | Admin | lock specific database entries          | unauthorized changes are prevented                       | Planned |

### Translator & Ranking Management

| ID           | As a  | I want to                                       | So that                                     | Status  |
| :----------- | :---- | :---------------------------------------------- | :------------------------------------------ | :------ |
| **US-A-016** | Admin | view the translator leaderboard and stats       | I can identify top contributors             | Planned |
| **US-A-017** | Admin | manually assign badges (e.g., "Top Translator") | meritorious users are recognized            | Planned |
| **US-A-018** | Admin | suspend a translator's upload privileges        | I can stop low-quality or malicious uploads | Planned |

### System Configuration & Analytics

| ID           | As a        | I want to                                                | So that                                                | Status  |
| :----------- | :---------- | :------------------------------------------------------- | :----------------------------------------------------- | :------ |
| **US-A-019** | Admin       | view a dashboard of key metrics (new users, posts, etc.) | I can monitor the platform's growth and health         | Planned |
| **US-A-020** | Admin       | manage system-wide announcements/banners                 | I can communicate important information to all users   | Planned |
| **US-A-021** | Admin       | configure global settings (e.g., upload limits)          | I can adjust platform behavior without code changes    | Planned |
| **US-A-022** | Super Admin | manage API keys and OAuth providers                      | the system's integrations remain secure and functional | Planned |

---

## 3️⃣ Acceptance Criteria (AC)

### AC for Critical User Stories

#### US-A-004 & US-A-005: User Role & Status Management

- Admin can select any registered user.
- Admin can change role to: User, Translator, Moderator, Admin.
- Changing a role takes effect immediately (or upon next login).
- Admin can toggle account status: Active, Locked, Banned.
- Banning a user requires providing a reason.
- Actions are logged in the admin audit log.

#### US-A-007 & US-A-008: Report Handling

- Reports are aggregated by target ID (post, comment, translation).
- Admin sees the reporter, reason, and timestamp.
- Admin can dismiss the report (keep content) or uphold it (remove content).
- Taking action on a report resolves it in the system.
- Original poster receives a notification if their content is removed.

#### US-A-012 & US-A-013: Database Editing

- Admin form includes all metadata fields: Title, Synopsis, Genres, Authors, Artists, Status, Cover Image.
- Edits to "Locked" entries require specific confirmation or higher privileges.
- Changes are versioned or logged to track who made the edit.

#### US-A-019: Analytics Dashboard

- Dashboard loads within 2 seconds.
- Metrics show data for: Today, Last 7 Days, Last 30 Days.
- Visual graphs for user growth and activity trends.
- Quick links to pending reports or approval queues.

---

## 4️⃣ Technical Specifications

### 4.1. API Architecture

- `GET /api/v1/admin/users`: List users with filtering/sorting
- `PATCH /api/v1/admin/users/{id}/role`: Update user role
- `POST /api/v1/admin/users/{id}/ban`: Ban user
- `GET /api/v1/admin/reports`: Fetch pending reports
- `POST /api/v1/admin/content/{id}/moderate`: Moderation action (hide/delete)
- `POST /api/v1/admin/manga`: Create/Update manga metadata

### 4.2. Security Permissions

- All `/api/v1/admin/**` endpoints are protected by `ROLE_ADMIN` or `ROLE_SUPER_ADMIN`.
- `ROLE_MODERATOR` has access to a subset (Reports, Content Moderation) but NOT User Management or System Config.

---

## 5️⃣ Edge Cases & Error Handling

- **Self-Ban Prevention**: Admins cannot ban or demote themselves.
- **Super Admin Protection**: Regular Admins cannot modify Super Admin accounts.
- **Concurrent Edits**: If two admins edit the same manga metadata, the last write wins (or implement locking).
- **Empty States**: Dashboard and lists should handle zero data gracefully (e.g., "No pending reports").
