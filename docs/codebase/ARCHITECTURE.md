# Architecture — XYZT Ad Consolidator

> Patterns, layers, data flow, and cross-cutting concerns. This is a single Next.js 14 Pages-Router app; there are no separate services, no message queues, no event buses.

## High-Level Shape

```
                    ┌──────────────────────────┐
                    │   Browser (React 18)     │
                    │  ┌────────────────────┐  │
                    │  │  Pages + Components │  │
                    │  │  (Clerk <ClerkProvider>)│
                    │  └────────────────────┘  │
                    └────────┬─────────────────┘
                             │ SSR getServerSideProps OR fetch /api/*
                             ▼
                    ┌──────────────────────────┐
                    │   Next.js Pages Router   │
                    │  ┌────────────────────┐  │
                    │  │  pages/api/*.js    │  │
                    │  │  (serverless fns)  │  │
                    │  └─────────┬──────────┘  │
                    └────────────┼─────────────┘
                                 │ calls into
                                 ▼
                    ┌──────────────────────────┐
                    │   src/lib/data.js        │
                    │   (Supabase or mock)     │
                    └────┬────────────┬────────┘
                         │            │
              ┌──────────▼─┐    ┌─────▼────────┐
              │ Supabase   │    │ In-memory    │
              │ Postgres + │    │ MOCK_ADS /   │
              │ Storage    │    │ MOCK_REVIEWS │
              └────┬───────┘    └──────────────┘
                   │
       ┌───────────┼────────────┐
       │           │            │
   ┌───▼────┐ ┌────▼─────┐ ┌────▼──────┐
   │ Clerk  │ │ Stripe   │ │ Resend    │
   │ (auth) │ │ (pay)    │ │ (email)   │
   └────────┘ └──────────┘ └───────────┘
```

## Layering

There are no formal "controller / service / repository" layers. Instead the code follows a pragmatic **two-tier split**:

1. **Client tier** — `src/pages/*` and `src/components/*`. Browser-only. Uses Clerk `useUser` / `SignIn` / `SignUp`. Imports `lib/data.js` only on SSR pages.
2. **Server tier** — `src/pages/api/*` (route handlers) + `src/lib/data.js` (data access). Uses `supabaseAdmin` (service role key) for writes, `supabase` (anon) for reads.

`src/lib/data.js` is the only place that knows about Supabase. Every API route imports from it.

## Request Lifecycle — `GET /` (Homepage)

1. `src/pages/index.js` runs `getServerSideProps()` on the server (`src/pages/index.js:190-200`).
2. Two parallel-ish calls: `getAds({ query: '', category: 'All', sort: 'default' })` and `getStats()`.
3. `getAds` checks `isSupabaseConfigured()`. If yes, runs a Supabase query with `count: 'exact'`, optional `category` filter, optional sort. If no, filters/sorts the in-memory `MOCK_ADS` array.
4. The full result (`{ ads, total, page, totalPages }`) is passed to the page as `initialAds`.
5. The page renders `<AdCard>` for each ad. After hydration, client-side state changes (`searchQuery`, `activeCategory`, `sortBy`) trigger a re-fetch by calling `getAds({ query, category, sort })` directly from `lib/data.js` — **not via `/api/ads`**. This is a code smell: the homepage bypasses the API layer and calls the data layer twice (SSR + client).
6. Clicking an ad triggers `handleAdClick` → `getAdById(id)` + `getReviewsByAdId(id)` (client-side) → opens `<AdDetail>` modal.

## Request Lifecycle — `POST /api/ads` (Create Ad)

1. `src/pages/submit-ad/index.js` or `src/components/SubmitAdModal.jsx` POSTs JSON to `/api/ads`.
2. **Two possible handlers** are matched (Next.js routing ambiguity — see `CONCERNS.md`):
   - `src/pages/api/ads.js` (lines 23-40) — accepts the body as-is, sets defaults (`status='pending'`, `views=0`, `sponsored=false`), calls `createAd()`.
   - `src/pages/api/ads/index.js` — validates `title` and `category_id`, calls `createAd()`.
3. `createAd()` in `data.js:239-263`:
   - If Supabase not configured → pushes a fake record into `MOCK_ADS`.
   - If Clerk user ID detected (`user_xxx` prefix) → resolves it to the Supabase profile UUID via `resolveProfileId()` (cached in `clerkIdCache` Map).
   - Inserts into `public.ads` via `supabaseAdmin`.
4. Returns 201 + ad object, or 400 + error.

## Request Lifecycle — `POST /api/webhooks/clerk` (User Sync)

1. Clerk fires `user.created` / `user.updated` / `user.deleted` webhook to this endpoint.
2. Handler reads raw body and three `svix-*` headers (`src/pages/api/webhooks/clerk.js:18-21`).
3. Signature verified manually with HMAC-SHA256 (`verifySvixSignature` at lines 50-59). Uses `require('crypto')` inside the function — see `CONCERNS.md` for why this is wrong in an Edge module.
4. On `user.created`/`user.updated`: upserts into `public.profiles` with the Clerk ID, primary email, name, avatar, phone.
5. On `user.deleted`: deletes from `public.profiles` by `clerk_id`.

