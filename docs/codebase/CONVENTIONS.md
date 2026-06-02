# Coding Conventions — XYZT Ad Consolidator

> Conventions observed in the source. Where the project has no formal config (linter, formatter, TypeScript), this captures the de-facto style.

## Language & Module System

- **JavaScript only.** No `.ts` / `.tsx` files. No `tsconfig.json`. Path alias `@/*` → `./src/*` is set in `jsconfig.json:1-7` and is the only TypeScript-adjacent config.
- **ES Modules syntax in source (`import`/`export`), CommonJS in config files** (`module.exports` in `next.config.js`, `tailwind.config.js`, `postcss.config.js`).
- **JSX** is used for components (`.jsx`); `.js` for pages, API routes, and utilities.

## File & Folder Naming

| Type | Convention | Examples |
| --- | --- | --- |
| React components | `PascalCase.jsx` | `Header.jsx`, `AdCard.jsx`, `SubmitAdModal.jsx` |
| Page components | `camelCase.js` or `kebab-case/index.js` | `index.js`, `about.js`, `submit-ad/index.js`, `sign-in/[[...sign-in]].js` |
| API routes | `camelCase.js` or `kebab-case/index.js` | `ads.js`, `ads/[id].js`, `webhooks/stripe.js` |
| Lib modules | `camelCase.js` | `supabase.js`, `data.js`, `utils.js` |
| Styles | single file `globals.css` | — |
| Static configs | `lowercase.config.js` | `next.config.js`, `tailwind.config.js`, `postcss.config.js` |
| DB schema | `kebab-case.sql` | `supabase-schema.sql`, `supabase-setup.sql` |

Catch-all Clerk routes use Next.js's `[[...slug]]` convention (`src/pages/sign-in/[[...sign-in]].js`).

## Naming Within Code

| Element | Convention | Example |
| --- | --- | --- |
| React components | `PascalCase` default export | `export default function Header(...)` |
| Helper functions | `camelCase` | `formatDate`, `resolveProfileId`, `clearProfileCache` |
| Variables | `camelCase` | `featuredAds`, `searchQuery`, `clerkIdCache` |
| Constants | `UPPER_SNAKE_CASE` for module-level | `MOCK_ADS`, `MOCK_REVIEWS`, `PRICE_MAP`, `CLERK_PUBLISHABLE_KEY` |
| DB columns | `snake_case` | `user_id`, `created_at`, `is_sponsored`, `contact_email` |
| Tailwind tokens | `kebab-case` (multi-word) | `glass-card`, `btn-primary`, `badge-products`, `gradient-text`, `hover-lift` |
| Custom Tailwind color scales | quoted string keys | `'brand-500'`, `'surface-900'` |
| Env vars | `UPPER_SNAKE_CASE` with `NEXT_PUBLIC_` prefix for browser-exposed | `NEXT_PUBLIC_SUPABASE_URL`, `CLERK_SECRET_KEY` |

## Imports & Module Organization

- Imports use the `@/...` alias when reaching into `src/` from `_app.js` (e.g. `src/pages/_app.js:2` → `import '@/styles/globals.css';`). Other files use **relative paths** (`../lib/data`, `../components/Header`).
- Within `src/pages/`, internal imports are consistently relative: `'../lib/data'`, `'../components/Header'`.
- Within `src/lib/`, internal imports are bare: `from './supabase'`, `from './utils'`.
- No barrel files (`index.js` re-exports). Each file exports its functions directly.
- No import sorting rule is enforced — packages and relative imports are mixed freely.

## Function & Component Style

- **Default export** for every component and page (`export default function Header(...)`).
- **Named exports** for utility functions (`export async function getAds(...)`, `export function formatDate(...)`).
- Functions inside components are defined inline, not hoisted to module level.
- No JSDoc / TSDoc anywhere in the codebase.
- No `// @ts-` directives.

## React Conventions

- **Hooks used:** `useState`, `useEffect`, `useCallback`, `useRef`, plus Clerk's `useUser` (`src/components/Header.jsx:7`, `src/pages/dashboard/index.js:8`, `src/pages/me/ads.js:9`, `src/components/SubmitAdModal.jsx:5`).
- **No custom hooks** are defined anywhere.
- **No memoization** (`useMemo`, `React.memo`) is used, even in the home page where `useEffect` re-fires on every state change.
- **No prop-types** or runtime validation. Trust + TypeScript-like inline comments only.
- **No context providers** beyond ClerkProvider and the built-in `StripePricingTable` web component.
- **Loading state pattern:** `const [loading, setLoading] = useState(true); ... .finally(() => setLoading(false))`.
- **Empty state pattern:** `if (ads.length === 0) return <EmptyState />` — see `src/pages/me/ads.js:80-90`.

## Error Handling

- API routes: `try { ... } catch (err) { console.error(...); return res.status(500).json({...}) }`. See `src/pages/api/ads.js:17-19`, `src/pages/api/contact.js:40-42`.
- Data layer: returns `{ data, error, success }` shapes (e.g. `src/lib/data.js:195, 205, 262`). Callers decide.
- Console logging is the primary error surface. No Sentry, no Logtail, no Datadog.
- No global error boundary in `_app.js`.
- **No input validation library** (Zod, Yup, Joi). The data layer trusts `req.body` as-is.

## Logging

- `console.log` and `console.error` only.
- Webhook handlers use emoji prefixes for visual scanability: `console.log('✅ Checkout completed:', ...)`, `'🆕 Subscription created'`, `'❌ Subscription deleted'`, `'💳 Invoice paid'`, `'⚠️ Payment failed'` (`src/pages/api/webhooks/stripe.js:42-58`).
- No structured logging (no JSON logs, no correlation IDs).

## CSS & Styling

- **Tailwind utility classes** for almost everything. Inline `style={{...}}` is used **only** for animation timing (`animationDelay: ${delay}s`).
- Design system lives in `src/styles/globals.css` `@layer components` and is referenced by class name: `glass-card`, `btn-primary`, `input-field`, `gradient-text`, `badge badge-products`, etc.
- **No CSS modules, no styled-components, no Emotion.**
- **Glassmorphism is the default look** — every container uses `glass-card rounded-2xl`.
- Animations are referenced by class name (`animate-fade-in`, `animate-slide-up`) defined in `tailwind.config.js`.

## Path Aliases

- `@/*` → `./src/*` (defined in `jsconfig.json`).
- Only one file uses it: `src/pages/_app.js` (`import '@/styles/globals.css'`).
- All other imports use relative paths.

## Things That Are NOT Enforced

- No ESLint config exists. `next lint` will work with the default Next.js preset but the repo has no `.eslintrc`.
- No Prettier config exists. Formatting is "whatever the author happened to type" — indentation is mostly 2 spaces, single quotes, semicolons, trailing commas. Consistency is high but not absolute.
- No commit-message convention (no `commitlint`, no `husky`).
- No branch-protection rules documented.
- No changelog or release notes.

## Idiom Frequency (rough)

| Idiom | Count |
| --- | --- |
| `useState` | ~50 |
| `useEffect` | ~5 |
| `useUser` (Clerk) | 4 |
| `console.error` | ~15 |
| `console.log` | ~10 |
| `try { ... } catch` | ~10 |
| `fetch('/api/...` from client | 4 (`contact.js`, `submit-ad/index.js`, `me/ads.js`, `SubmitAdModal.jsx`) |
