# Trafobi Projects Platform

Bilingual (de/en) project showcase for transformative higher education across Europe. Users register, submit projects, admin reviews, approved projects appear in a filterable directory with interactive map. Authors can post timestamped updates and upload thumbnail images.

## Quick Reference

| What | Where |
|------|-------|
| **Live** | https://projekte.transformative-bildung.org |
| **GitHub** | `maphido/trafobi-projects` (public) |
| **VPS** | `/opt/trafobi-projects` on 217.154.164.181 |
| **Local dev** | `npm run dev` (port 3000), DB on localhost:5434 |
| **Deploy** | `cd /opt/trafobi-projects && sudo git pull && sudo docker compose --env-file .env.production up -d --build` |
| **DB migration** | `drizzle-kit generate` locally, then `cat drizzle/migrations/XXXX.sql \| ssh mdolderer@217.154.164.181 "sudo docker exec -i trafobi-projects-db-1 psql -U postgres -d trafobi_projects"` |
| **Admin** | Manuel Dolderer (manuel.dolderer@me.com), promote via `UPDATE users SET role='admin' WHERE email='...'` |

## Tech Stack

Next.js 16.2 (App Router, standalone) · NextAuth.js v5 (JWT, credentials) · PostgreSQL 17 · Drizzle ORM · next-intl (de/en, `as-needed` prefix) · Tailwind CSS 4 + @tailwindcss/typography · Leaflet + react-leaflet (map) · Zod (validation) · Docker Compose · Caddy reverse proxy

## Project Structure

```
src/app/[locale]/              → Pages (homepage, auth, dashboard, admin, project detail, submit)
src/app/api/                   → API routes (auth, projects CRUD + delete, admin review, thumbnail upload, project updates)
src/app/api/uploads/[...path]/ → Static file serving for uploaded images (rewritten from /uploads/*)
src/components/admin/          → ReviewQueue, ReviewPanel
src/components/auth/           → LoginForm, RegisterForm
src/components/layout/         → Header, Footer, LocaleSwitcher, SessionProvider
src/components/projects/       → ProjectCard, ProjectGrid, ProjectMap, ProjectFilters, ProjectDetail,
                                 ProjectUpdates, AddUpdateForm, DashboardContent, EditProjectForm,
                                 ProjectForm/ (5-step multi-step form with CharacterCount, ThumbnailUpload)
src/hooks/                     → useProjectForm (useReducer + localStorage persistence)
src/i18n/                      → next-intl routing, navigation, request config
src/lib/auth.ts                → NextAuth config (credentials, JWT with role)
src/lib/db/schema.ts           → Drizzle tables: users, projects, project_media, project_updates
src/lib/constants.ts           → Topics (14), countries (21 European), institution types, study phases, project phases
src/lib/geocode.ts             → Nominatim geocoding (address+city+country → lat/lng)
src/lib/validation.ts          → Zod schemas for all API inputs
src/lib/utils.ts               → Slug generation (umlaut-aware), cn() helper
src/proxy.ts                   → next-intl + auth route protection
messages/de.json, en.json      → UI translations
uploads/                       → Uploaded files (Docker volume, served via /api/uploads rewrite)
```

## Database Schema

4 tables (Drizzle ORM, schema at `src/lib/db/schema.ts`):

- **users**: id, email, password_hash, full_name, institution, country, bio, role (user/admin)
- **projects**: id, author_id, slug, language (de/en), title, summary, description, impact, challenges, tips, institution_name, institution_type, country, city, address, topics[], study_phase, project_phase (planning/development/active/completed), status (draft/submitted/approved/rejected), admin_feedback, latitude, longitude, thumbnail_url, links (jsonb), timestamps
- **project_media**: id, project_id, file_path, original_name, mime_type, caption, sort_order (not yet used — future media gallery)
- **project_updates**: id, project_id, author_id, content (text/markdown), created_at — timestamped updates posted by project author

## Key Flows

**Project submission**: Register → 5-step form (About You, Basics, Story, Results, Links & Media) → Save as Draft → Submit for Review → Admin approves/rejects at `/admin`

**Editing**: Authors can edit projects in any status (draft, rejected, approved, submitted). Editing an approved project sends it back to "submitted" for re-review and temporarily hides it from the public directory. The slug is preserved so URLs remain stable.

**Approval triggers geocoding**: On approve, `src/lib/geocode.ts` calls Nominatim with address+city+country, stores lat/lng for map display.

**Project updates**: Authors can post timestamped updates on approved projects. Updates support Markdown and are displayed in a timeline on the project detail page. No admin review needed for updates.

