# Frontend Setup Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_CLOUDINARY_URL=your_cloudinary_url_here
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Initialize shadcn/ui:**
   ```bash
   npx shadcn-ui@latest init
   ```
   This will configure shadcn/ui with the settings from `components.json`.

4. **Add shadcn/ui components as needed:**
   ```bash
   npx shadcn-ui@latest add button
   npx shadcn-ui@latest add input
   npx shadcn-ui@latest add card
   npx shadcn-ui@latest add dialog
   # ... add more components as needed
   ```

## Development

Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Project Structure Overview

- `app/` - Next.js App Router pages and layouts
- `components/` - React components organized by feature
- `lib/` - Utility functions, API clients, and validations
- `hooks/` - Custom React hooks
- `store/` - State management (Zustand)
- `types/` - TypeScript type definitions
- `constants/` - App constants and configuration
- `public/` - Static assets

See `README.md` for detailed folder structure documentation.