## Cross-Cutting Concerns

### Auth

- Clerk's `clerkMiddleware` from `@clerk/nextjs/server` runs on every non-static route (`src/middleware.js:1-10`).
- `src/pages/_app.js` conditionally wraps the app in `<ClerkProvider>` — if the publishable key is missing, the app renders raw, which means pages that call `useUser()` will throw.
- The home page (`src/pages/index.js`) works without auth.
- `/dashboard`, `/me/ads`, `/submit-ad`, and the in-component `SubmitAdModal` are **client-gated only** (check `isSignedIn` and render a sign-in prompt). There is **no server-side route guard** in the data layer — every API route trusts its inputs and assumes the caller is who they say they are.

### Clerk ↔ Supabase ID Bridge

Clerk user IDs are `user_xxx` (string). Supabase `profiles.id` is a UUID. They are bridged in `data.js:6-21` via a `clerkIdCache: Map`. The cache is populated:

- Lazily on first `resolveProfileId()` call.
- Eagerly on Clerk webhook sync (which fills the `profiles` row).
- Cleared via the exported `clearProfileCache()` — not currently called anywhere.

When a new user signs in via Clerk but the webhook hasn't yet fired, `resolveProfileId` returns `null` and `createAd` falls back to `user_id: null`. The schema was relaxed (`alter table public.ads alter column user_id drop not null;` in `supabase-setup.sql:82`) to allow this.

### Data Layer Fallback Strategy

Every function in `data.js` follows the same pattern:

```js
if (!isSupabaseConfigured()) { /* operate on in-memory MOCK_ADS */ }
else { /* run Supabase query */ }
```

This lets the project run locally without a Supabase project, and lets the `setup.sh` scaffolder produce a working app out-of-the-box. It also masks schema or env misconfiguration: a typo in `NEXT_PUBLIC_SUPABASE_URL` will silently fall back to mocks.

### Image Upload (3-tier)

`src/pages/api/upload/index.js`:

1. **Supabase Storage** if `SUPABASE_SERVICE_ROLE_KEY` is set — uploads to `ad-images` bucket, returns public URL.
2. **Cloudinary** if `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_UPLOAD_PRESET` are set — fallback.
3. **Dev fallback** — returns the data URL as-is (no actual upload).

The client pre-processes images in `submit-ad/index.js:11-36`: max 1200px, JPEG quality 0.7, max 5MB per file, max 5 files per ad. Compression is done in the browser via `<canvas>`.

### Pricing / Payments

- `/pricing` renders Stripe-hosted `<stripe-pricing-table>` web components — the actual price IDs and copy live in Stripe, not in this codebase (`src/pages/pricing.js:30-37`).
- The custom checkout endpoint `POST /api/checkout` (`src/pages/api/checkout/index.js`) creates a Stripe Checkout session with two hardcoded plan keys (`pro`, `business`) and price IDs from env vars.
- The Stripe webhook handler (`src/pages/api/webhooks/stripe.js:40-60`) currently only **logs events** — it does not update `profiles.stripe_subscription_id` or `subscription_status`. There's a TODO at line 37.

### Environment Gating

| Env state | Behavior |
| --- | --- |
| No Supabase | Mock data, no persistence, no image upload |
| Supabase, no Clerk | App works for browsing; Submit/Dashboard pages hit `useUser()` and render a fallback |
| Supabase + Clerk + Stripe + Resend | Full feature parity with what the code describes |

## Repeated Patterns

| Pattern | Where |
| --- | --- |
| **Async data fetch in `useEffect` with loading state** | `src/pages/me/ads.js:13-19`, `src/pages/dashboard/index.js` (uses hardcoded data instead) |
| **`isSignedIn` gate rendering a sign-in prompt** | `src/pages/dashboard/index.js:19-38`, `src/pages/submit-ad/index.js:48-67`, `src/components/SubmitAdModal.jsx:71-93`, `src/pages/me/ads.js:29-43` |
| **Glass-card + colored header strip + close button modal** | `src/components/AdDetail.jsx:23-245`, `src/components/SubmitAdModal.jsx:119-254`, `src/components/NotificationPanel.jsx:25-123` |
| **Conditional `<ClerkProvider>` wrapper in `_app.js`** | `src/pages/_app.js:7-13` |
| **Mock fallback when env is missing** | `src/lib/data.js` (every function) |
| **`getServerSideProps` calling `lib/data.js` directly** | `src/pages/index.js:190-200` |

## What's Intentionally Absent

- No state management library (no Redux, Zustand, Jotai, Context+Reducer). Page state is local `useState`.
- No service worker / PWA. No `manifest.json` referenced in `_document.js`.
- No internationalization framework. About page claims multi-language support but no `i18n` config exists.
- No analytics integration. About page claims "Data-driven growth" but no Segment / Plausible / GA.
- No automated tests. No test runner installed.
- No CI/CD. No `.github/workflows`.
- No error boundary. A render error in any page crashes the whole route.
- No CSRF protection on POST endpoints (Clerk-signed requests are protected, but the POST endpoints don't verify a Clerk session — they only trust `user_id` in the body).
