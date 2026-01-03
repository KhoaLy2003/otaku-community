# 📄 Feature Specification: User Settings (Phase 1)

## 1️⃣ Feature Overview

- **Feature Name**: User Settings
- **Description**:
  Allows users to manage basic account, privacy, security, and activity-related preferences to control how their profile is displayed, how their account is accessed, and how their actions are tracked.
- **Status**: Draft

---

## 2️⃣ User Stories

| ID             | As a            | I want to                        | So that                                     |
| -------------- | --------------- | -------------------------------- | ------------------------------------------- |
| **US-SET-001** | Registered User | Update my avatar and cover image | My profile reflects my identity             |
| **US-SET-002** | Registered User | Control who can view my profile  | I can protect my privacy                    |
| **US-SET-003** | Registered User | View my login history            | I can detect suspicious account activity    |
| **US-SET-004** | Registered User | View my account activity log     | I can track actions performed on my account |

---

## 3️⃣ Acceptance Criteria (AC)

### 3.1. User Interface & Layout

- User Settings page contains separate sections:

  - **Profile**
  - **Privacy**
  - **Security**
  - **Data & Activity**

- Profile section allows:

  - Upload avatar image
  - Upload cover image
  - Preview changes before saving

- Privacy section includes:

  - A dropdown or radio group for profile visibility

- Security section displays:

  - A list/table of login history entries

- Data & Activity section displays:

  - A chronological list of user actions

- Loading and empty states are clearly indicated

---

### 3.2. Business Logic & Validation

#### Profile Update

- Only image files are allowed for avatar and cover
- Maximum file size is enforced (e.g., ≤ 5MB)
- Uploaded images are stored and linked to the user profile
- Profile updates take effect immediately after saving

#### Profile Visibility

- Visibility options include:

  - **Public**: anyone can view the profile
  - **Followers Only**: only followers can view the profile
  - **Private**: only the user can view the profile

- Visibility rules are enforced consistently across profile pages and APIs

#### Login History

- Login history records include:

  - Timestamp
  - IP address
  - Device / browser information

- Only the account owner can view their login history

#### Activity Log

- Activity log includes key user actions (e.g., login, logout, profile update)
- Logs are read-only and cannot be modified by the user
- Entries are sorted by newest first

---

## 4️⃣ Technical Specifications

### 4.1. API Architecture

**Endpoints**

- `PUT /api/v1/users/me/profile`

  - Update avatar and cover image

- `PUT /api/v1/users/me/privacy`

  - Update profile visibility setting

- `GET /api/v1/users/me/security/login-history`

  - Retrieve login history

- `GET /api/v1/users/me/activity-log`

  - Retrieve user activity log

**Response Model (Example)**

```json
{
  "success": true,
  "data": {
    "updatedAt": "timestamp"
  }
}
```

---

### 4.2. Database Schema

**Table: users**

- avatar_url
- cover_image_url
- profile_visibility

**Table: login_history**

- id
- user_id
- ip_address
- user_agent
- created_at

**Table: activity_logs**

- id
- user_id
- action_type
- metadata
- created_at

**Indexes**

- `idx_login_history_user_id`
- `idx_activity_logs_user_id`

---

## 5️⃣ Performance & Security

- All settings APIs require valid JWT authentication
- Users can only access their own settings data
- File uploads are validated and sanitized
- Activity and login history APIs are read-only
- API response time target ≤ 500ms

---

## 6️⃣ Edge Cases & Error Handling

- Unsupported file type → `400 Bad Request`
- File size exceeds limit → validation error message
- Unauthorized access → `401 Unauthorized`
- Accessing another user's settings → `403 Forbidden`
- Empty login history or activity log → show empty state UI

---
