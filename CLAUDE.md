# Working notes

Setup, commands, and repo layout live in `README.md`. This file covers what you
can't infer from the code.

## Current state

- **Contact form is real.** `artifacts/trust-hub/src/pages/Contact.tsx` uses
  react-hook-form + `zodResolver(CreateLeadBody.omit({ locale: true }))` from
  `@workspace/api-zod`, and submits through the generated `useCreateLead()`
  mutation hook. No more `setTimeout` fake — a failed request shows a real
  error toast, a successful one resets the form.
- **News is real.** `/news` fetches `useListArticles({ locale: "en" })`;
  category filter, featured/regular split, loading skeletons, empty and error
  states are all driven by the live response, not a hardcoded array. `/news/:slug`
  (`NewsArticle.tsx`, new) fetches `useGetArticleBySlug` and renders the full
  article — the route didn't exist before Phase 4. Missing/unpublished slugs
  show a not-found state instead of crashing.
- **Two pages remain hardcoded**: `About.tsx`, `Services.tsx`, and the plan
  arrays in `Workspace.tsx` are still literal data — no backend models exist
  for them yet, out of scope for Phase 4.
- **The API is real**: `leads`, `auth` (login/logout/me), public `articles`,
  and `admin/leads` + `admin/articles` CRUD are implemented, schema-validated
  end to end, and tested against a live Neon database (see `lib/db/src/schema/`
  and `artifacts/api-server/src/routes/`).
- Placeholder data is still live on the site: `+966 11 000 0000`,
  `P.O. Box 12345`, `href="#"` social and Privacy/Terms links, and a grey box
  where the workspace map belongs. Unrelated to the backend work above.
- No admin UI yet — the admin API has no frontend. `pnpm --filter
  @workspace/scripts run seed-admin -- <email> <password> [name]` is the only
  way to create or update an admin login today. Content (articles) can only be
  created via direct API calls until Phase 5 ships an editor.

## Architecture decisions

- **OpenAPI is the source of truth for the API.** Orval generates React Query
  hooks into `lib/api-client-react` and Zod schemas into `lib/api-zod` from
  `lib/api-spec/openapi.yaml`. Both client and server validate against the same
  generated schemas. Edit the spec, run `pnpm run codegen`, then implement.
  Files under `src/generated/` are overwritten — never hand-edit them.
- **Translations belong in their own table keyed by locale**, not in
  `title_en` / `title_ar` columns. Adding a third language should be a data
  change, not a migration.
- **Arabic uses a `/ar/...` path prefix**, not a stateful language toggle, so
  each language is separately indexable with `hreflang` alternates. wouter's
  `base` prop rewrites every `<Link href>` automatically, so localising URLs
  needs no changes to page components.
- **Auth is self-hosted**: argon2 password hashes; session tokens are random
  32-byte values, HMAC-SHA256'd with `SESSION_SECRET` before being stored in
  `sessions.tokenHash`, so a leaked DB dump alone can't be replayed as a valid
  cookie. `httpOnly` + `SameSite=Lax` cookies, `secure` in production only.
  No third-party auth vendor.
- **Every DB write in `admin/articles.ts` goes through `db.transaction`.**
  An article and its translations are separate tables (see below); a create or
  update that touched one but not the other would leave a half-written
  article. Updates delete-and-reinsert all translations rather than diffing
  individual locale rows — simpler, and the editor always submits the full set.
- **In production, Express serves the built SPA** — one process, one deployable,
  no CORS, and session cookies are same-origin. The Vite dev proxy mirrors this
  so dev and prod behave alike.

## Replit migration

Generated on Replit, migrated off. Removed: the three `@replit/vite-plugin-*`
packages, `.replit` / `.replitignore` / `.replit-artifact/`, the `.agents`
directory, and the `mockup-sandbox` artifact (Replit's design canvas — it was a
duplicate copy of the shadcn components with an empty mockup registry).

Two traps that came from that origin:

- **`pnpm-workspace.yaml` used to prune every native binary except linux-x64**
  ("replit uses linux-x64 only"). That silently made the workspace installable
  only inside Replit's containers — esbuild, rollup, lightningcss and
  `@tailwindcss/oxide` all resolved to no usable binary on Windows and macOS.
  The overrides are gone. **Do not reintroduce platform pruning.**
- **`PORT` and `BASE_PATH` used to be mandatory** and threw at config-load time,
  because Replit injected them from `artifact.toml`. They now fall back to
  `5173` / `/` for the frontend and `5000` for the API.

## Gotchas

