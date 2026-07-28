# Trust Hub Business Solutions

Bilingual (English/Arabic) marketing website and admin backend for Trust Hub Business Solutions — a corporate services firm in Riyadh, Saudi Arabia, offering business setup, PRO services, HR & payroll, accounting & tax compliance, consultancy, and workspace rental.

## Requirements

- **Node.js 24+** (uses `--env-file-if-exists`, native to Node 22.9+)
- **pnpm 10.34.5** — pinned via the `packageManager` field and provisioned by Corepack

If `pnpm` is not on your PATH:

```sh
corepack enable pnpm
```

On Windows, `corepack enable` writes into `C:\Program Files\nodejs` and needs an
elevated shell. To avoid that, install the shim into your user npm prefix instead:

```powershell
New-Item -ItemType Directory -Force "$env:APPDATA\npm" | Out-Null
corepack enable --install-directory "$env:APPDATA\npm" pnpm
```

## Setup

```sh
pnpm install
cp .env.example .env    # then fill in DATABASE_URL and SESSION_SECRET
```

`DATABASE_URL` points at a [Neon](https://console.neon.tech) Postgres project.
`SESSION_SECRET` must be a random string of at least 16 characters — the API
server refuses to start without one:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Push the schema, then create your first admin login:

```sh
pnpm run db:push
pnpm --filter @workspace/scripts run seed-admin -- you@example.com a-strong-password "Your Name"
```

## Run

```sh
pnpm run dev          # frontend (:5173) + API (:5000) together
pnpm run dev:web      # frontend only
pnpm run dev:api      # API only
```

The Vite dev server proxies `/api` to `http://localhost:5000`, so the browser
stays on a single origin — session cookies then behave exactly as they will in
production, where Express serves the built frontend itself.

## Other commands

```sh
pnpm run typecheck    # tsc across every package — the only automated safety net today
pnpm run build        # typecheck + build all packages
pnpm run db:push      # push Drizzle schema changes to Postgres (dev only)
pnpm run codegen      # regenerate API hooks + Zod schemas from the OpenAPI spec
```

## Layout

| Path | Package | Purpose |
|---|---|---|
| `artifacts/trust-hub` | `@workspace/trust-hub` | React 19 + Vite 7 + Tailwind 4 frontend |
| `artifacts/api-server` | `@workspace/api-server` | Express 5 API, bundled with esbuild |
| `lib/api-spec` | `@workspace/api-spec` | `openapi.yaml` — the API source of truth |
| `lib/api-client-react` | `@workspace/api-client-react` | Generated React Query hooks |
| `lib/api-zod` | `@workspace/api-zod` | Generated Zod schemas, shared by client and server |
| `lib/db` | `@workspace/db` | Drizzle ORM schema and Postgres connection |
| `scripts` | `@workspace/scripts` | One-off maintenance scripts |

## Stack

pnpm workspaces · TypeScript 5.9 · React 19 · Vite 7 · Tailwind 4 · shadcn/ui ·
wouter · TanStack Query · Express 5 · PostgreSQL + Drizzle · Zod · Orval · esbuild

## API workflow

The OpenAPI spec is the source of truth. To add or change an endpoint:

1. Edit `lib/api-spec/openapi.yaml`
2. Run `pnpm run codegen`
3. Implement the route in `artifacts/api-server/src/routes/`

Never hand-edit anything under `src/generated/` — it is overwritten on every run.

## API endpoints

| Method & path | Auth | Purpose |
|---|---|---|
| `GET /api/healthz` | — | Health check |
| `POST /api/leads` | — | Submit a contact form lead (rate-limited, honeypot-protected) |
| `POST /api/auth/login` | — | Log in, sets a session cookie |
| `POST /api/auth/logout` | — | Clear the current session |
| `GET /api/auth/me` | session | Current admin user |
| `GET /api/articles`, `GET /api/articles/:slug` | — | Published articles, locale-aware (`?locale=en\|ar`) |
| `GET/POST /api/admin/articles`, `PATCH/DELETE /api/admin/articles/:id` | session | Article CRUD, both locale translations at once |
| `GET /api/admin/leads`, `PATCH /api/admin/leads/:id` | session | Lead inbox and status updates |

## Site structure

- **Marketing site**: `/`, `/about`, `/services`, `/news`, `/news/:slug`,
  `/workspace`, `/contact` — each also served under an `/ar/...` prefix for
  Arabic (RTL). Copy lives in `artifacts/trust-hub/src/i18n/locales/{en,ar}.json`;
  add a page by adding its strings there and calling `useTranslation()` /
  `useDocumentMeta()` in the component, matching the existing pages.
- **Admin panel**: `/admin` — English-only, lazy-loaded, session-gated. Log in
  with a user created via `seed-admin` (above). Leads inbox and an article
  editor with EN/AR tabs live under `artifacts/trust-hub/src/admin/`.
  Disallowed in `robots.txt` and tagged `noindex` while mounted.

## History

This project was generated on Replit and has since been migrated off-platform.
See `CLAUDE.md` for what that migration changed and why.