**Thumbnail upload**: Authors upload images (JPEG/PNG/WebP, max 5 MB) on step 5 of the form. Requires saving as draft first (needs project ID). Files stored in `uploads/thumbnails/`, served via rewrite rule. Old thumbnails are deleted on replacement.

**Project deletion**: Authors can delete their own projects from the dashboard. Confirmation dialog before deletion. Cascade deletes handle related updates and media. Thumbnail files are cleaned up.

**Map view**: Homepage has grid/map toggle (`?view=map`). Uses Leaflet + OpenStreetMap with marker clustering. Custom SVG pin in TraBi purple (#667eea).

**i18n**: German default (no URL prefix), English at `/en/...`. UI chrome translated, project content is single-language per project with a `language` field for filtering.

## Character Limits (enforced by Zod + client-side counters)

| Field | Max |
|-------|-----|
| title | 200 |
| summary | 500 |
| description | 50,000 |
| impact, challenges, tips | 10,000 each |
| institutionName, address | 200 |
| city | 100 |
| link label | 100 |
| project update content | 5,000 |

## Project Lifecycle Phases

Projects have a `projectPhase` field (separate from the review `status`):
- **planning** — Planung & Konzeption / Planning & Design
- **development** — In Umsetzung / In Development
- **active** — Laufend / Active
- **completed** — Abgeschlossen / Completed

Displayed as color-coded badges on cards and detail pages. Filterable on the homepage.

## API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/register` | User registration |
| POST/GET | `/api/auth/[...nextauth]` | NextAuth.js login/session |
| POST | `/api/projects` | Create draft project |
| GET | `/api/projects` | List user's own projects |
| GET | `/api/projects/[id]` | Get project (public if approved, own, or admin) |
| PUT | `/api/projects/[id]` | Update project (draft/rejected/approved/submitted) |
| DELETE | `/api/projects/[id]` | Delete own project |
| POST | `/api/projects/[id]/thumbnail` | Upload thumbnail image |
| DELETE | `/api/projects/[id]/thumbnail` | Remove thumbnail image |
| GET | `/api/projects/[id]/updates` | List project updates (public for approved) |
| POST | `/api/projects/[id]/updates` | Post update (author only, approved projects) |
| POST | `/api/admin/review` | Approve/reject project (admin only) |
| GET | `/api/uploads/[...path]` | Serve uploaded files |

## Deployment

- **Docker**: 2 containers — `app` (port 3002→3000) + `db` (port 5434→5432)
- **Entrypoint**: `docker-entrypoint.sh` runs as root to fix upload directory permissions, then drops to `nextjs` user via `su-exec`
- **Caddy**: Entry in `/etc/caddy/Caddyfile` for `projekte.transformative-bildung.org`
- **DNS**: A record `projekte` → 217.154.164.181 at All-Inkl
- **Env**: `.env.production` on VPS (chmod 600), contains DATABASE_URL, POSTGRES_PASSWORD, AUTH_SECRET, AUTH_URL, NEXT_PUBLIC_APP_URL
- **Uploads volume**: `./uploads:/app/uploads` — persists across rebuilds

## Next.js 16 Gotchas

- `middleware.ts` → `proxy.ts`, function named `proxy` not `middleware`
- `params` is async everywhere: `const { slug } = await params`
- `cookies()` and `headers()` are async
- `turbopack.root` must be absolute path in `next.config.ts`
- Leaflet requires `next/dynamic` with `ssr: false` (accesses `window`)
- Turbopack warns about `process.cwd()` in thumbnail route — harmless, works correctly

## What's Built vs TODO

**Built**: User auth, 5-step project submission with character counters, draft saving (localStorage + DB), admin review queue (approve/reject with feedback), public filterable directory (country, topic, type, study phase, project phase, language), project detail with Markdown rendering, interactive map with geocoding, bilingual UI, thumbnail image upload, project updates timeline, project editing (all statuses), project deletion, project lifecycle phases (planning/development/active/completed), security hardening (Zod validation, XSS protection, security headers, open redirect fix), Docker deployment with entrypoint permission fix

**TODO**:
- Full media gallery (project_media table exists but UI not built yet)
- Rate limiting on auth endpoints (best done at Caddy level)
- Email notifications on project approval/rejection
- Scolaia-inspired features: search, bookmarks/wishlist
- Deploy "Projekte" nav link on main Trafobi site (already added to `Trafobi_website/index.html`, not yet uploaded to All-Inkl)
