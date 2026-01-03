# 📄 User Settings – Feature List (Otaku Community)

## 1. Account & Profile Settings

| Feature             | Description (Short)                   | Priority | Notes                 |
| ------------------- | ------------------------------------- | -------- | --------------------- |
| Update Profile Info | Edit display name, bio, avatar, cover | High     | Core identity         |
| Change Email        | Update login email                    | High     | Auth-related          |
| Change Password     | Change account password               | High     | Security              |
| Link Social Account | Link/unlink Google, Facebook, etc.    | Medium   | Auth0                 |
| Deactivate Account  | Temporarily disable account           | Medium   | Reversible            |
| Delete Account      | Permanently remove account            | Low      | Data retention policy |

---

## 2. Privacy Settings

| Feature            | Description                  | Priority | Notes          |
| ------------------ | ---------------------------- | -------- | -------------- |
| Profile Visibility | Public / Followers / Private | High     | Profile access |
| Post Visibility    | Who can view posts           | High     | Feed filter    |
| Comment Permission | Who can comment              | Medium   | Anti-spam      |
| Message Permission | Who can message user         | Medium   | Chat system    |
| Hide Online Status | Hide active status           | Low      | UX enhancement |

---

## 3. Notification Settings

| Feature                    | Description                        | Priority | Notes           |
| -------------------------- | ---------------------------------- | -------- | --------------- |
| Global Notification Toggle | Enable / disable all notifications | High     | Master switch   |
| Like Notifications         | Notify when post is liked          | High     | Core engagement |
| Comment Notifications      | Notify when commented              | High     | Core engagement |
| Follow Notifications       | Notify when someone follows        | Medium   | Social graph    |
| In-app / Email Toggle      | Choose delivery channel            | Medium   | Multi-channel   |
| Mute Notifications         | Temporarily mute notifications     | Low      | DND support     |

---

## 4. Content & Feed Settings

| Feature                  | Description                        | Priority | Notes            |
| ------------------------ | ---------------------------------- | -------- | ---------------- |
| Feed Mode                | Latest / Popular / Following       | Medium   | Ranking logic    |
| Topic Preferences        | Prefer topics (anime, manga, game) | Medium   | Personalization  |
| Keyword Filter           | Hide posts by keyword              | Low      | Content filter   |
| Sensitive Content Filter | Hide NSFW / spoilers               | Medium   | Community safety |

---

## 5. Interaction & Social Settings

| Feature         | Description                   | Priority | Notes           |
| --------------- | ----------------------------- | -------- | --------------- |
| Block User      | Block user interactions       | High     | Safety          |
| Mute User       | Hide content without blocking | Medium   | UX              |
| Remove Follower | Remove follower from list     | Medium   | Private account |
| Follow Approval | Approve follower requests     | Low      | Private profile |

---

## 6. Security Settings

| Feature                   | Description            | Priority | Notes              |
| ------------------------- | ---------------------- | -------- | ------------------ |
| Two-Factor Authentication | Enable 2FA             | High     | Account protection |
| Login History             | View login activity    | Medium   | Transparency       |
| Active Sessions           | View / revoke sessions | Medium   | Security           |
| Logout All Devices        | Force logout           | Low      | Security           |

---

## 7. Language & Appearance

| Feature            | Description           | Priority | Notes         |
| ------------------ | --------------------- | -------- | ------------- |
| Language Selection | Choose UI language    | Medium   | i18n          |
| Theme Mode         | Light / Dark / System | Medium   | UX            |
| Font Size          | Adjust text size      | Low      | Accessibility |
| Reduce Motion      | Disable animations    | Low      | Accessibility |

---

## 8. Data & Activity

| Feature                | Description        | Priority | Notes        |
| ---------------------- | ------------------ | -------- | ------------ |
| Activity Log           | View user actions  | Medium   | Transparency |
| Download Personal Data | Export user data   | Low      | Compliance   |
| Clear Search History   | Remove search logs | Low      | Privacy      |
| Clear View History     | Reset viewed posts | Low      | Feed reset   |

---

## 9. Moderation & Safety (Optional)

| Feature           | Description                | Priority | Notes             |
| ----------------- | -------------------------- | -------- | ----------------- |
| Report History    | View reported content      | Low      | User awareness    |
| Content Warnings  | Show strike / warning info | Low      | Moderation system |
| Appeal Submission | Appeal moderation decision | Low      | Admin flow        |

---

## 10. Implementation Priority Summary

```text
High    : Profile, Privacy (basic), Notifications, Security
Medium  : Feed personalization, Social controls, Appearance
Low     : Data export, Advanced moderation, Accessibility extras
```

---

### 📌 Purpose of This File

* Feature inventory for **planning & roadmap**
* Input for **task breakdown / estimation**
* Reference for **API & DB design**
* Avoid over-design in early phases

---
