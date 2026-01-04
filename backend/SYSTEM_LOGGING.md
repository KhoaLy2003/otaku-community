# 📊 System Logging Documentation

This document outlines the architecture, best practices, and usage of the system logging layer in the Otaku Community backend.

## 🏗️ Architecture

System logging is implemented as a **cross-cutting concern** using **Spring AOP**. This ensures that logging logic is decoupled from business logic and does not interfere with database transactions.

- **Core Aspect**: `com.otaku.community.common.logging.LoggingAspect`
- **Main Annotation**: `@LogExecutionTime`

### Advice Types Used

- `@Around`: For measuring execution time and logging API request/response metadata.
- `@AfterThrowing`: For centralized exception tracing across all feature modules.

---

## 🛠️ Usage

### Logging Method Execution Time

To track the performance of a specific method, annotate it with `@LogExecutionTime`:

```java
@Service
public class MyService {
    @LogExecutionTime
    public void performComplexTask() {
        // Business logic
    }
}
```

### API Request/Response Logging

All classes annotated with `@RestController` are automatically logged. This includes:

- HTTP Method and URI
- Client IP Address
- Target Controller and Method
- Execution Duration
- Failure reason (if any)

---

## ✅ Best Practices

1.  **Log Levels**:
    - `INFO`: Use for high-level flow tracking (e.g., API entry/exit, key lifecycle events).
    - `DEBUG`: Use for detailed technical info useful during development.
    - `WARN`: Use for non-critical failures or unexpected behavior that doesn't crash the request.
    - `ERROR`: Use for exceptions and critical failures requiring immediate attention.
2.  **Sensitive Data Masking**:
    - Never log passwords, tokens, or PII (Personally Identifiable Information) in plain text.
    - The current `LoggingAspect` only logs metadata (URI, Method) to avoid accidental leak of request bodies.
3.  **Avoiding Log Noise**:
    - Do not log inside loops.
    - Use specific pointcuts to avoid logging trivial methods (e.g., getters/setters).
4.  **Performance**:
    - Keep AOP advice thin.
    - Avoid heavy string concatenation; use SLF4J placeholders (e.g., `log.info("User {} logged in", userId)`).

---

## ⚠️ Common Pitfalls

- **Over-logging**: Logging every single line makes it impossible to find relevant information. Use AOP for structural logging.
- **Transactional Dependency**: Never perform database writes inside a logging aspect. System logs should go to `stdout` or a file.
- **Mixing Concerns**: Do not use system logs for user activity history or auditing. Use the dedicated Activity Log system for business-related events.
- **Exception Silencing**: Ensure that logging an exception does not "swallow" it. The `LoggingAspect` re-throws the exception after logging.