- **pnpm path filters like `--filter "./artifacts/**"` match nothing on
  Windows** and fail *silently* — the command reports success having checked
  zero packages. The root `typecheck` script hit this. Use name filters or plain
  `-r --if-present`.
- **Shell syntax in npm scripts breaks on Windows.** `sh -c ...` and
  `export FOO=bar && ...` were both used here; `sh` is not on PATH in a stock
  Windows setup. Prefer a Node script (see `scripts/preinstall.mjs`) or Node's
  native `--env-file-if-exists`.
- `minimumReleaseAge: 1440` in `pnpm-workspace.yaml` blocks npm packages
  published in the last 24 hours. This is a deliberate supply-chain defense — if
  an install fails on a brand-new version, pin an older one rather than
  disabling the setting.
- There is **no test suite**. `pnpm run typecheck` is the only automated check;
  run it after every change.
- `@replit` comments in `components/ui/button.tsx` and `badge.tsx` mark
  intentional deviations from stock shadcn styling. They are annotations, not
  dependencies — leave them.
- **`drizzle-kit push` silently fails to find the schema file when the repo
  path contains parentheses** (this repo lives under `Trust HUB)\...`).
  `drizzle-kit` resolves the schema path with a glob matcher that treats `(`
  and `)` as extglob syntax, so an absolute path built with
  `path.join(__dirname, ...)` breaks with "No schema files found" even though
  the file exists. Fix: `lib/db/drizzle.config.ts` uses a plain relative
  string (`"./src/schema/index.ts"`) instead — drizzle-kit resolves relative
  paths against its own cwd, which has no parens in it. If `db:push` ever
  regresses to "no schema files found," check this first.
- **Orval's zod-client and typescript-types generators can independently mint
  the *same* export name** for an inline (non-`$ref`) request body or a
  mixed path+query params object — e.g. `AdminUpdateLeadStatusBody` and
  `GetArticleBySlugParams` both appeared as a runtime const in
  `generated/api.ts` *and* a type in `generated/types/`. `export *`-ing both
  from `lib/api-zod/src/index.ts` then fails to compile ("already exported a
  member named X"). Fixed by making that file's re-export of `generated/types`
  an explicit named list rather than `export *` — see the comment there. If
  codegen adds a new operation with an inline body or mixed params and
  `pnpm run typecheck` fails the same way, add the missing type name to that
  list (or drop it, since `z.infer<typeof TheZodConst>` from `generated/api`
  covers the same shape).
- **The generated API layer mixes two zod import styles on purpose.**
  `lib/api-zod/src/generated/api.ts` (from Orval's zod-client) imports plain
  `'zod'` (v3 API surface); `lib/db/src/schema/*.ts` (drizzle-zod) imports
  `'zod/v4'`. Both come from the same `zod` package version — pick whichever
  matches the file you're editing, and don't mix `ZodType` type imports
  across the two paths (they're structurally different types).
- **No browser automation tool is wired into this session** (no `chromium-cli`,
  no MCP browser). To visually verify frontend changes, install Playwright
  into a scratch directory *outside* the repo (`npm install --no-save
  playwright` inside the repo fails — it inherits `.npmrc`'s
  `strict-peer-dependencies`/pnpm-oriented settings and errors). A plain temp
  dir with its own `package.json` works: `cd /tmp/somewhere && npm init -y &&
  npm install playwright && npx playwright install chromium`.
- **Radix `Select` renders a hidden native `<select>` alongside the visible
  listbox** (for form autofill/accessibility). A Playwright/testing-library
  `text=Option Label` locator matches the hidden `<option>` first and any
  `.click()` on it times out ("element is not visible"). Target the visible
  item with `[role="option"]:has-text("Option Label")` instead.
- **A Windows path with a leading `/` resolves against the current drive, not
  as a POSIX absolute path.** `fs.mkdir("/tmp/foo")` in a Node script run from
  Git Bash lands at `C:\tmp\foo`, not `C:\Users\...\AppData\Local\Temp\foo` —
  easy to lose an hour to when a script "succeeds" but the output file is
  nowhere you're looking. Use an explicit drive-letter path in scripts you
  intend to inspect afterward.
- `req.params.<name>` is typed `string | string[] | undefined` under
  Express 5's route-pattern typing once a router is annotated as `IRouter`
  (as every router in this codebase is, matching the existing `health.ts`
  convention). A bare `req.params.id!` therefore doesn't narrow to `string`.
  Use `requireParam(req, "id")` from `artifacts/api-server/src/lib/params.ts`
  instead — it narrows and 400s on a missing/duplicate param.
