# Trafobi Projects Platform

Bilingual (de/en) project showcase for transformative higher education across Europe. Users register, submit projects, admin reviews, approved projects appear in a filterable directory with interactive map.

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
src/app/api/                   → API routes (auth, projects CRUD, admin review)
src/components/admin/          → ReviewQueue, ReviewPanel
src/components/auth/           → LoginForm, RegisterForm
src/components/layout/         → Header, Footer, LocaleSwitcher, SessionProvider
src/components/projects/       → ProjectCard, ProjectGrid, ProjectMap, ProjectFilters, ProjectDetail, DashboardContent, ProjectForm/ (5-step multi-step form)
src/hooks/                     → useProjectForm (useReducer + localStorage persistence)
src/i18n/                      → next-intl routing, navigation, request config
src/lib/auth.ts                → NextAuth config (credentials, JWT with role)
src/lib/db/schema.ts           → Drizzle tables: users, projects, project_media
src/lib/constants.ts           → Topics (14), countries (21 European), institution types, flags
src/lib/geocode.ts             → Nominatim geocoding (address+city+country → lat/lng)
src/lib/validation.ts          → Zod schemas for all API inputs
src/lib/utils.ts               → Slug generation (umlaut-aware), cn() helper
src/proxy.ts                   → next-intl + auth route protection
messages/de.json, en.json      → UI translations
```

## Database Schema

3 tables (Drizzle ORM, schema at `src/lib/db/schema.ts`):

- **users**: id, email, password_hash, full_name, institution, country, bio, role (user/admin)
- **projects**: id, author_id, slug, language (de/en), title, summary, description, impact, challenges, tips, institution_name, institution_type, country, city, address, topics[], study_phase, status (draft/submitted/approved/rejected), admin_feedback, latitude, longitude, thumbnail_url, links (jsonb), timestamps
- **project_media**: id, project_id, file_path, original_name, mime_type, caption, sort_order (not yet used — Phase 4)

## Key Flows

**Project submission**: Register → 5-step form (About You, Basics, Story, Results, Links) → Save as Draft → Submit for Review → Admin approves/rejects at `/admin`

**Approval triggers geocoding**: On approve, `src/lib/geocode.ts` calls Nominatim with address+city+country, stores lat/lng for map display.

**Map view**: Homepage has grid/map toggle (`?view=map`). Uses Leaflet + OpenStreetMap with marker clustering. Custom SVG pin in TraBi purple (#667eea).

**i18n**: German default (no URL prefix), English at `/en/...`. UI chrome translated, project content is single-language per project with a `language` field for filtering.

## Deployment

- **Docker**: 2 containers — `app` (port 3002→3000) + `db` (port 5434→5432)
- **Caddy**: Entry in `/etc/caddy/Caddyfile` for `projekte.transformative-bildung.org`
- **DNS**: A record `projekte` → 217.154.164.181 at All-Inkl
- **Env**: `.env.production` on VPS (chmod 600), contains DATABASE_URL, POSTGRES_PASSWORD, AUTH_SECRET, AUTH_URL, NEXT_PUBLIC_APP_URL

## Next.js 16 Gotchas

- `middleware.ts` → `proxy.ts`, function named `proxy` not `middleware`
- `params` is async everywhere: `const { slug } = await params`
- `cookies()` and `headers()` are async
- `turbopack.root` must be absolute path in `next.config.ts`
- Leaflet requires `next/dynamic` with `ssr: false` (accesses `window`)

## What's Built vs TODO

**Built**: User auth, 5-step project submission, draft saving (localStorage + DB), admin review queue (approve/reject with feedback), public filterable directory (country, topic, type, phase, language), project detail with Markdown rendering, interactive map with geocoding, bilingual UI, security hardening (Zod validation, XSS protection, security headers, open redirect fix), Docker deployment

**TODO**:
- Phase 4: Image uploads (thumbnail + media gallery via Docker volume)
- Deploy "Projekte" nav link on main Trafobi site (already added to `Trafobi_website/index.html`, not yet uploaded to All-Inkl)
- Rate limiting on auth endpoints (best done at Caddy level)
- Email notifications on project approval/rejection
- Scolaia-inspired features: search, bookmarks/wishlist
