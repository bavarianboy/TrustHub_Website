# Working notes

Setup, commands, and repo layout live in `README.md`. This file covers what you
can't infer from the code.

## Current state

- **Contact form is real.** `artifacts/trust-hub/src/pages/Contact.tsx` uses
  react-hook-form + `zodResolver(CreateLeadBody.omit({ locale: true }))` from
  `@workspace/api-zod`, and submits through the generated `useCreateLead()`
  mutation hook. No more `setTimeout` fake — a failed request shows a real
  error toast, a successful one resets the form.
- **News is real.** `/news` fetches `useListArticles`; category filter,
  featured/regular split, loading skeletons, empty and error states are all
  driven by the live response, not a hardcoded array. `/news/:slug`
  (`NewsArticle.tsx`) fetches `useGetArticleBySlug` and renders the full
  article. Missing/unpublished slugs show a not-found state instead of
  crashing.
- **The site is bilingual (EN/AR).** Chrome — nav, footer, form labels, system
  messages — pulls copy from `src/i18n/locales/{en,ar}.json` via
  `react-i18next`. `/ar/...` is a real path prefix (see Architecture
  decisions), RTL layout uses Tailwind logical properties throughout, and
  fonts are self-hosted via `@fontsource` (Plus Jakarta Sans / Playfair
  Display for EN, IBM Plex Sans Arabic for AR — swapped via `[dir="rtl"]` in
  `index.css`).
- **About/Services/Workspace/Contact content is DB-backed and admin-editable**,
  not static JSON — the one exception to the paragraph above. `page_content`
  (`lib/db/src/schema/page-content.ts`) stores one JSONB blob per
  (page, locale), typed per page by a dedicated Zod schema
  (`AboutContent`/`ServicesContent`/`WorkspaceContent`/`ContactContent` in the
  OpenAPI spec) rather than a generic CMS shape. Public pages fetch
  `useGet{About,Services,Workspace,Contact}Content({ locale })`; the admin
  editors at `/admin/pages/*` fetch both locales at once and save both in a
  single PUT. It was migrated *out* of the locale JSON files in this pass —
  see `scripts/src/seed-page-content.ts` and `seed-contact-content.ts`,
  one-time migration scripts, not repeatable seeds (re-running them overwrites
  any admin edits with the original static copy).
  `ContactContent.socialLinks` (`{name, label, href}[]`) is locale-independent
  data forced into a locale-keyed table: the admin `ContactEditor` renders one
  Social Links section (not inside the EN/AR tabs) and mirrors the same array
  into both `en.socialLinks` and `ar.socialLinks` on save. Both `Footer.tsx`
  and `Contact.tsx` fetch `useGetContactContent({ locale })` independently for
  address/phone/hours/socialLinks — there is no longer a static copy in
  `i18n/locales/*.json` to drift out of sync.
