# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**doug.is** — Doug Rogers' personal website: public marketing/content sections, a Supabase-backed blog under `/thinking`, a set of "building" project showcases (notably the MVP-as-a-Service landing at `/building/mvp`), and a gated admin CMS at `/admin`. Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Supabase, deployed on Vercel.

## Operating rules (non-negotiable)

These override convenience, momentum, and any urge to "just keep going."

1. **No silent failures. Ever.** Never swallow an error, paper over a failing test, mock around a real problem, or report success when something didn't actually work. If something failed, say so plainly with the actual output — a failing test, a skipped step, an empty result, a fallback that kicked in. The existing `try/catch … return []` patterns in the data layer are deliberate runtime resilience; that is *not* license to hide failures from the developer during a task.
2. **When unsure, halt and surface — don't guess.** If you're confused, missing context, even slightly unsure, or you hit a contradiction (between the request and the code, between two files, between docs and reality), stop and raise it instead of picking a plausible-looking path and proceeding. Surfacing a question early is always cheaper than undoing a wrong assumption.
3. **Keep documentation current — spending tokens on it is welcome.** Stale docs are worse than no docs. When code changes invalidate something in this file, the README, or `.cursor/rules/*.mdc`, update the docs in the same breath. Don't economize on the read-and-verify work needed to keep them accurate; the owner explicitly prefers the token cost over drift.

## Commands

```bash
./start.sh                 # Start dev server — ALWAYS use this, never `npm run dev` directly.
                           # Cleans .next, frees port 3000, sets memory flags, runs next dev --turbopack.
npm run build              # Production build
npm run lint               # next lint
npm test                   # Jest (runs with coverage; jest.config.ts uses next/jest)
npm run test:watch         # Watch mode (preferred during development)
npm run test:coverage      # Coverage report -> coverage/lcov-report/index.html

# Run a single test file or pattern:
npm test -- src/components/__tests__/StatusMessage.test.tsx
npm test -- --testNamePattern="Metadata"

# Local Supabase (Docker): Studio :54323, API :54321, DB :54322
supabase start | stop | status
./scripts/reset-local-supabase.sh   # Full local rebuild: containers + migrations + CSV import
```

- Dev runs on **port 3000**; the conventional dev URL is **`local.doug.is:3000`** (not `localhost`).
- There is **no typecheck npm script**; run `npx tsc --noEmit` directly. Note several *test files* currently have pre-existing TS errors (mock `User` shape, `NODE_ENV` reassignment) — production source is clean.

## Architecture

### Route groups (App Router)
URLs are assembled from two sibling trees under `src/app/`:
- **`(site)/<section>/page.tsx`** holds the actual page **content** for the main sections (`/advising`, `/building`, `/connecting`, `/hustling`, `/investing`, `/thinking`). The `(site)` group does not appear in the URL.
- **`<section>/layout.tsx` + `metadata.ts`** (regular folders, outside the group) supply the **layout and metadata** for those same URLs.
- **Children** of a section live *outside* the group as regular segments — e.g. `/building/mvp` is `building/mvp/page.tsx`, and blog posts resolve at `thinking/about/[category]/[slug]/page.tsx`.
- Other top-level groups: `(migraine-free)` (a standalone micro-app) and `admin/` (CMS, not in a group).

When adding a section page, follow this split: content in `(site)/`, layout+metadata in the matching regular folder.

### Supabase data layer (`src/lib/supabase/`) — the important part
This is a **multi-client, security-tiered** setup. Pick the client by context:

- **`environment.ts`** — the auto-switching brain. `detectEnvironment()` + `getDatabaseConfig()` choose **local** Supabase (`*_LOCAL` env vars) in dev and **production** Supabase otherwise. All clients read their URL/keys from here.
- **`client.ts`** — browser client (`createBrowserClient`, anon key). Use in client components. Also has `uploadImage`, `getClientUser`, `signOut`.
- **`server.ts`** — server clients: `createClient()` (cookie-aware SSR, anon key), `createServiceRoleClient()` (full access, **server only**), `createStaticClient()` (no cookies, for static gen / `unstable_cache`). Also auth helpers `getUser()`, `isAdmin()`, `requireAdmin()`.
- **`data.ts`** — primary **server-side read** layer for Server Components: `getPosts`, `getPublishedPosts`, `getPostsStatic`, `getPostBySlug`, `getPostBySlugAndCategory`.
- **`serverClient.ts`** — admin/server-component data ops: `createAdminClient`, `adminGetPostById`, contact-submission reads.
- **`clientData.ts`** — client-side read helpers (uses the browser client).
- **`middleware.ts`** — `updateSession()` for token refresh only.

