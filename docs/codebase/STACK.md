# Tech Stack — XYZT Ad Consolidator

> Source-of-truth snapshot of every runtime dependency, dev tool, and external service. Last verified against `package.json`, `package-lock.json`, and `.env.example` on 2026-06-01.

## Project Identity

| Field | Value | Evidence |
| --- | --- | --- |
| Name | `xyzt-ad-consolidator` | `package.json:2` |
| Version | `1.0.0` | `package.json:3` |
| Type | Private web app (Next.js Pages Router) | `package.json:4` |
| Target deployment | Vercel (region `iad1`) | `vercel.json:1-12` |
| License | MIT | `README.md:151` |

## Runtime Versions

| Component | Version | Source |
| --- | --- | --- |
| Next.js | `^14.2.0` (Pages Router) | `package.json:12` |
| React | `^18.3.0` | `package.json:13` |
| React DOM | `^18.3.0` | `package.json:14` |
| Node engine | `>=18.17.0` (transitively required by Clerk backend) | `package-lock.json` `@clerk/backend` engines |
| JavaScript | Plain JS (no TypeScript) | All source files use `.js`/`.jsx`; no `tsconfig.json` |

## Production Dependencies (`dependencies`)

| Package | Pinned | Purpose | Evidence |
| --- | --- | --- | --- |
| `next` | `^14.2.0` | App framework, SSR, API routes | `package.json:12` |
| `react` | `^18.3.0` | UI library | `package.json:13` |
| `react-dom` | `^18.3.0` | DOM renderer | `package.json:14` |
| `lucide-react` | `^0.400.0` | Icon set (only icon lib installed; not actually used — UI inlines SVGs) | `package.json:15` |
| `@clerk/nextjs` | `^5.0.0` | Authentication, sign-in/up UI, `useUser`, `SignIn`/`SignUp` components, webhook verification | `package.json:16`, `src/middleware.js`, `src/pages/_app.js` |
| `stripe` | `^14.0.0` | Server-side Stripe SDK for checkout sessions and webhook verification | `package.json:17`, `src/pages/api/checkout/index.js`, `src/pages/api/webhooks/stripe.js` |
| `@supabase/supabase-js` | `^2.38.0` | Supabase Postgres client + Storage for ad images | `package.json:18`, `src/lib/supabase.js` |

## Dev Tooling (`devDependencies`)

| Package | Pinned | Purpose |
| --- | --- | --- |
| `tailwindcss` | `^3.4.0` | Utility-first CSS pipeline |
| `postcss` | `^8.4.0` | Tailwind preprocessor |
| `autoprefixer` | `^10.4.0` | Vendor prefixes |

> **No test framework, linter, or formatter is installed.** No `eslint`, `prettier`, `jest`, `vitest`, `playwright`, or `cypress` in `package.json` or `devDependencies`. No lint/format config files at repo root (scan output line 185).

## NPM Scripts

From `package.json:5-10`:

| Script | Command | Notes |
| --- | --- | --- |
| `dev` | `next dev` | Local dev server |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve built app |
| `lint` | `next lint` | Next.js's built-in ESLint wrapper — works but no custom config exists |

## Required Environment Variables

Pulled from `.env.example` and verified in code at `src/lib/supabase.js`, `src/pages/api/checkout/index.js`, `src/pages/api/upload/index.js`, `src/pages/api/contact.js`, `src/pages/api/webhooks/stripe.js`, `src/pages/api/webhooks/clerk.js`, `src/pages/_app.js`.

