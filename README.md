# XYZT Ad Consolidator

A platform designed to gather, categorize, and present advertisements related to "xyzt" to 123456 now.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Add your keys to .env.local (see below)
# Run development server
npm run dev
```

### Deploy to Vercel (1-Click)

**Easiest method** — deploy with the Vercel button:

1. Push this repo to your own GitHub account
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Add environment variables (see below)
5. Click **Deploy**

**Required environment variables:**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | From [clerk.com](https://clerk.com) |
| `CLERK_SECRET_KEY` | From [clerk.com](https://clerk.com) |
| `STRIPE_SECRET_KEY` | From [stripe.com](https://stripe.com) |
| `STRIPE_PRICE_PRO` | Stripe Price ID for Pro plan |
| `STRIPE_PRICE_BUSINESS` | Stripe Price ID for Business plan |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `NEXT_PUBLIC_BASE_URL` | Your Vercel URL (e.g. https://yourapp.vercel.app) |
| `NEXT_PUBLIC_SUPABASE_URL` | From [supabase.com](https://supabase.com) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase |
| `CLOUDINARY_CLOUD_NAME` | From [cloudinary.com](https://cloudinary.com) |
| `CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset |

**Optional (for emails):**

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | From [resend.com](https://resend.com) |

## 📁 Project Structure

```
xyzt-ad-consolidator/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Sticky header with search + category tabs
│   │   ├── AdCard.jsx          # Ad listing card with image thumbnails
│   │   ├── AdDetail.jsx        # Full ad detail modal with reviews
│   │   ├── StatsBar.jsx        # Platform stats overview
│   │   ├── SubmitAdModal.jsx   # New ad submission modal
│   │   ├── NotificationPanel.jsx # Alert subscription panel
│   │   └── Footer.jsx          # Site footer with links
│   ├── lib/
│   │   ├── supabase.js         # Supabase client (browser + admin)
│   │   ├── data.js             # Data layer — Supabase or mock fallback
│   │   └── utils.js            # Formatting utilities
│   ├── pages/
│   │   ├── api/
│   │   │   ├── ads.js          # GET/POST /api/ads
│   │   │   ├── ads/[id].js     # GET /api/ads/:id
│   │   │   ├── stats.js        # GET /api/stats
│   │   │   ├── contact.js      # POST /api/contact
│   │   │   ├── upload/index.js # POST /api/upload (Cloudinary)
│   │   │   └── webhooks/stripe.js # POST /api/webhooks/stripe
│   │   ├── _app.js             # App wrapper with ClerkProvider
│   │   ├── index.js            # Homepage with search/filter
│   │   ├── pricing.js          # Stripe Pricing Tables
│   │   ├── submit-ad/index.js  # 3-step ad submission wizard
│   │   ├── dashboard/index.js  # User dashboard (6 tabs)
│   │   ├── sign-in/[[...sign-in]].js
│   │   ├── sign-up/[[...sign-up]].js
│   │   ├── about.js
│   │   ├── contact.js
│   │   └── legal/{terms,privacy,dmca,cookies}.js
│   └── styles/
│       └── globals.css         # Tailwind + custom styles
├── supabase-schema.sql         # Database schema for Supabase
├── vercel.json                 # Vercel deployment config
├── tailwind.config.js
├── next.config.js
├── package.json
└── .env.example                # Environment variable template
```

## ✨ Features Implemented

### Core Features
- **🔍 Search** — Real-time keyword search across ad titles, descriptions, and locations
- **📂 Category Filtering** — Filter by Products, Services, Events, or All
- **📊 Sorting** — Sort by Featured, Newest, Top Rated, or Most Popular
- **📋 Ad Cards** — Glass-morphism cards with staggered entrance animations
- **📄 Ad Detail Modal** — Full ad view with reviews, ratings, and contact reveal
- **⭐ Reviews & Ratings** — Star ratings, user reviews, and review submission
- **🔔 Notification Subscriptions** — Subscribe to category/keyword alerts
- **📝 Ad Submission** — Full form for advertisers to submit new ads
- **📈 Stats Dashboard** — Platform-wide statistics overview
- **🏷️ Sponsored Ads** — Visual distinction for promoted content

### Design
- Responsive layout (mobile → desktop)
- Custom color palette with warm orange brand accents
- DM Serif Display + Source Sans 3 typography
- Glassmorphism UI with backdrop blur
- Subtle grain texture overlay
- Staggered slide-up animations on scroll
- Loading skeleton states
- Category-coded color strips

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ads` | Search/filter ads (query: q, category, sort, page, limit) |
| GET | `/api/ads/[id]` | Get single ad with reviews |
| GET | `/api/stats` | Get platform statistics |

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Styling**: Tailwind CSS 3.4
- **Language**: JavaScript (React 18)
- **Fonts**: Google Fonts (DM Serif Display, Source Sans 3)

## 🗺️ Roadmap (Post-MVP)

1. **Database**: Connect to Supabase (PostgreSQL) for persistent storage
2. **Auth**: Add NextAuth.js for user/advertiser accounts
3. **Search**: Integrate Meilisearch for full-text typo-tolerant search
4. **Real-time**: WebSocket updates for new ads via Socket.IO
5. **Notifications**: OneSignal push/email alerts
6. **Image Upload**: Ad image gallery with Cloudinary/S3
7. **Payments**: Stripe for sponsored ad purchases
8. **Admin Panel**: Approve/reject submitted ads
9. **Scraper**: Automated ad ingestion from approved sources

## 📄 License

MIT
