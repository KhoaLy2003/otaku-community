# Code Review Checklist

This document outlines the key points to review during the code review process, based on the current tech stack. The checklist is divided into **Backend** and **Frontend** sections for clarity and responsibility separation.

---

## 🔧 Backend Code Review (Java 17 – Spring Boot 3.2.1)

### 1. Project Structure & Architecture

- Clear separation of layers (Controller / Service / Repository / DTO / Mapper)
- Consistent package naming and responsibility boundaries
- Avoid business logic in controllers
- Proper use of interfaces for services where applicable

### 2. API Design & REST Principles

- RESTful endpoint naming and HTTP method usage
- Proper request/response models (DTOs, not entities)
- Pagination, sorting, and filtering handled consistently
- Meaningful and standardized API responses

### 3. Security (Spring Security + Auth0)

- Correct JWT validation and configuration
- Proper role/permission checks at method or endpoint level
- Avoid exposing sensitive data in responses
- Ensure public vs protected endpoints are clearly defined

### 4. Validation & Error Handling

- Request validation using annotations (e.g. `@NotNull`, `@Size`)
- Centralized exception handling (`@ControllerAdvice`)
- Meaningful and consistent error messages
- Proper HTTP status codes returned

### 5. Data Access (Spring Data JPA + PostgreSQL)

- Efficient queries (avoid N+1 problems)
- Correct use of lazy vs eager fetching
- Proper indexing considerations
- Transactions used where required

### 6. DTO Mapping (MapStruct)

- No manual mapping where MapStruct is applicable
- Clear separation between Entity and DTO models
- Mapping logic kept out of service/business logic

### 7. Media Handling (Cloudinary)

- Validation of media type and size before upload
- Secure handling of media URLs
- Cleanup strategy for unused media if applicable

### 8. API Documentation (Springdoc OpenAPI)

- Endpoints properly documented
- Request/response schemas accurate
- Security requirements documented

### 9. Configuration & Environment

- Sensitive configs stored securely (env variables)
- No secrets committed to source control
- Profiles (dev/staging/prod) correctly configured

### 10. Code Quality & Maintainability

- Meaningful class, method, and variable names
- No commented-out or dead code
- Proper logging (avoid excessive or missing logs)
- Unit and integration test coverage

---

## 🎨 Frontend Code Review (React 18 – Vite – TypeScript)

### 1. Project Structure & Organization

- Logical folder structure (features, components, hooks, services)
- Reusable components extracted appropriately
- Clear separation between UI and business logic

### 2. Type Safety (TypeScript)

- Avoid usage of `any`
- Proper typing for API responses and props
- Shared types/interfaces where applicable

### 3. State Management (Zustand)

- Global state only used when necessary
- Clear store structure and naming
- Avoid unnecessary re-renders

### 4. Data Fetching (TanStack Query)

- Proper query keys and cache management
- Error and loading states handled
- Mutations correctly invalidate or update cache

### 5. Authentication (Auth0 React SDK)

- Protected routes implemented correctly
- Token handling done securely
- Avoid exposing auth-related data unnecessarily

### 6. Routing (React Router)

- Route structure is clear and maintainable
- Lazy loading used where appropriate
- Proper handling of 404 / unauthorized routes

### 7. Validation (Zod)

- Forms validated consistently
- Server-side validation errors handled gracefully
- Clear user feedback on validation failures

### 8. UI & Styling (Tailwind CSS)

- Consistent design system usage
- Avoid excessive inline utility clutter
- Responsive design considerations
- Accessibility (ARIA, keyboard navigation)

### 9. Performance

- Avoid unnecessary re-renders
- Proper use of memoization (`useMemo`, `useCallback`)
- Code splitting and lazy loading where needed

### 10. Error Handling & UX

- Global error handling strategy
- Meaningful error messages for users
- Loading and empty states implemented

### 11. Code Quality & Maintainability

- Clear and consistent naming
- Components are not overly complex
- No unused imports or dead code
- ESLint and formatting rules respected

---

## ✅ General Review Notes

- Consistency across backend and frontend conventions
- Clear commit messages and PR descriptions
- Code is readable and understandable by other team members
- Edge cases and failure scenarios considered

---

_This checklist should be used as a guideline, not a rigid rule set, and can be adapted as the project evolves._