| Variable | Required? | Used by |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (for DB) | `src/lib/supabase.js:3`, every API route that touches DB |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (for DB) | `src/lib/supabase.js:4` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (for DB writes) | `src/lib/supabase.js:5`, all `supabaseAdmin` calls |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes (for auth) | `src/pages/_app.js:4` |
| `CLERK_SECRET_KEY` | Yes (for auth) | Clerk SDK; needed for server-side session validation |
| `CLERK_WEBHOOK_SECRET` | Yes (for user sync) | `src/pages/api/webhooks/clerk.js:15` |
| `STRIPE_SECRET_KEY` | Yes (for payments) | `src/pages/api/checkout/index.js:3`, `src/pages/api/webhooks/stripe.js:3` |
| `STRIPE_PRICE_PRO` | Yes (for Pro plan) | `src/pages/api/checkout/index.js:8` |
| `STRIPE_PRICE_BUSINESS` | Yes (for Business plan) | `src/pages/api/checkout/index.js:9` |
| `STRIPE_WEBHOOK_SECRET` | Yes (for webhook signature) | `src/pages/api/webhooks/stripe.js:19` |
| `NEXT_PUBLIC_BASE_URL` | Yes (for Stripe redirects) | `src/pages/api/checkout/index.js:33-34` |
| `CLOUDINARY_CLOUD_NAME` | Optional (image upload fallback) | `src/pages/api/upload/index.js:8` |
| `CLOUDINARY_UPLOAD_PRESET` | Optional (image upload fallback) | `src/pages/api/upload/index.js:9` |
| `RESEND_API_KEY` | Optional (contact form email) | `src/pages/api/contact.js:24` |
| `NEXT_PUBLIC_APP_URL` | Optional (not referenced in current code) | `.env.example:21` |

> `setup.sh` is a 620-line one-shot scaffolder that writes the entire project tree. It is not part of the runtime stack — it is a historical artifact included for reference. See `CONCERNS.md`.

## External Services (used at runtime)

| Service | Role | Evidence |
| --- | --- | --- |
| Clerk | Authentication (hosted sign-in/up, session, webhooks) | `src/middleware.js`, `src/pages/_app.js`, `src/pages/sign-in/[[...sign-in]].js`, `src/pages/sign-up/[[...sign-up]].js` |
| Supabase Postgres | Primary datastore (ads, profiles, categories, reviews, contact_messages) | `src/lib/supabase.js`, `supabase-setup.sql` |
| Supabase Storage | Image storage bucket `ad-images` (preferred upload target) | `src/pages/api/upload/index.js:34-41` |
| Cloudinary | Image storage fallback | `src/pages/api/upload/index.js:48-68` |
| Stripe | Subscriptions (Pro / Business) and hosted pricing tables | `src/pages/pricing.js:32,36`, `src/pages/api/checkout/index.js`, `src/pages/api/webhooks/stripe.js` |
| Resend | Transactional email for contact form | `src/pages/api/contact.js:29-39` |
| Stripe Pricing Tables JS | `<stripe-pricing-table>` web component (loaded from `js.stripe.com`) | `src/pages/pricing.js:21` |
| Google Fonts CDN | `DM Serif Display`, `Source Sans 3`, `JetBrains Mono` | `src/styles/globals.css:1` |

## Build & Deploy Tooling

- **No CI/CD pipelines** detected (no `.github/workflows`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci`).
- **No Docker** files (no `Dockerfile`, `docker-compose.yml`, k8s manifests).
- **Vercel** is the deploy target — `vercel.json` sets `framework: nextjs`, `buildCommand: npm run build`, `regions: ["iad1"]`, and pins `src/pages/api/**/*.js` to 60s timeout / 1024 MB memory.

## Frontend Stack (in code, not always in package.json)

- Tailwind CSS 3.4 with a custom design system (`brand` orange + `surface` warm gray scales, custom `glass-card`, `gradient-text`, `hover-lift`, `btn-primary`, `btn-secondary`, `input-field`, `badge-*` component classes). See `tailwind.config.js` and `src/styles/globals.css`.
- Custom Tailwind animations: `fade-in`, `slide-up`, `slide-down`, `pulse-soft`, `shimmer` (defined in `tailwind.config.js:43-70`).
- No icon library used despite `lucide-react` being installed — every page/component inlines its own SVG paths.

## Language Note

The project is plain JavaScript (`.js` / `.jsx`). The path alias `@/*` → `./src/*` is configured in `jsconfig.json:1-7` and used in `src/pages/_app.js:2`. No TypeScript config exists.
