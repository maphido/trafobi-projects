# Trafobi Projects — Project Summary

## What It Is

A bilingual (German/English) web platform that showcases transformation projects in higher education across Europe. Part of the **Zukunftsallianz für Transformative Bildung** network, inspired by [scolaia.de](https://scolaia.de).

**Live at**: https://projekte.transformative-bildung.org

## What It Does

- **Project Directory**: Filterable grid and interactive map of approved projects across 21 European countries
- **Project Submission**: 5-step guided form (About You → Basics → Story → Results → Links & Media) with draft saving
- **Admin Review**: Approve/reject workflow with feedback, geocoding on approval for map placement
- **Project Updates**: Authors post timestamped updates to show how projects evolve over time
- **Thumbnail Uploads**: Image upload (JPEG/PNG/WebP, max 5 MB) for visual project cards
- **Project Lifecycle Tracking**: Four phases — Planning & Design, In Development, Active, Completed
- **Bilingual UI**: German (default) and English, with locale-aware URLs

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, standalone build) |
| Auth | NextAuth.js v5 (credentials + JWT) |
| Database | PostgreSQL 17 via Drizzle ORM |
| i18n | next-intl (German default, English at `/en/`) |
| Styling | Tailwind CSS 4 + @tailwindcss/typography |
| Maps | Leaflet + react-leaflet + OpenStreetMap |
| Validation | Zod (server + client-side character counters) |
| Deployment | Docker Compose + Caddy reverse proxy on IONOS VPS |

## Database

4 tables: **users**, **projects** (28 columns), **project_media** (reserved for future gallery), **project_updates** (timestamped author updates). All managed via Drizzle ORM with typed schemas and indexed queries.

## Key Features in Detail

### Submission & Editing
- 5-step form with localStorage persistence and server-side draft saving
- Live character counters on all text fields with limits enforced by Zod
- Authors can edit projects in any status; editing approved projects triggers re-review
- Projects can be deleted by their owner with confirmation

### Classification & Filtering
- 14 topic categories (e.g., Sustainability, AI in Education, Future Skills)
- 4 institution types, 3 study phases, 4 project lifecycle phases
- Country, language, and all classification fields are filterable on the homepage

### Map View
- Geocoding via Nominatim on admin approval (address + city + country → lat/lng)
- Leaflet map with custom purple pins and marker clustering
- Grid/map toggle on homepage

### Project Updates Timeline
- Authors post Markdown updates on approved projects (no admin review needed)
- Displayed in reverse-chronological timeline with formatted dates
- Visible to all visitors on the project detail page

## Deployment Architecture

```
Internet → Caddy (TLS) → Docker: app (port 3002) + db (port 5434)
                                    ↓
                              uploads/ volume (thumbnails)
```

- **VPS**: IONOS Ubuntu 24.04 at 217.154.164.181
- **DNS**: `projekte.transformative-bildung.org` → A record at All-Inkl
- **Docker entrypoint**: Fixes upload directory permissions, then drops to unprivileged user

## Current Status (March 2026)

### Complete
- User registration and authentication
- Full project CRUD (create, read, update, delete)
- 5-step submission form with character limits and thumbnail upload
- Admin review workflow with approve/reject and feedback
- Public directory with 6 filter dimensions + grid/map views
- Interactive map with geocoding
- Project updates timeline
- Project lifecycle phases with color-coded badges
- Bilingual UI (German/English)
- Security hardening (Zod validation, XSS protection, security headers)
- Production Docker deployment

### Remaining
- Full media gallery (database table exists, UI not yet built)
- Rate limiting on auth endpoints
- Email notifications on approval/rejection
- Search across projects
- Bookmarks / wishlist feature
- "Projekte" nav link on main Trafobi website (HTML ready, not uploaded)

## Repository

- **GitHub**: [maphido/trafobi-projects](https://github.com/maphido/trafobi-projects) (public)
- **15 commits** on main branch
- **3 Drizzle migrations** applied
