# Frontend Folder Structure

This document outlines the folder structure for the Otaku Community frontend application.

## Tech Stack
- **Next.js** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui**

## Folder Structure

```
frontend/
├── app/                          # Next.js App Router (pages & routes)
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (main)/                   # Main app route group
│   │   ├── feed/
│   │   ├── explore/
│   │   ├── topics/
│   │   ├── profile/
│   │   └── layout.tsx
│   ├── api/                      # API routes (if needed)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css               # Global styles
│
├── components/                    # React components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Navigation.tsx
│   ├── posts/                    # Post-related components
│   │   ├── PostCard.tsx
│   │   ├── PostForm.tsx
│   │   ├── PostList.tsx
│   │   └── PostDetail.tsx
│   ├── comments/                 # Comment components
│   │   ├── CommentCard.tsx
│   │   ├── CommentForm.tsx
│   │   └── CommentList.tsx
│   ├── topics/                   # Topic components
│   │   ├── TopicCard.tsx
│   │   ├── TopicSelector.tsx
│   │   └── TopicList.tsx
│   ├── users/                    # User-related components
│   │   ├── UserCard.tsx
│   │   ├── UserProfile.tsx
│   │   └── Avatar.tsx
│   ├── feed/                     # Feed components
│   │   ├── FeedList.tsx
│   │   └── FeedFilters.tsx
│   └── shared/                   # Shared/reusable components
│       ├── Loading.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
│
├── lib/                          # Utility functions & configs
│   ├── utils.ts                  # General utilities
│   ├── cn.ts                     # Tailwind class name utility
│   ├── api/                      # API client functions
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   ├── users.ts
│   │   └── topics.ts
│   └── validations/              # Zod schemas
│       ├── auth.ts
│       ├── posts.ts
│       └── users.ts
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── usePosts.ts
│   ├── useTopics.ts
│   ├── useInfiniteScroll.ts
│   └── useDebounce.ts
│
├── store/                        # State management (Zustand/Redux)
│   ├── authStore.ts
│   ├── postStore.ts
│   └── uiStore.ts
│
├── types/                        # TypeScript type definitions
│   ├── index.ts                  # Re-export all types
│   ├── user.ts
│   ├── post.ts
│   ├── topic.ts
│   ├── comment.ts
│   └── api.ts                    # API response types
│
├── constants/                    # Constants & configs
│   ├── topics.ts                 # Topic categories
│   ├── routes.ts                 # Route paths
│   └── config.ts                 # App configuration
│
├── styles/                       # Additional styles
│   └── components.css            # Component-specific styles
│
├── public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── middleware.ts                 # Next.js middleware (auth, etc.)
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # TailwindCSS configuration
├── tsconfig.json                 # TypeScript configuration
├── components.json               # shadcn/ui configuration
└── package.json                  # Dependencies
```

## Key Conventions

### 1. **App Router Structure** (`app/`)
- Use route groups `(auth)` and `(main)` for different layouts
- Each route folder contains `page.tsx` for the page component
- `layout.tsx` files define shared layouts for route groups

### 2. **Components** (`components/`)
- Organized by feature/domain (posts, users, topics, etc.)
- `ui/` folder contains shadcn/ui components (auto-generated)
- `shared/` for reusable components across features
- Use PascalCase for component files

### 3. **Types** (`types/`)
- One file per domain (user, post, topic, etc.)
- `index.ts` re-exports all types for easy imports
- API response types in `api.ts`

### 4. **API Client** (`lib/api/`)
- Separate files per domain (auth, posts, users, topics)
- Centralized API client configuration in `client.ts`
- Handles authentication, error handling, etc.

### 5. **Hooks** (`hooks/`)
- Custom hooks for data fetching, UI logic, etc.
- Prefixed with `use` (React convention)

### 6. **State Management** (`store/`)
- Zustand stores (or Redux Toolkit if preferred)
- Separate stores per domain

### 7. **Validations** (`lib/validations/`)
- Zod schemas for form validation
- Shared between frontend and potentially backend

## Naming Conventions

- **Components**: PascalCase (e.g., `PostCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Types**: camelCase (e.g., `user.ts`)
- **Constants**: UPPER_SNAKE_CASE for values, camelCase for files

## Import Path Aliases

Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/types/*": ["./types/*"],
      "@/store/*": ["./store/*"]
    }
  }
}
```

Then use:
```typescript
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types/user'
```



