# XYZT Ad Consolidator

A platform designed to gather, categorize, and present advertisements related to "xyzt" to 123456 now.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
xyzt-ad-consolidator/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Sticky header with search + category tabs
│   │   ├── AdCard.jsx          # Ad listing card with animations
│   │   ├── AdDetail.jsx        # Full ad detail modal with reviews
│   │   ├── StatsBar.jsx        # Platform stats overview
│   │   ├── SubmitAdModal.jsx   # New ad submission form
│   │   ├── NotificationPanel.jsx # Alert subscription panel
│   │   └── Footer.jsx          # Site footer with links
│   ├── lib/
│   │   ├── data.js             # Mock data store (replace with Supabase)
│   │   └── utils.js            # Formatting utilities
│   ├── pages/
│   │   ├── api/
│   │   │   ├── ads.js          # GET /api/ads - search & filter
│   │   │   ├── ads/[id].js     # GET /api/ads/:id - ad detail
│   │   │   └── stats.js        # GET /api/stats - platform stats
│   │   ├── _app.js             # App wrapper
│   │   ├── _document.js        # HTML document
│   │   └── index.js            # Homepage
│   └── styles/
│       └── globals.css         # Tailwind + custom styles
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── jsconfig.json
└── package.json
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
