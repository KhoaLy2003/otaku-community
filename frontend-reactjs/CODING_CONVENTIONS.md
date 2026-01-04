# Coding Conventions

This document outlines the coding conventions and best practices to be followed when contributing to the Otaku Community frontend codebase.

## Table of Contents

- [Folder Structure](#folder-structure)
- [Component Conventions](#component-conventions)
- [State Management](#state-management)
- [Styling](#styling)
- [Naming Conventions](#naming-conventions)
- [TypeScript Usage](#typescript-usage)
- [API Interaction](#api-interaction)
- [Testing](#testing)
- [Linting and Formatting](#linting-and-formatting)
- [Git Workflow](#git-workflow)

## Folder Structure

The project follows a feature-based folder structure.

```
src/
├── api/         # API client and related files (if any)
├── assets/      # Static assets like images, fonts
├── components/  # Reusable UI components, organized by feature/domain
├── constants/   # Application-wide constants
├── contexts/    # React context providers
├── hooks/       # Custom React hooks
├── lib/         # Core libraries, utilities, and API service definitions
├── pages/       # Page components corresponding to routes
├── store/       # Global state management stores (Zustand)
├── types/       # TypeScript type definitions
├── App.tsx      # Root application component
├── main.tsx     # Application entry point
└── index.css    # Global styles
```

-   **`components/`**: Components are organized by feature (e.g., `auth`, `profile`, `posts`). Shared or generic components go into `components/ui`.
-   **`lib/api/`**: Each file corresponds to a set of API endpoints for a specific resource (e.g., `users.ts`, `posts.ts`).
-   **`pages/`**: Each file represents a page that is mapped to a route.
-   **`types/`**: Global TypeScript types. Types specific to a feature can be co-located with the feature.

## Component Conventions

-   **Functional Components:** All components must be functional components using React Hooks.
-   **TypeScript:** All components must be written in TypeScript (`.tsx`).
-   **Props:**
    -   Define props using TypeScript interfaces.
    -   Props interfaces should be named `[ComponentName]Props`.
    -   Example: `interface PostCardProps { post: Post; }`
-   **Component Structure:**
    ```tsx
    import React from 'react';

    interface MyComponentProps {
      title: string;
    }

    const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
      // Component logic here

      return (
        <div>
          <h1>{title}</h1>
        </div>
      );
    };

    export default MyComponent;
    ```
-   **File Naming:** Component files should be named using PascalCase (e.g., `MyComponent.tsx`).

## State Management

We use a combination of React Hooks, Context API, and Zustand for state management.

-   **Local State:** For component-specific state, use `useState` and `useReducer`.
-   **Shared State (Small to Medium):** For state shared between a few components, use the React Context API. See `src/lib/contexts/AuthContext.tsx` for an example.
-   **Global State (Large/Complex):** For application-wide state that changes frequently, use Zustand. It provides a simple and scalable solution. See `src/store/useNotificationStore.ts`.

## Styling

-   **Tailwind CSS:** We use Tailwind CSS for all styling. Avoid writing custom CSS files as much as possible.
-   **`cn` Utility:** Use the `cn` utility from `src/lib/cn.ts` to conditionally apply classes.
-   **No CSS-in-JS libraries:** We are not using Styled Components, Emotion, etc.

## Naming Conventions

-   **Variables and Functions:** `camelCase` (e.g., `const userProfile = ...`, `function getUser() {}`).
-   **Components:** `PascalCase` (e.g., `PostCard`, `UserProfile`).
-   **Files and Directories:**
    -   Components: `PascalCase` (e.g., `UserProfile.tsx`).
    -   Other files (hooks, utils, types): `camelCase` (e.g., `useAuth.ts`, `AuthContext.tsx`).
-   **TypeScript Interfaces:** `PascalCase`. For component props, use `[ComponentName]Props`. For other types, use descriptive names (e.g., `UserProfile`, `Post`).

## TypeScript Usage

-   **Strict Mode:** The project runs in strict mode. Address any TypeScript errors.
-   **Type Everything:** Provide types for all variables, function parameters, and return values.
-   **`any`:** Avoid using the `any` type. Use `unknown` for values that are truly unknown and perform type checking.
-   **Type Definitions:** Global types are in `src/types`. Feature-specific types can be co-located.

## API Interaction

-   **API Client:** All API requests should go through the API client defined in `src/lib/api/client.ts`.
-   **API Services:** API calls are organized into service files in `src/lib/api/`. For example, all user-related API calls are in `src/lib/api/users.ts`.
-   **Data Fetching:** It is recommended to use a library like `react-query` or SWR for data fetching, caching, and state management of server state.
-   **Environment Variables:** API base URLs and other sensitive information should be stored in environment variables. See `.env.example`.

## Testing

-   **Jest & React Testing Library:** Write unit and integration tests for components, hooks, and utility functions.
-   **Test File Location:** Test files should be located in a `__tests__` directory within the component/feature directory, with the `.test.tsx` extension.
-   **Coverage:** Aim for high test coverage for critical parts of the application.

## Linting and Formatting

-   **ESLint:** The project is configured with ESLint for static code analysis. Run `npm run lint` to check for issues.
-   **Formatting:** We use a code formatter (like Prettier) for consistent code style. Configure your editor to format on save.
-   **CI/CD:** Linting and formatting checks should be part of the CI/CD pipeline.

## Git Workflow

-   **Branching:**
    -   `main`: The main branch, which is always deployable.
    -   `develop`: The development branch where features are merged.
    -   Feature branches: `feature/your-feature-name`
    -   Bugfix branches: `fix/your-bug-name`
-   **Commits:**
    -   Write clear and concise commit messages.
    -   Follow the Conventional Commits specification (e.g., `feat: add user profile page`, `fix: correct login redirection`).
-   **Pull Requests (PRs):**
    -   All changes must be submitted through a PR to the `develop` branch.
    -   PRs should be reviewed by at least one other team member before merging.
    -   Ensure all tests and lint checks pass before merging.
