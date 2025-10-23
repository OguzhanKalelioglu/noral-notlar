# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nöral Notlar is a Turkish AI and technology podcast landing page built with React and Vite. The application features a whimsical, AI-themed design with podcast episode streaming, newsletter subscription, and Cloudflare deployment.

## Development Commands

### Core Development
- `bun run dev` - Start development server on port 3000 with hot reload
- `bun run build` - Build for production (outputs to `dist/` directory)
- `bun run preview` - Preview production build on port 4173
- `bun run lint` - Run ESLint with JSON output
- `bun run deploy` - Build and deploy to Cloudflare

### Cloudflare & Workers
- `bunx wrangler login` - Authenticate with Cloudflare
- `bun run cf-typegen` - Generate Cloudflare Worker types
- Workers are located in `worker/` directory with main entry at `worker/index.ts`

## Architecture

### Frontend Structure
- **React 18** with **TypeScript** using Vite as bundler
- **React Router** for client-side routing (currently single-page)
- **Framer Motion** for animations and micro-interactions
- **shadcn/ui** components built on **Radix UI** primitives
- **Tailwind CSS** for styling with custom color palette
- **Zustand** for state management
- **React Query** for server state management
- **React Hook Form** with Zod validation

### Backend Structure
- **Hono** framework running on Cloudflare Workers
- **Cloudflare D1** database for newsletter subscribers
- Main worker file: `worker/index.ts` (DO NOT MODIFY - contains error handling and CORS)
- User routes: `worker/userRoutes.ts` (add new API endpoints here)
- Database schema: `schema.sql`

### Key Components
- `src/pages/HomePage.tsx` - Main landing page with hero, episodes, and newsletter
- `src/components/AudioPlayer.tsx` - Custom audio player for podcast episodes
- `src/components/NewsletterForm.tsx` - Newsletter subscription with validation
- `src/lib/rss.ts` - RSS feed parsing for podcast episodes (uses Anchor.fm RSS)
- `src/components/Icons.tsx` - Custom SVG icons for podcast platforms

### Styling & Design
- Custom color scheme: `amber-500`, `deepIndigo-900`, `offWhite`
- Hand-drawn, whimsical AI-themed illustrations with floating animations
- Responsive design with mobile-first approach
- Loading states and error handling throughout

## Database

### Newsletter Subscribers
Table: `newsletter_subscribers`
- `id` (PRIMARY KEY)
- `email` (UNIQUE)
- `subscribed_at`, `created_at`, `updated_at`
- `is_active` (BOOLEAN)
- `unsubscribe_token` (UNIQUE)

### API Endpoints
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/newsletter/subscribers` - Get active subscribers
- `POST /api/newsletter/unsubscribe` - Unsubscribe with token
- `POST /api/client-errors` - Client error reporting (automatic)
- `GET /api/health` - Health check endpoint

## RSS Integration

The app fetches podcast episodes from Anchor.fm RSS feed:
- Primary: RSS2JSON service for reliable parsing
- Fallback: XML parsing with CORS proxy
- Displays 3 most recent episodes with audio streaming
- Handles image loading errors gracefully

## Deployment

- **Cloudflare Pages** for frontend assets
- **Cloudflare Workers** for API endpoints
- **Cloudflare D1** for database
- Single-click deployment via Cloudflare button
- Manual deployment with `bun run deploy`

## Important Notes

- `worker/index.ts` is strictly protected - add routes only in `worker/userRoutes.ts`
- `wrangler.jsonc` contains D1 database configuration
- Error boundaries and client error reporting implemented
- Turkish language content throughout
- RSS feed may fail gracefully with empty episode list