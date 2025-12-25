# AI Prompt – Implement Update & Delete Post Feature

## Project Context

You are a **senior backend engineer** working on the **Otaku Community Project**.

The system is a social media platform similar to Facebook / Twitter (X), built with:

- Spring Boot
- JPA / Hibernate
- RESTful APIs
- Soft delete strategy

All API contracts are already defined and MUST be followed strictly.

📄 **API Documentation File**: doc/api/post.md

---

## 🎯 Objective

Implement the following features:

1. **Update Post**
2. **Delete Post**

The implementation must align with existing architecture, coding standards, and API specifications.

---

## 1️⃣ Delete Post Feature

### 📄 API Reference

- Section: `#### 3. Delete a Post`
- File: `doc/api/post.md`

### Requirements

- Implement **soft delete**
  - Set `deletedAt` timestamp
  - Do NOT physically remove the record
- Only the **post owner** is allowed to delete their post
- Validate:
  - Post exists
  - Post is not already deleted
- After deletion:
  - Post must NOT appear in:
    - Feed
    - User profile
    - Topic-based listing
    - Search results
- Return response exactly as defined in API documentation

### Error Handling

- `404 Not Found` → Post does not exist or already deleted
- `403 Forbidden` → User is not the post owner

---

## 2️⃣ Update Post Feature

### 📄 API Reference

- Section: `#### 2. Update a Post`
- File: `doc/api/post.md`

There are **TWO update scenarios** that must be handled.

---

## 🔄 Update Scenarios

### 🟢 Case 1: Update Post Information ONLY (No Image Change)

#### Description

User updates:

- Content (text)
- Topics
- Visibility / status (if supported)

Media (images/videos) remains unchanged.

#### Required Logic

- DO NOT call media upload API
- DO NOT delete or recreate existing media
- Only update:
  - `posts.content`
  - `posts.updatedAt`
  - `post_topics` (if topic list changes)
- Existing media records must remain untouched

---

### 🟠 Case 2: Update BOTH Information AND Image

### 📄 API References

- Update Post: `#### 2. Update a Post`
- Upload Media: `#### 1. Upload Media Files for a Post`

#### Description

User updates:

- Content
- Topics
- Media (image/video changed)

#### Required Flow

1. Detect that media has changed
2. Remove old media associations from the post
3. Upload new media using **Upload Media Files for a Post** API
4. Associate newly uploaded media with the post
5. Update post content and metadata

---

## 🧠 Media Change Detection Logic (MANDATORY)

You MUST implement logic to detect whether the user has changed media.

### Suggested Approaches (choose one):

- Compare incoming `mediaIds` with existing `post_media`
- Detect presence of `multipart/form-data` files
- Use an explicit flag (e.g. `hasMediaChanged`)

❗ **Important Rules**

- Do NOT re-upload media if the user did not change images
- Do NOT delete existing media unless replacement is confirmed

---

## 🔐 Security & Validation

Apply to BOTH Update and Delete:

- User must be authenticated
- User must be the **post owner**
- Post must exist and `deletedAt IS NULL`

### Validation Errors

- `404 Not Found` → Post not found
- `403 Forbidden` → User is not the owner
- `400 Bad Request` → Invalid input or state

---

## 🧱 Technical Constraints

- Reuse existing:
  - Entities
  - Repositories
  - DTOs
  - Exception handling mechanisms
- Follow:
  - Transactional boundaries
  - Naming conventions
  - Response format standards
- Ensure:
  - Operations are transactional
  - No N+1 query issues when updating topics or media

---

## 📦 Deliverables

The implementation must include:

1. Controller methods mapped to documented APIs
2. Service-layer business logic
3. Media update strategy implementation
4. Proper validation and error handling
5. Clean, production-ready code

---

## ✅ Quality Expectations

- No breaking changes to existing APIs
- Clear separation of concerns
- Fully compliant with `doc/api/post.md`
- Maintainable and scalable implementation

---

**End of AI Prompt**
