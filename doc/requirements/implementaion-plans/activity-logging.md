# 🎯 Prompt: Activity Logging with Domain Events & Async Processing

You are a **Senior Backend Engineer / System Architect** designing a **User Activity Logging system** for a Spring Boot monolithic application.

This system powers **product-facing features**, not developer diagnostics.

---

## 📌 Context

Current implementation:

- LoggingService is injected into many services
- Logging is executed synchronously
- Business logic is tightly coupled with logging
- Performance is impacted under high traffic

User activity logs are stored in the database and exposed to users (Activity Log, Login History, etc.).

---

## 🎯 Objectives

Redesign the user activity logging system to:

1. Fully **decouple business logic from logging**
2. Guarantee **transactional correctness**
3. Execute logging **asynchronously**
4. Ensure logs are **complete, accurate, and trustworthy**
5. Remain extensible for notifications, analytics, audit logs

---

## 🧩 Scope: User Activity Logging Only

Examples:

- Login / Logout
- Update avatar / cover image
- Like / Unlike
- Follow / Unfollow
- Change privacy settings

Characteristics:

- Has **business meaning**
- Stored in database
- May be shown to users
- Must reflect only **committed actions**

---

## 🛠️ Core Architecture (Mandatory)

### 1. Domain Event–Driven Design

- Business services:
  - MUST NOT call logging services directly
  - MUST ONLY publish domain events
- Events represent: **“something meaningful happened”**

---

### 2. Single Generic Activity Event (Required)

❌ Avoid one-event-per-action

✅ Use a generic event with metadata:

```java
ActivityEvent {
  userId
  action
  targetType
  targetId
  metadata
}
```

Benefits:

- Extensible
- Fewer classes
- Multiple consumers possible

---

### 3. Transaction-Safe Event Handling

All activity logs must be persisted using:

```java
@Async
@TransactionalEventListener(phase = AFTER_COMMIT)
```

Guarantees:

- Event fires only after successful commit
- Logging failure does NOT rollback business
- Main request thread returns immediately

---

### 4. Clear Responsibility Split

```text
Service / Domain
   ↓
Publish ActivityEvent
   ↓
AFTER_COMMIT
   ↓
Async Listener
   ↓
Persist Activity Log
```

Rules:

- No DB writes in service for logging
- No DB writes in aspects
- Listener owns persistence

---

### 5. Role of AOP (Optional, Controlled)

AOP may be used ONLY as a **trigger mechanism**.

Allowed:

- Replace repetitive `publishEvent()` calls
- Simple, mechanical actions

Strict rules:

- Aspect must be thin
- Aspect must NOT persist logs
- Aspect must ONLY publish ActivityEvent

---

### 6. Failure & Consistency Model

- Logging is **eventually consistent**
- Listener exceptions:

  - Must be caught
  - Must be logged internally
  - Must NOT affect user response

- No retries required unless explicitly stated

---

## 📐 Deliverables

Provide:

1. Architecture explanation
2. Sequence flow (action → event → async logging)
3. Code examples:

   - ActivityEvent
   - Event publishing
   - Async AFTER_COMMIT listener

4. Best practices:

   - What to log / what not to log
   - Avoid high-frequency read logging
   - Metadata design

---

## 🚫 Constraints

- Do NOT mix with system logging
- Do NOT log inside controllers
- Do NOT persist logs synchronously
- Do NOT introduce message queues (optional only)

---

## 🧠 Final Goal

Deliver a **high-performance, transaction-safe, and decoupled**
User Activity Logging system that accurately reflects what users did,
without impacting business performance or correctness.

---
