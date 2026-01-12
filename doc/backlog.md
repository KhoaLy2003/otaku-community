# Product Backlog

## User Stories

### Authentication & User Management

- [x] **US-AUTH-001: User Registration**

  - **As a** new visitor
  - **I want** to create an account
  - **So that** I can access the platform
  - _Acceptance Criteria:_ Validates email/username/password, creates account, logs in automatically.

- [x] **US-AUTH-002: User Login**

  - **As a** registered user
  - **I want** to log in
  - **So that** I can access my account
  - _Acceptance Criteria:_ Validates credentials, issues JWT tokens (access+refresh).

- [x] **US-AUTH-003: User Logout**

  - **As a** logged-in user
  - **I want** to log out
  - **So that** I can secure my account
  - _Acceptance Criteria:_ Invalidates session, clears tokens.

- [x] **US-AUTH-004: Session Management**

  - Access token expires in 1h, refresh token in 7d.
  - Auto-refresh mechanism.

- [x] **US-AUTH-005: Password Requirements**
  - Min 8 chars, uppercase, lowercase, number. Real-time validation.

### Post Management

- [x] **US-POST-001: Create Post**

  - **As a** user
  - **I want** to create posts with text and images
  - **So that** I can share content
  - _Acceptance Criteria:_ Title required, image upload preview/delete, draft saving.

- [x] **US-POST-002: Comment Post**

  - **As a** user
  - **I want** to comment on posts
  - **So that** I can discuss content
  - _Acceptance Criteria:_ Add/edit/delete comments, reply to comments.

- [x] **US-POST-003: Share Post**

  - **As a** user
  - **I want** to share posts
  - **So that** I can distribute content
  - _Acceptance Criteria:_ Copies link to clipboard.

- [x] **US-POST-004: Post Detail**
  - **As a** user
  - **I want** to view full post details
  - **So that** I can see comments and interact
  - _Acceptance Criteria:_ Shows full content, images, topic, comments.

### [Other Features]

- [ ] **Feed System** (Home, Explore, Topic feeds)
- [ ] **User Profile** (View profile, follow user)
- [ ] **Notifications** (Like, comment, follow alerts)
- [ ] **Chat/Messaging** (MVP exclusion?) (Refer to scope in vision.md)

## Bugs

- [ ] (Empty)

## Technical Tasks

- [ ] Migrate API documentation to new structure
- [ ] Verify API endpoints against server code