**Security model:** reads use the anon key; **all mutations go through Server Actions in `src/lib/actions/`** (`postActions.ts`, `contactActions.ts`) using a service-role/server client. Never use the service-role key in client components.

**Caching/revalidation:** `getPublishedPosts` (and peers) wrap queries in `unstable_cache` tagged `"posts"`. After an admin saves a post, the mutation calls `revalidateTag("posts")` to refresh the public site. Keep this contract intact when touching post reads/writes.

### Auth & middleware
- Root `src/middleware.ts` does **token refresh only** (official Supabase SSR pattern) and injects an `x-pathname` header for layouts. **Authorization is NOT in middleware** — admin gating happens in server components/layouts via `requireAdmin()` / `isAdmin()`.
- `src/lib/auth/` is a separate auth module (`supabase-server.ts`, `simple-auth-server.ts`, `api-key.ts`). Roles live in the `user_roles` table (`admin`/`editor`/`viewer`); RLS lets the public read only published posts, authenticated users do everything.

### Other notable pieces
- **Standalone "stuff" hosting** (`/building/stuff`) — a drop-in host for self-contained one-off HTML pages (interactive charts, experiments). To publish one: drop a complete `.html` document into `src/content/stuff/<name>.html` and deploy; it's live at `/building/stuff/<name>`. The static route handler `src/app/building/stuff/[name]/route.ts` serves each file **as-is** (its own `<html>`/`<head>`/`<style>` — no site layout/CSS, so no collisions) and injects only a small self-scoped `.dougis-stuff-nav` back-bar via `src/lib/stuff.ts`. The index at `src/app/building/stuff/page.tsx` auto-lists every file (parsed `<title>`/meta description) at build time. Files live outside `public/` on purpose, so there's no raw nav-less URL; both the handler and index are build-time static (`generateStaticParams` + `dynamicParams = false`), so a new file appears only after a redeploy.
- **MVP A/B variants** (`src/lib/mvp-variants/`) drive `/building/mvp/[variant]` — variant content/config objects, not separate pages.
- **Motion system**: `src/app/globals.css` defines `--ease-*` / `--dur-*` tokens, a `prefers-reduced-motion` baseline, and keyframes (`hero-stagger`, `terminal-blink`). Button/card transitions are wired to these tokens and gated behind `@media (hover: hover)`. Prefer these tokens over ad-hoc `transition: all`.
- **Database schema** in `supabase/migrations/` (single base schema file + incremental migrations). Tables: `posts`, `contact_messages`, `user_roles`. Generated DB types in `src/lib/types/supabase.ts`.

## Conventions

- **Tailwind CSS v4 only** — CSS-first config in `globals.css`. Do not use v3 patterns (no `tailwind.config` theme extension idioms). See `.cursor/rules/tailwind4.mdc`.
- **TDD is the expected workflow** for features and bug fixes (red → green → refactor). Tests are colocated in `__tests__/` dirs; use the helpers in `src/lib/test-utils.tsx` (`setupSupabaseMock()`, custom `render`). A test that "passes" but logs errors in the output is not considered passing.
- **Favor Server Components**; reach for `'use client'` only for genuine interactivity. Await async runtime APIs (`cookies()`, `headers()`) and `params`/`searchParams` (Next 15).
- **Metadata**: every page sets OpenGraph/Twitter metadata via the Next 15 Metadata API; admin pages are `noindex`. Section pattern `"doug.is / Section"`, posts `"Title | Thinking | doug.is"`. See `.cursor/rules/metadata.mdc`.
- **Git**: work on feature branches. Merges to `main` require explicit owner approval, and pushing `main`/deploying is the owner's call (a push to `main` triggers Vercel deploy).

## Known rough edges (don't replicate; consolidate when touched)
- Three diverging `Post` interfaces exist (`data.ts`, `clientData.ts`, `serverClient.ts`) — they disagree on nullability. Prefer the generated `Database` types and unify rather than adding a fourth.
- Two blog URL shapes coexist: `/thinking/about/[category]/[slug]` (canonical, used by the homepage) and `/thinking/[primary-category]/[slug]` (legacy).
- `src/app` contains scratch/experiment routes (`home-1`…`home-11`, `redesign`, `supatest`, `debugging`, etc.) that are not part of the real site.

> Deeper background lives in `.cursor/rules/*.mdc` (nextjs, supabase, testing, tailwind4, metadata). Treat them as reference, but verify against the actual code — some describe an earlier `publicClient.ts`/`serverClient.ts` two-file model that has since evolved into the layout documented above.
