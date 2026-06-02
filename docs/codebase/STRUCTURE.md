# Directory Structure — XYZT Ad Consolidator

> Layout of source code, entry points, and key files. Built around Next.js Pages Router. Excludes generated/dependency directories (`node_modules/`, `.next/`).

## Top-Level Layout

```
AdConsolidator/
├── docs/                       # Project documentation
│   └── codebase/               # THIS knowledge pack (this skill's output)
├── src/                        # All source code
├── supabase-schema.sql         # Original schema with auth.users FK
├── supabase-setup.sql          # Current schema (Clerk + Supabase, idempotent)
├── package.json
├── package-lock.json
├── next.config.js
├── jsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── .env.example
├── .gitignore
├── info.md                     # Internal note about `npm audit fix --force`
├── README.md
└── setup.sh                    # One-shot scaffolder (not run by build)
```

## `src/` Layout (Next.js Pages Router)

```
src/
├── components/                 # 7 React components (see below)
├── lib/                        # Server-side data + utility modules
├── middleware.js               # Clerk auth middleware
├── pages/                      # File-based routing
│   ├── _app.js
│   ├── _document.js
│   ├── index.js                # Home — ad browse + search
│   ├── about.js
│   ├── contact.js
│   ├── pricing.js
│   ├── api/                    # Serverless API routes
│   ├── dashboard/index.js      # 6-tab account dashboard
│   ├── legal/                  # Static legal pages
│   ├── me/ads.js               # User's own ads
│   ├── sign-in/[[...sign-in]].js
│   ├── sign-up/[[...sign-up]].js
│   └── submit-ad/index.js      # 3-step submission wizard
└── styles/
    └── globals.css
```

## Entry Points

| Entry | File | Notes |
| --- | --- | --- |
| App wrapper (Clerk provider, global CSS) | `src/pages/_app.js` | Conditionally wraps in `<ClerkProvider>` only if `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set |
| HTML document (font, favicon, meta) | `src/pages/_document.js` | Loads SVG inline favicon, no external font preconnect |
| Edge middleware (Clerk auth on all non-static routes) | `src/middleware.js` | Matched against `/((?!_next|...))` and `/(api|trpc)(.*)` |
| Homepage with SSR | `src/pages/index.js` | `getServerSideProps` calls `getAds()` + `getStats()` directly (no `/api` HTTP roundtrip) |

## `src/components/` — Shared UI (7 files)

| File | Lines | Purpose |
| --- | --- | --- |
| `Header.jsx` | 102 | Sticky glass header; search form, category tabs, Clerk `useUser` for sign-in state |
| `AdCard.jsx` | 96 | Grid card with image, category badge, sponsored flag, rating, views |
| `AdDetail.jsx` | 246 | Full-screen modal: image gallery, description, contact reveal, review submission, star ratings |
| `StatsBar.jsx` | 30 | 4-stat platform overview (Active Ads, Reviews, Avg Rating, Total Views) |
| `SubmitAdModal.jsx` | 255 | Inline modal for ad submission (sign-in gate → form → success state) |
| `NotificationPanel.jsx` | 124 | Email-alert subscription modal (categories + keywords) |
| `Footer.jsx` | 56 | Static footer with platform/company/legal columns |

## `src/lib/` — Server-side Modules

| File | Lines | Purpose |
| --- | --- | --- |
| `supabase.js` | 11 | Creates `supabase` (anon) and `supabaseAdmin` (service role) clients. `supabaseAdmin` is exported — see `CONCERNS.md` for why this is risky in code that gets imported from client. |
| `data.js` | 317 | The data access layer. Every function checks `isSupabaseConfigured()` and falls back to an in-memory `MOCK_ADS` array. Contains a Clerk-ID → Supabase-UUID `clerkIdCache` `Map`. **Note:** `getUserAds` at line 265 has a `return` bug — see `CONCERNS.md`. |
| `utils.js` | 34 | Pure helpers: `formatDate`, `formatNumber`, `getCategoryBadgeClass`, `generateStars` |

## `src/pages/api/` — HTTP Endpoints

```
api/
├── ads.js                      # GET (list/featured) + POST (create) — auto-routed as /api/ads
├── ads/
│   ├── [id].js                 # GET /api/ads/:id  (returns ad + reviews)
│   └── index.js                # POST /api/ads  (alternate create handler)
├── checkout/index.js           # POST /api/checkout  (Stripe subscription session)
├── contact.js                  # POST /api/contact  (Supabase + Resend)
├── stats.js                    # GET  /api/stats
├── upload/index.js             # POST /api/upload  (Supabase Storage → Cloudinary → dev fallback)
└── webhooks/
    ├── clerk.js                # POST /api/webhooks/clerk  (Svix-verified; sync profiles)
    └── stripe.js               # POST /api/webhooks/stripe  (event log only — TODO at line 37)
