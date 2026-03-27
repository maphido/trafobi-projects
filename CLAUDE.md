# Trafobi Projects Platform

Project showcase for transformative higher education projects across Europe.

## Quick Reference

| What | Where |
|------|-------|
| **Live** | https://projects.transformative-bildung.org |
| **VPS** | `/opt/trafobi-projects` on 217.154.164.181 |
| **Local dev** | `npm run dev` (port 3000), DB on localhost:5434 |
| **Deploy** | `cd /opt/trafobi-projects && sudo git pull && sudo docker compose --env-file .env.production up -d --build` |

## Tech Stack

Next.js 16 (App Router, standalone) · NextAuth.js v5 (JWT) · PostgreSQL 17 · Drizzle ORM · next-intl (de/en) · Tailwind CSS 4 · Docker Compose · Caddy reverse proxy

## Key Files

- `src/lib/db/schema.ts` — Drizzle table definitions (users, projects, project_media)
- `src/lib/auth.ts` — NextAuth config (credentials, JWT, role)
- `src/proxy.ts` — next-intl + auth route protection (Next.js 16: proxy, not middleware)
- `src/lib/constants.ts` — Topics, countries, institution types

## Next.js 16 Gotchas

- `middleware.ts` → `proxy.ts`, function named `proxy` not `middleware`
- `params` is async everywhere: `const { slug } = await params`
- `cookies()` and `headers()` are async
- `turbopack.root` must be set to avoid workspace root warning
