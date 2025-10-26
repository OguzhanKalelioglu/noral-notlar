# Repository Guidelines

## Project Structure & Module Organization
- `src/` – React + TypeScript views, components, hooks, and libs (`src/lib/rss.ts` handles podcast RSS fetching). Keep new UI pieces under `src/components`, route screens in `src/pages`.
- `public/` – Static assets bundled by Vite. Place favicons or externally hosted fallbacks here.
- `worker/` – Cloudflare Worker scripts or supporting runtime utilities.
- `schema.sql` & configuration files (`vite.config.ts`, `wrangler.jsonc`) – Keep environment adjustments localized to their respective config files.

## Build, Test, and Development Commands
- `bun install` – Install dependencies. Prefer Bun over npm/yarn in this repository.
- `bun run dev` – Start the Vite dev server on `http://localhost:3000`; hot reloads are enabled.
- `bun run build` – Produce a production bundle in `dist/`.
- `bun run preview` – Serve the built bundle locally for smoke testing.
- `bun run deploy` – Build and deploy via Wrangler to Cloudflare (requires `bunx wrangler login` beforehand).
- `bun run lint` – Execute ESLint with the configured ruleset.

## Coding Style & Naming Conventions
- TypeScript/TSX with 2-space indentation (enforced by ESLint). Keep components named in PascalCase (`PodcastCard.tsx`), hooks in camelCase (`usePlayerState.ts`).
- Use Tailwind utility classes for styling; share repeated patterns through small wrapper components instead of global CSS.
- Prefer functional React components and hooks; avoid class components.
- Keep logging minimal in production pathways—use `console.log` only for diagnostics and remove before merging when possible.

## Testing Guidelines
- Automated tests are not yet in place. When adding tests, colocate them beside the source file (`MyComponent.test.tsx`) and run via `bun test` (configure Vitest/Jest as needed).
- Provide manual verification notes in PR descriptions when altering RSS fetching, playback, or layout-critical paths.

## Commit & Pull Request Guidelines
- Write concise, imperative commit messages (`Add cache-busting to RSS fallback`).
- Scope each PR narrowly; include:
  - Summary of changes and rationale.
  - Screenshots or GIFs for UI/UX updates.
  - Steps to reproduce bugs and verification steps after fixes.
  - Linked issue numbers where applicable (`Closes #42`).
- Ensure lint/build commands pass before requesting review.

## Security & Deployment Notes
- RSS and external fetches run at runtime; safeguard secrets via Cloudflare environment variables, not source files.
- Before deploying, confirm `bun run preview` renders expected podcast episodes and that fallback fetch logs show fresh data (cache-busting is required for allorigins proxy).