- **Each service on `/services` can have a real uploaded image.**
  `ServicesContent.list[].image` is a plain string URL, optional (not in
  `required`) so pre-existing rows without one still parse — an empty string
  is the "no image" sentinel, same convention as everywhere else. Real file
  upload, not a pasted URL: `POST /admin/uploads` (`artifacts/api-server/src/
  routes/admin/uploads.ts`) takes a `multipart/form-data` file via `multer`,
  validates it's JPEG/PNG/WebP/GIF and ≤5MB, writes it to `artifacts/
  api-server/uploads/` (gitignored — dev-only local disk; swap for
  S3-compatible object storage before production) under a random UUID
  filename, and returns `{ url: "/api/uploads/<uuid>.<ext> " }`. That
  directory is served back out via `express.static` mounted at
  `/api/uploads` in `app.ts`, unauthenticated (only the upload POST is
  session-gated) — the returned URL is a plain path, so `<img src>` works
  directly in both dev (Vite proxies `/api` to the API server) and prod
  (same origin, same process). Like `socialLinks`, an image is
  locale-independent data living inside a per-locale JSONB row: `ServicesEditor.tsx`
  writes any upload to `en.list[idx].image` **and** `ar.list[idx].image` in
  the same `setValue` call (not deferred to submit, unlike `socialLinks`),
  so the two tabs' previews never disagree even mid-edit. On `/services`,
  `service.image` falsy (missing or `""`) falls back to the original
  icon-in-a-box placeholder — never a broken `<img>`.
- **The admin panel is real**, at `/admin` (`src/admin/`), English-only,
  lazy-loaded so its ~61KB chunk never ships to marketing-site visitors.
  Login, a leads inbox (status filter, CSV export, inline status change), an
  article editor with EN/AR tabs writing both `article_translations` rows in
  one save, and page-content editors for About/Services/Workspace/Contact/
  Privacy/Terms (same EN/AR-tabs pattern). `robots.txt` disallows `/admin` and
  the panel additionally sets `<meta name="robots" content="noindex, nofollow">`
  while mounted.
- **The API is real**: `leads`, `auth` (login/logout/me), public `articles`
  and `page-content`, and `admin/leads` + `admin/articles` +
  `admin/page-content` CRUD are implemented, schema-validated end to end, and
  tested against a live Neon database (see `lib/db/src/schema/` and
  `artifacts/api-server/src/routes/`).
- **Contact details are real, not placeholders**: address, phone
  (`+966 54 911 0014`), and email (`advisor@trusthub.com.sa`) are the same
  across the footer, Contact page, and Workspace page, all sourced from the
  same `ContactContent` row rather than being copy-pasted in three places.
  Privacy Policy and Terms of Service pages exist at `/privacy` and `/terms`
  (draft boilerplate — **not reviewed by counsel**, flagged as such in
  `scripts/src/seed-legal-content.ts`'s header comment; get real legal review
  before launch). The Workspace map (`Workspace.tsx`) is a real Google Maps
  `output=embed` iframe pinned at verified coordinates
  (`24.6714177,46.7220544`, resolved from the business's Google Maps listing
  link) rather than a text-search query against the address string, which
  didn't reliably resolve to the right pin. **Social media links are real**:
  Facebook, LinkedIn, YouTube, TikTok, Instagram — editable from the admin
  Contact page, rendered in the footer via a `name` → icon lookup
  (`SOCIAL_ICONS` in `Footer.tsx`); an unrecognized `name` falls back to a
  generic share icon rather than breaking.
- **Article `category` is not localized** — it's a single plain column on
  `articlesTable`, not per-locale like title/excerpt/body. An Arabic visitor
  currently sees whatever string the admin typed into Category, in whichever
  language that was. Fixing this means moving category into (or alongside)
  `article_translations`; flagged, not fixed, since it's a schema change.
  `pnpm --filter @workspace/scripts run seed-admin -- <email> <password>
  [name]` remains the only way to create or update an admin login.

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
  each language is separately indexable with `hreflang` alternates
  (`useDocumentMeta`). Locale is derived once, at the top of `App.tsx`, from
  the raw unprefixed pathname (`useLocation()` called *outside* any wouter
  `Router`) — that value feeds the locale-scoped `<WouterRouter base="/ar">`
  wrapping the marketing routes. wouter's `base` then rewrites every
  `<Link href>` automatically, so page components never construct
  locale-prefixed URLs themselves.
- **Admin is a separate route tree, not part of the locale system.** `App.tsx`
  checks the raw pathname for `/admin` *before* computing locale and branches
  to a lazily-imported `AdminApp` with its own `<WouterRouter base="/admin">`.
  It has no i18n — English only, by design.
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
- **Any hook called from inside a page component sees a base-relative
  pathname, not the raw one** — `useLocation()` there is already inside the
  locale-scoped `<WouterRouter base="/ar">`, so it has the prefix stripped.
  `useDocumentMeta` originally re-derived locale by calling `useLocation()`
  again and parsing for `/ar`, which meant it always saw `/services` and
  always concluded "en" — the canonical tag pointed at the English URL even
  on the Arabic page. Fixed by reading `i18n.language` instead (kept in sync
  by the one `useLocation()` call that's outside the Router, in `App.tsx` /
  `useLocale.ts`). Same trap avoided in `Navbar.tsx`'s language switcher by
  the same means — don't reintroduce a second raw-path parse anywhere else.
- **A `<FormControl>` (shadcn's form wrapper around Radix `Slot`) must wrap
  exactly one real element, never a `Fragment`.** Slot clones its child and
  injects `id`/`aria-*` props onto it; handed a `<>...</>`, React logs
  "Invalid prop `id` supplied to `React.Fragment`" for every prop it tries to
  inject. Hit this wrapping an `<Input>` + `<datalist>` together in
  `ArticleEditor.tsx`'s category field — fix was moving the `<datalist>`
  outside `<FormControl>`, as a sibling, not a fix to `FormControl` itself.
- **Every shadcn `FormLabel`/`FormControl`/`FormDescription`/`FormMessage`
  calls `useFormField()`, which throws unless it's rendered inside a
  `<FormField>`'s `render` callback** — there's no fallback, it crashes the
  whole page (`"useFormField should be used within <FormField>"`), not just
  that one element. Bit this twice while adding one-off UI (a static hint
  paragraph, a field-less "Image" section label) next to `<FormField>` blocks
  in `ContactEditor.tsx` and `ServicesEditor.tsx` — both times the fix was a
  plain `<p>`/text element instead of the shadcn Form component, not moving
  anything inside a `FormField`. Reach for a plain element, not `FormLabel`
  or `FormDescription`, for any label/hint that isn't paired 1:1 with a
  registered form field.
- **React Query's default `retry: 3` turns an expected 401 into a multi-second
  spinner.** `useGetCurrentUser()` 401s on every first visit to `/admin` (not
  logged in yet) — with default retries, that's three backed-off attempts
  before the login form appears. `AdminApp.tsx` passes `{ query: { retry:
  false, queryKey: getGetCurrentUserQueryKey() } }`; the explicit `queryKey`
  is required only to satisfy `UseQueryOptions`'s type (the hook supplies it
  by default at runtime regardless) — omitting it is a type error, not a
  runtime bug, so don't "simplify" it away.
- **`useForm()` without synchronous `defaultValues` renders every `<Input>`
  uncontrolled on the first paint**, even if the field is invisible behind an
  `isLoading` guard — React warns "changing an uncontrolled input to be
  controlled" the instant `form.reset(fetchedData)` runs in a `useEffect`,
  because the render that mounted the `<Input>` already committed with
  `value={undefined}`. Hit this in all three page-content editors (About/
  Services/Workspace). Fix: pass a same-shaped `EMPTY_VALUES` object (every
  field `""`, every array `[]`) as `defaultValues`, matching the pattern
  `ArticleEditor.tsx` already used — never leave `useForm` with no
  `defaultValues` when the form will later be `.reset()` with async data.
- **A dual-locale array field (About's `values`, Services' `list`,
  Workspace's `types`/`faqs`) needs its add/remove to touch both locales'
  arrays together**, not just the currently-visible tab's. The public pages
  render `en.values[i]` and `ar.values[i]` as pairs by index — if EN gets 4
  cards and AR still has 3, they silently misalign rather than erroring.
  `useSyncedArray` (`admin/pages/page-content/useSyncedArray.ts`) is the
  shared helper for this; reuse it for any future array field instead of
  wiring `useFieldArray` per-locale.
- **`workspace.amenities` and any `features: string[]` field is a plain
  newline-separated `<Textarea>`, not a synced array** — there's no add/remove
  UI enforcing matching EN/AR line counts the way `useSyncedArray` does for
  object arrays (values/list/types/faqs). `amenities` specifically is also
  rendered by position against a fixed `amenityIcons[idx]` array on the public
  page, so a mismatched count between locales shows a different number of
  amenity chips per language, and any index past the 6 known icons silently
  falls back to a repeated Wifi icon rather than erroring. The editor's
  `FormDescription` under that field is the only guard against this today —
  if it becomes a real problem, give `amenities` the same synced-array
  treatment as the object-array fields.
- **The Google Maps `output=embed` iframe (Workspace page) takes several
  seconds to paint tiles** — a screenshot or check taken right after the
  iframe element appears in the DOM will show a blank white box that looks
  broken but isn't; wait ~5s (or check for actual tile content) before
  concluding the embed failed. Confirmed working by curl-ing the embed URL
  directly (follows a redirect to `maps.google.com/maps/embed?...`, 200) and
  by waiting longer before re-screenshotting.
- **`sitemap.xml` (`artifacts/trust-hub/public/sitemap.xml`) hardcodes a
  placeholder domain** (`https://www.trusthub.com.sa`, matching the real
  email domain) since no production host is chosen yet — update every `<loc>`
  and the `Sitemap:` line in `robots.txt` once one is. It also only lists the
  fixed marketing routes; news articles are DB-driven and not included — a
  real fix would generate their URLs from the API rather than hand-edit XML.