```

> **Routing quirk:** Next.js resolves `pages/api/ads.js` AND `pages/api/ads/index.js` to the same `/api/ads` POST. They handle the request slightly differently — see `CONCERNS.md` and `ARCHITECTURE.md`.

## `src/pages/` — Public + Auth Pages

| Path | File | Notes |
| --- | --- | --- |
| `/` | `index.js` | Browse, search, sort, category filter. SSR via `getServerSideProps`. |
| `/about` | `about.js` | Static company page (team, values, timeline). Hardcoded data. |
| `/contact` | `contact.js` | Form posts to `/api/contact`. |
| `/pricing` | `pricing.js` | Loads Stripe `<stripe-pricing-table>` web component via `useEffect`. |
| `/sign-in/[[...sign-in]]` | `sign-in/[[...sign-in]].js` | Catch-all Clerk `<SignIn />` with custom appearance. |
| `/sign-up/[[...sign-up]]` | `sign-up/[[...sign-up]].js` | Catch-all Clerk `<SignUp />` with custom appearance. |
| `/submit-ad` | `submit-ad/index.js` | 3-step wizard with image upload (compresses to 1200px JPEG quality 0.7 client-side). |
| `/dashboard` | `dashboard/index.js` | 6 tabs (Overview, My Ads, Saved, Alerts, Settings, Billing). Data is **hardcoded** in-component, NOT fetched from API. |
| `/me/ads` | `me/ads.js` | Lists the current user's ads. Calls `getUserAds(user.id)` from `lib/data.js` — affected by the `getUserAds` bug. |
| `/legal/terms` | `legal/terms.js` | Static markdown-ish terms. |
| `/legal/privacy` | `legal/privacy.js` | Static privacy policy. |
| `/legal/dmca` | `legal/dmca.js` | Static DMCA procedure. |
| `/legal/cookies` | `legal/cookies.js` | Static cookie policy. |

## `src/styles/globals.css` (135 lines)

Single CSS file. Three responsibilities:

1. **Google Fonts import** for `DM Serif Display`, `Source Sans 3`, `JetBrains Mono` (line 1).
2. **`@layer base`** — body gradient background, grain noise overlay, `font-body` / `bg-surface-50` defaults.
3. **`@layer components`** — the design-system utility classes: `glass-card`, `glass-dark`, `gradient-text`, `hover-lift`, `badge`, `badge-{products,services,events,other,sponsored}`, `input-field`, `btn-primary`, `btn-secondary`, `section-title`, `card-grid`.
4. **Custom scrollbar** and **staggered animation delay** utility classes (`.stagger-1` ... `.stagger-6`).

## Naming Conventions

- **File names:** `PascalCase.jsx` for components (`Header.jsx`, `AdCard.jsx`), `camelCase.js` for utilities and pages (`utils.js`, `submit-ad/index.js`).
- **Function/component names:** `PascalCase` for components, `camelCase` for helpers and hooks.
- **API route files:** lowercase resource names (`ads.js`, `stats.js`, `contact.js`).
- **Constants:** `UPPER_SNAKE_CASE` (`PRICE_MAP`, `CLERK_PUBLISHABLE_KEY`, `MOCK_ADS`).
- **DB column names:** `snake_case` (`user_id`, `created_at`, `is_sponsored`, `contact_email`).
- **Tailwind palette:** two custom scales — `brand` (orange) and `surface` (warm gray) — defined in `tailwind.config.js:9-37`.

## Hidden / Notable Non-Source Files

| Path | Notes |
| --- | --- |
| `.gitignore` | Ignores `.next/`, `node_modules/`, `package-lock.json`, `.env.local`, `info.md` (only `info.md` is ignored by name; `package-lock.json` being ignored is unusual for a Next.js project) |
| `info.md` | Internal note explaining why `npm audit fix --force` was avoided (would force Next.js 14 → 16). The note is gitignored. |
| `setup.sh` | 620-line shell script that scaffolds the project (writes every source file with `cat << EOF`). Historical artifact, not part of the build. |
| `supabase-schema.sql` | Original schema with `auth.users` foreign keys — uses `supabase auth` style. **Not the deployed schema.** |
| `supabase-setup.sql` | Current schema: Clerk `clerk_id` is stored as `text` on `profiles`, `ads.user_id` references `profiles.id` (UUID). Idempotent (`drop policy if exists` + `add column if not exists` patterns). |
| `vercel.json` | Sets `iad1` region, 60s function timeout, 1024MB memory for all API routes. |
