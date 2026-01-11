# Otaku Community - React Application

This is the React.js version of the Otaku Community frontend, migrated from Next.js to provide a simpler client-side application architecture.

## Features

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling (matching original design system)
- **Auth0 React SDK** for authentication
- **React Router** for client-side routing
- **React Query** for API state management
- **Zustand** for global state management
- **Jest** and **React Testing Library** for testing
- **Property-based testing** with fast-check

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.development
```

3. Update environment variables in `.env.development` with your Auth0 and API configuration.

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Testing

Run tests:
```bash
npm test
```

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and configurations
├── types/         # TypeScript type definitions
├── constants/     # Application constants
├── store/         # Global state management
└── main.tsx       # Application entry point
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be available in the client:

- `VITE_AUTH0_DOMAIN` - Auth0 domain
- `VITE_AUTH0_CLIENT_ID` - Auth0 client ID
- `VITE_AUTH0_AUDIENCE` - Auth0 API audience
- `VITE_APP_BASE_URL` - Application base URL
- `VITE_API_URL` - Backend API URL

## Migration Status

This application is part of a migration from Next.js to React. See the migration specification in `.kiro/specs/nextjs-to-react-migration/` for detailed requirements and implementation plan.