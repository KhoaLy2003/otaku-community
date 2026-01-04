# 📄 Prompt: System Logging Architecture

You are a **Senior Backend Engineer / Platform Architect** responsible for designing a **robust, high-performance system logging architecture** for a Spring Boot monolithic application.

---

## 📌 Context

The system currently:

- Uses standard logging frameworks (Logback / SLF4J)
- Logs are scattered and inconsistent
- Lacks centralized control over:
  - Execution time logging
  - Exception tracing
  - Request / response visibility
- Logging is sometimes mixed with business logic

System logging is used **only for developers & operators**, not for product features.

---

## 🎯 Objectives

Design a **clean and scalable system logging solution** that:

1. Treats logging as a **pure cross-cutting concern**
2. Has **zero business meaning**
3. Does **NOT interact with database transactions**
4. Is **high-performance** and safe for high-frequency execution
5. Is easy to evolve for monitoring & observability

---

## 🧩 Logging Scope (System Logging Only)

System logs include:

- Method execution time
- API request / response metadata
- Exceptions and stack traces
- Infrastructure or integration errors
- Performance metrics

❌ Excludes:

- User activity history
- Audit / compliance logs
- Business event tracking

---

## 🛠️ Required Technical Approach

### 1. Core Mechanism: Spring AOP

System logging **must be implemented using AOP**, not Domain Events.

Reasons:

- No business meaning
- No transactional dependency
- Very high execution frequency
- Must remain lightweight

---

### 2. AOP Design Rules (Strict)

- AOP advice must:
  - Be thin and deterministic
  - Never perform database writes
  - Never start or manage transactions
  - Never publish domain events
- Logging output must go to:
  - File / stdout
  - Centralized logging systems (ELK, Loki, Cloud)

---

### 3. Recommended Advice Types

| Use Case                   | Advice Type                  |
| -------------------------- | ---------------------------- |
| Execution time measurement | `@Around`                    |
| Exception logging          | `@AfterThrowing`             |
| Request lifecycle logging  | `@Around` (Controller layer) |

---

### 4. Execution Model

```text
Caller Thread
   ↓
Spring Proxy (AOP)
   ↓
System Log (logger.info / error)
   ↓
Target Method
```

- Logging runs **in the same thread**
- No async required by default
- No dependency on transaction outcome

---

## 📐 Deliverables

Provide:

1. High-level architecture explanation
2. Example AOP aspect for:

   - Method execution time
   - Exception logging

3. Best practices:

   - Log levels
   - Sensitive data masking
   - Avoiding log noise

4. Common pitfalls:

   - Over-logging
   - Logging inside loops
   - Mixing system logs with activity logs

---

## 🚫 Constraints

- Do NOT use Domain Events
- Do NOT persist logs to database
- Do NOT couple logging with business logic

---

## 🧠 Final Goal

Deliver a **clean, maintainable, and performant system logging layer**
that supports debugging, monitoring, and operations without affecting
business correctness or system throughput.

---
