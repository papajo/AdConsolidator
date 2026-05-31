#!/bin/bash
# XYZT Ad Consolidator - Full Project Setup Script
# Run: chmod +x setup.sh && ./setup.sh

set -e

PROJECT="xyzt-ad-consolidator"

echo "🚀 Creating $PROJECT..."
mkdir -p "$PROJECT/src/"{components,lib,styles,pages/api/ads}
cd "$PROJECT"

# ─── package.json ───
cat > package.json << 'EOF'
{
  "name": "xyzt-ad-consolidator",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
EOF

# ─── next.config.js ───
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true }
module.exports = nextConfig
EOF

# ─── jsconfig.json ───
cat > jsconfig.json << 'EOF'
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
EOF

# ─── postcss.config.js ───
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} }
}
EOF

# ─── tailwind.config.js ───
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,jsx}', './src/components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50:'#fef7ee',100:'#fdedd3',200:'#fad7a5',300:'#f6b96d',400:'#f19132',500:'#ee7510',600:'#df5b07',700:'#b94209',800:'#93350e',900:'#772d0f',950:'#401405' },
        surface: { 50:'#f8f7f4',100:'#f0ede7',200:'#e0dace',300:'#ccc3b0',400:'#b6a790',500:'#a69279',600:'#99826c',700:'#806b5b',800:'#69584d',900:'#564940',950:'#2e2621' },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['"Source Sans 3"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
      },
    },
  },
  plugins: [],
}
EOF

# ─── src/styles/globals.css ───
cat > src/styles/globals.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Sans+3:wght@300;400;500;600;700;800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
  body { @apply font-body text-surface-900 bg-surface-50; }
}

@layer components {
  .glass-card { @apply bg-white/70 backdrop-blur-md border border-white/50 shadow-lg; }
  .gradient-text { @apply bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 bg-clip-text text-transparent; }
  .hover-lift { @apply transition-all duration-300 hover:-translate-y-1 hover:shadow-xl; }
  .badge { @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium; }
  .badge-products { @apply bg-emerald-100 text-emerald-800 border border-emerald-200; }
  .badge-services { @apply bg-blue-100 text-blue-800 border border-blue-200; }
  .badge-events { @apply bg-purple-100 text-purple-800 border border-purple-200; }
  .badge-other { @apply bg-surface-200 text-surface-700 border border-surface-300; }
  .badge-sponsored { @apply bg-amber-100 text-amber-800 border border-amber-200; }
  .input-field { @apply w-full px-4 py-3 bg-white/80 border border-surface-200 rounded-xl font-body text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all duration-200; }
  .btn-primary { @apply inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl shadow-md shadow-brand-500/20 hover:from-brand-700 hover:to-brand-600 hover:shadow-lg active:scale-[0.98] transition-all duration-200; }
  .btn-secondary { @apply inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-surface-200 text-surface-700 font-medium rounded-xl shadow-sm hover:bg-surface-50 hover:border-surface-300 active:scale-[0.98] transition-all duration-200; }
  .card-grid { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6; }
}
EOF

# ─── src/lib/utils.js ───
cat > src/lib/utils.js << 'EOF'
export function formatDate(dateString) {
  const days = Math.floor((new Date() - new Date(dateString)) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function getCategoryBadgeClass(category) {
  const map = { Products: "badge-products", Services: "badge-services", Events: "badge-events" };
  return map[category] || "badge-other";
}
EOF

# ─── src/lib/data.js ───
cat > src/lib/data.js << 'EOF'
const ads = [
  { id:1, title:"Premium XYZT Digital Marketing Package", description:"Complete digital marketing solution for businesses looking to reach the 123456 audience. Includes SEO, social media management, and targeted ad campaigns with proven ROI tracking.", category:"Services", contact_email:"marketing@xyztpro.com", contact_phone:"+1-555-0142", contact_website:"https://xyztpro.com", image_urls:[], location:"New York, NY", is_sponsored:true, status:"approved", advertiser_name:"XYZT Pro Agency", rating:4.8, review_count:24, created_at:"2026-05-28T10:00:00Z", views:1247 },
  { id:2, title:"XYZT Smart Device - Model X", description:"Next-generation smart device with 123456 connectivity protocols. Features include real-time sync, advanced analytics dashboard, and enterprise-grade security.", category:"Products", contact_email:"sales@xyztdevices.io", contact_phone:"+1-555-0198", contact_website:"https://xyztdevices.io", image_urls:[], location:"San Francisco, CA", is_sponsored:false, status:"approved", advertiser_name:"XYZT Devices Inc", rating:4.5, review_count:67, created_at:"2026-05-27T14:30:00Z", views:892 },
  { id:3, title:"XYZT Annual Conference 2026", description:"Join 5000+ professionals at the largest XYZT industry conference. Keynote speakers, workshops, networking events, and exclusive product launches.", category:"Events", contact_email:"events@xyztconf.com", contact_phone:"+1-555-0234", contact_website:"https://xyztconf.com", image_urls:[], location:"Austin, TX", is_sponsored:true, status:"approved", advertiser_name:"XYZT Events Group", rating:4.9, review_count:156, created_at:"2026-05-26T09:00:00Z", views:3421 },
  { id:4, title:"XYZT Automation Platform for 123456", description:"Streamline your 123456 workflows with our AI-powered automation platform. Reduce manual tasks by 80%, integrate with 200+ tools, and scale effortlessly.", category:"Services", contact_email:"hello@xyztauto.com", contact_phone:null, contact_website:"https://xyztauto.com", image_urls:[], location:"London, UK", is_sponsored:false, status:"approved", advertiser_name:"XYZT Automation Ltd", rating:4.3, review_count:41, created_at:"2026-05-25T16:45:00Z", views:654 },
  { id:5, title:"Bulk XYZT Hardware Components", description:"Wholesale pricing on certified XYZT-compatible hardware. Chips, sensors, connectors, and complete assembly kits. Minimum order 100 units.", category:"Products", contact_email:"wholesale@xyztparts.net", contact_phone:"+1-555-0367", contact_website:"https://xyztparts.net", image_urls:[], location:"Shenzhen, China", is_sponsored:false, status:"approved", advertiser_name:"XYZT Parts Global", rating:4.1, review_count:89, created_at:"2026-05-24T08:20:00Z", views:1103 },
  { id:6, title:"XYZT Certification Training Workshop", description:"Become XYZT-123456 certified in just 5 days. Hands-on training with industry experts, real-world projects, and guaranteed job placement assistance.", category:"Events", contact_email:"training@xyztacademy.org", contact_phone:"+1-555-0451", contact_website:"https://xyztacademy.org", image_urls:[], location:"Chicago, IL", is_sponsored:false, status:"approved", advertiser_name:"XYZT Academy", rating:4.7, review_count:203, created_at:"2026-05-23T11:15:00Z", views:2089 },
  { id:7, title:"XYZT Data Analytics Consulting", description:"Expert consulting for organizations leveraging 123456 data streams. Custom dashboards, predictive modeling, and actionable insights.", category:"Services", contact_email:"consult@xyztanalytics.com", contact_phone:"+1-555-0523", contact_website:"https://xyztanalytics.com", image_urls:[], location:"Toronto, Canada", is_sponsored:false, status:"approved", advertiser_name:"XYZT Analytics Co", rating:4.6, review_count:37, created_at:"2026-05-22T13:30:00Z", views:478 },
  { id:8, title:"XYZT Mobile App Development Kit", description:"Build mobile apps with native XYZT-123456 integration in minutes. Cross-platform SDK with pre-built UI components and offline-first architecture.", category:"Products", contact_email:"devrel@xyztmobile.dev", contact_phone:null, contact_website:"https://xyztmobile.dev", image_urls:[], location:"Berlin, Germany", is_sponsored:true, status:"approved", advertiser_name:"XYZT Mobile GmbH", rating:4.4, review_count:112, created_at:"2026-05-21T07:00:00Z", views:1876 },
  { id:9, title:"XYZT Security Audit Services", description:"Comprehensive security assessments for 123456-connected systems. Penetration testing, vulnerability scanning, and compliance reporting.", category:"Services", contact_email:"security@xyztsec.io", contact_phone:"+1-555-0687", contact_website:"https://xyztsec.io", image_urls:[], location:"Washington, DC", is_sponsored:false, status:"approved", advertiser_name:"XYZT Security", rating:4.9, review_count:28, created_at:"2026-05-20T15:00:00Z", views:534 },
];

const reviews = [
  { id:1, ad_id:1, user_name:"Alex M.", rating:5, comment:"Incredible results! Our ROI tripled within the first month.", created_at:"2026-05-29T10:00:00Z" },
  { id:2, ad_id:1, user_name:"Sarah K.", rating:4, comment:"Great service, responsive team. Slightly pricey but worth it.", created_at:"2026-05-28T14:30:00Z" },
  { id:3, ad_id:2, user_name:"James R.", rating:5, comment:"Best device on the market. Setup was seamless.", created_at:"2026-05-27T09:15:00Z" },
  { id:4, ad_id:2, user_name:"Linda P.", rating:4, comment:"Good build quality. Battery life could be better.", created_at:"2026-05-26T16:45:00Z" },
  { id:5, ad_id:3, user_name:"Mike T.", rating:5, comment:"Last year's conference was phenomenal. Already registered for 2026!", created_at:"2026-05-25T11:30:00Z" },
  { id:6, ad_id:3, user_name:"Rachel W.", rating:5, comment:"The networking alone was worth the ticket price.", created_at:"2026-05-24T08:00:00Z" },
  { id:7, ad_id:6, user_name:"David L.", rating:5, comment:"Got certified and landed a new job within 2 weeks!", created_at:"2026-05-23T13:00:00Z" },
  { id:8, ad_id:8, user_name:"Emma C.", rating:4, comment:"SDK is powerful but documentation could be clearer.", created_at:"2026-05-22T10:30:00Z" },
];

export function getAds({ query, category, sort, page = 1, limit = 9 }) {
  let filtered = [...ads];
  if (query) { const q = query.toLowerCase(); filtered = filtered.filter(ad => ad.title.toLowerCase().includes(q) || ad.description.toLowerCase().includes(q) || ad.location.toLowerCase().includes(q)); }
  if (category && category !== "All") filtered = filtered.filter(ad => ad.category === category);
  switch (sort) {
    case "newest": filtered.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)); break;
    case "rating": filtered.sort((a,b) => b.rating - a.rating); break;
    case "popular": filtered.sort((a,b) => b.views - a.views); break;
    default: filtered.sort((a,b) => { if (a.is_sponsored && !b.is_sponsored) return -1; if (!a.is_sponsored && b.is_sponsored) return 1; return new Date(b.created_at) - new Date(a.created_at); });
  }
  const total = filtered.length;
  const paginated = filtered.slice((page-1)*limit, page*limit);
  return { ads: paginated, total, page, totalPages: Math.ceil(total/limit) };
}

export function getAdById(id) { return ads.find(ad => ad.id === parseInt(id)) || null; }
export function getReviewsByAdId(adId) { return reviews.filter(r => r.ad_id === parseInt(adId)); }
export function getCategories() { return ["All","Products","Services","Events","Other"]; }
export function getStats() { return { totalAds: ads.length, totalReviews: reviews.length, avgRating: (ads.reduce((s,a) => s+a.rating, 0)/ads.length).toFixed(1), totalViews: ads.reduce((s,a) => s+a.views, 0) }; }
EOF

# ─── src/pages/_app.js ───
cat > src/pages/_app.js << 'EOF'
import '@/styles/globals.css';
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
EOF

# ─── src/pages/_document.js ───
cat > src/pages/_document.js << 'EOF'
import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
  return (
    <Html lang="en">
      <Head><meta charSet="utf-8" /><meta name="description" content="XYZT Ad Consolidator" /></Head>
      <body><Main /><NextScript /></body>
    </Html>
  );
}
EOF

# ─── src/pages/api/ads.js ───
cat > src/pages/api/ads.js << 'EOF'
import { getAds } from '../../lib/data';
export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { q, category, sort, page, limit } = req.query;
  res.status(200).json(getAds({ query: q||'', category: category||'All', sort: sort||'default', page: parseInt(page)||1, limit: parseInt(limit)||9 }));
}
EOF

# ─── src/pages/api/ads/[id].js ───
cat > "src/pages/api/ads/[id].js" << 'EOF'
import { getAdById, getReviewsByAdId } from '../../../lib/data';
export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { id } = req.query;
  const ad = getAdById(id);
  if (!ad) return res.status(404).json({ error: 'Ad not found' });
  res.status(200).json({ ad, reviews: getReviewsByAdId(id) });
}
EOF

# ─── src/pages/api/stats.js ───
cat > src/pages/api/stats.js << 'EOF'
import { getStats } from '../../lib/data';
export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.status(200).json(getStats());
}
EOF

# ─── src/components/Header.jsx ───
cat > src/components/Header.jsx << 'EOF'
import { useState } from 'react';
export default function Header({ onSearch, onCategoryChange, activeCategory }) {
  const [q, setQ] = useState('');
  const categories = ['All','Products','Services','Events'];
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-surface-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/20">
              <span className="text-white font-bold text-sm font-mono">XY</span>
            </div>
            <div>
              <h1 className="font-display text-xl text-surface-900 leading-none">XYZT Ad Consolidator</h1>
              <p className="text-xs text-surface-500 font-body">xyzt → 123456 now</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Browse</a>
            <a href="#" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Categories</a>
            <a href="#" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Submit Ad</a>
            <button className="btn-primary text-sm py-2 px-4">Sign In</button>
          </nav>
        </div>
        <div className="pb-4 pt-1">
          <form onSubmit={e => { e.preventDefault(); onSearch(q); }} className="flex gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Search advertisements..." className="input-field pl-10 pr-4" value={q} onChange={e => setQ(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary whitespace-nowrap">Search</button>
          </form>
        </div>
        <div className="flex gap-1 pb-3 overflow-x-auto">
          {categories.map(cat => (
            <button key={cat} onClick={() => onCategoryChange(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === cat ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' : 'text-surface-600 hover:bg-surface-100'}`}>{cat}</button>
          ))}
        </div>
      </div>
    </header>
  );
}
EOF

# ─── src/components/AdCard.jsx ───
cat > src/components/AdCard.jsx << 'EOF'
import { formatDate, getCategoryBadgeClass, formatNumber } from '../lib/utils';
export default function AdCard({ ad, onClick, index }) {
  const delay = (index % 6) * 0.08;
  const stripColor = ad.category === 'Products' ? 'from-emerald-400 to-teal-500' : ad.category === 'Services' ? 'from-blue-400 to-indigo-500' : ad.category === 'Events' ? 'from-purple-400 to-pink-500' : 'from-surface-300 to-surface-400';
  return (
    <article onClick={() => onClick(ad)} className="group glass-card rounded-2xl overflow-hidden hover-lift cursor-pointer opacity-0 animate-slide-up" style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}>
      <div className={`h-2 w-full bg-gradient-to-r ${stripColor}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`badge ${getCategoryBadgeClass(ad.category)}`}>{ad.category}</span>
            {ad.is_sponsored && <span className="badge badge-sponsored">⭐ Sponsored</span>}
          </div>
          <span className="text-xs text-surface-400">{formatDate(ad.created_at)}</span>
        </div>
        <h3 className="font-display text-lg text-surface-900 mb-2 group-hover:text-brand-700 transition-colors line-clamp-2">{ad.title}</h3>
        <p className="text-sm text-surface-600 leading-relaxed mb-4 line-clamp-2">{ad.description}</p>
        <div className="flex items-center justify-between pt-3 border-t border-surface-100">
          <span className="text-xs text-surface-500">📍 {ad.location}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-surface-700">⭐ {ad.rating} <span className="text-surface-400 font-normal">({ad.review_count})</span></span>
            <span className="text-xs text-surface-400">👁 {formatNumber(ad.views)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
EOF

# ─── src/components/AdDetail.jsx ───
cat > src/components/AdDetail.jsx << 'EOF'
import { useState } from 'react';
import { formatDate, getCategoryBadgeClass, formatNumber } from '../lib/utils';
export default function AdDetail({ ad, reviews, onClose }) {
  const [showContact, setShowContact] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews || []);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const handleSubmit = (e) => { e.preventDefault(); setLocalReviews([{ id: Date.now(), ad_id: ad.id, user_name: 'You', ...newReview, created_at: new Date().toISOString() }, ...localReviews]); setNewReview({ rating: 5, comment: '' }); };
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-4xl mx-4 my-8 glass-card rounded-3xl overflow-hidden animate-slide-up shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors z-10">✕</button>
        <div className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`badge ${getCategoryBadgeClass(ad.category)}`}>{ad.category}</span>
            {ad.is_sponsored && <span className="badge badge-sponsored">⭐ Sponsored</span>}
          </div>
          <h2 className="font-display text-3xl text-surface-900 mb-2">{ad.title}</h2>
          <p className="text-sm text-surface-500 mb-6">by <span className="font-medium text-surface-700">{ad.advertiser_name}</span></p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <p className="text-surface-700 leading-relaxed">{ad.description}</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface-50 rounded-xl p-4 text-center"><div className="font-bold text-surface-900">⭐ {ad.rating}</div><p className="text-xs text-surface-500">{ad.review_count} reviews</p></div>
                <div className="bg-surface-50 rounded-xl p-4 text-center"><div className="font-bold text-surface-900">{formatNumber(ad.views)}</div><p className="text-xs text-surface-500">Views</p></div>
                <div className="bg-surface-50 rounded-xl p-4 text-center"><div className="font-bold text-surface-900">📍</div><p className="text-xs text-surface-500">{ad.location}</p></div>
              </div>
              <div className="border-t border-surface-100 pt-6">
                <h3 className="font-display text-xl text-surface-900 mb-4">Reviews</h3>
                <form onSubmit={handleSubmit} className="bg-surface-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-surface-600">Rating:</span>
                    <div className="flex gap-1">{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setNewReview({...newReview, rating: s})} className="text-lg">{s <= newReview.rating ? '⭐' : '☆'}</button>)}</div>
                  </div>
                  <textarea className="input-field resize-none h-20 text-sm" placeholder="Write your review..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} />
                  <button type="submit" className="btn-primary text-sm mt-3 py-2 px-4">Submit Review</button>
                </form>
                <div className="space-y-4">
                  {localReviews.map(r => (
                    <div key={r.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 flex items-center justify-center flex-shrink-0"><span className="text-white text-xs font-bold">{r.user_name[0]}</span></div>
                      <div><div className="flex items-center gap-2 mb-1"><span className="text-sm font-semibold text-surface-800">{r.user_name}</span><span className="text-xs text-surface-400">{formatDate(r.created_at)}</span></div><p className="text-sm text-surface-600">{r.comment}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-br from-surface-50 to-surface-100 rounded-2xl p-6 border border-surface-200">
                <h3 className="font-display text-lg text-surface-900 mb-4">Contact Advertiser</h3>
                {!showContact ? (
                  <button onClick={() => setShowContact(true)} className="btn-primary w-full text-sm py-3">👁 Reveal Contact Info</button>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    <div className="p-3 bg-white rounded-lg text-sm text-surface-700">📧 {ad.contact_email}</div>
                    {ad.contact_phone && <div className="p-3 bg-white rounded-lg text-sm text-surface-700">📞 {ad.contact_phone}</div>}
                    {ad.contact_website && <a href={ad.contact_website} target="_blank" rel="noopener noreferrer" className="block p-3 bg-white rounded-lg text-sm text-brand-600 hover:bg-brand-50 transition-colors">🌐 Visit Website →</a>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

# ─── src/components/StatsBar.jsx ───
cat > src/components/StatsBar.jsx << 'EOF'
import { formatNumber } from '../lib/utils';
export default function StatsBar({ stats }) {
  if (!stats) return null;
  const items = [
    { label:'Active Ads', value:stats.totalAds, icon:'📋' },
    { label:'User Reviews', value:stats.totalReviews, icon:'⭐' },
    { label:'Avg Rating', value:stats.avgRating, icon:'📊' },
    { label:'Total Views', value:formatNumber(stats.totalViews), icon:'👀' },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div key={item.label} className="glass-card rounded-xl p-4 text-center opacity-0 animate-fade-in" style={{ animationDelay: `${i*0.1}s`, animationFillMode: 'forwards' }}>
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="font-bold text-lg text-surface-900">{item.value}</div>
            <div className="text-xs text-surface-500">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

# ─── src/components/SubmitAdModal.jsx ───
cat > src/components/SubmitAdModal.jsx << 'EOF'
import { useState } from 'react';
export default function SubmitAdModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title:'', description:'', category:'Products', contact_email:'', contact_phone:'', contact_website:'', location:'' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 my-8 glass-card rounded-3xl overflow-hidden animate-slide-up shadow-2xl">
        <div className="h-3 w-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 flex items-center justify-center">✕</button>
        <div className="p-8">
          <h2 className="font-display text-2xl text-surface-900 mb-2">Submit New Advertisement</h2>
          <p className="text-sm text-surface-500 mb-6">Fill in the details below to submit your ad for review.</p>
          <form onSubmit={e => { e.preventDefault(); onSubmit(form); onClose(); }} className="space-y-4">
            <div><label className="block text-sm font-medium text-surface-700 mb-1">Title *</label><input type="text" name="title" required className="input-field" placeholder="Ad title" value={form.title} onChange={handleChange}/></div>
            <div><label className="block text-sm font-medium text-surface-700 mb-1">Description *</label><textarea name="description" required className="input-field resize-none h-28" placeholder="Describe your ad..." value={form.description} onChange={handleChange}/></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-surface-700 mb-1">Category</label><select name="category" className="input-field" value={form.category} onChange={handleChange}><option>Products</option><option>Services</option><option>Events</option><option>Other</option></select></div>
              <div><label className="block text-sm font-medium text-surface-700 mb-1">Location *</label><input type="text" name="location" required className="input-field" placeholder="City, Country" value={form.location} onChange={handleChange}/></div>
            </div>
            <div className="border-t border-surface-100 pt-4"><h3 className="text-sm font-semibold text-surface-700 mb-3">Contact Info</h3>
              <div className="space-y-3">
                <input type="email" name="contact_email" required className="input-field text-sm" placeholder="Email *" value={form.contact_email} onChange={handleChange}/>
                <div className="grid grid-cols-2 gap-3">
                  <input type="tel" name="contact_phone" className="input-field text-sm" placeholder="Phone" value={form.contact_phone} onChange={handleChange}/>
                  <input type="url" name="contact_website" className="input-field text-sm" placeholder="Website URL" value={form.contact_website} onChange={handleChange}/>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4"><button type="submit" className="btn-primary flex-1">Submit for Review</button><button type="button" onClick={onClose} className="btn-secondary">Cancel</button></div>
          </form>
        </div>
      </div>
    </div>
  );
}
EOF

# ─── src/components/NotificationPanel.jsx ───
cat > src/components/NotificationPanel.jsx << 'EOF'
import { useState } from 'react';
export default function NotificationPanel({ onClose }) {
  const [email, setEmail] = useState('');
  const [cats, setCats] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [done, setDone] = useState(false);
  const categories = ['Products','Services','Events','Other'];
  const toggle = c => setCats(prev => prev.includes(c) ? prev.filter(x=>x!==c) : [...prev, c]);
  if (done) return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-md mx-4 my-8 glass-card rounded-3xl p-8 animate-slide-up shadow-2xl text-center">
        <div className="text-4xl mb-4">✅</div><h2 className="font-display text-2xl text-surface-900 mb-2">Subscribed!</h2><p className="text-sm text-surface-500">You'll receive alerts for new matching ads.</p>
      </div>
    </div>
  );
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose}/>
      <div className="relative w-full max-w-md mx-4 my-8 glass-card rounded-3xl overflow-hidden animate-slide-up shadow-2xl">
        <div className="h-3 w-full bg-gradient-to-r from-purple-400 via-pink-400 to-brand-400"/>
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 flex items-center justify-center">✕</button>
        <div className="p-8">
          <h2 className="font-display text-xl text-surface-900 mb-1">🔔 Ad Alerts</h2>
          <p className="text-xs text-surface-500 mb-6">Get notified about new ads</p>
          <form onSubmit={e => { e.preventDefault(); setDone(true); }} className="space-y-4">
            <div><label className="block text-sm font-medium text-surface-700 mb-1">Email</label><input type="email" required className="input-field text-sm" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}/></div>
            <div><label className="block text-sm font-medium text-surface-700 mb-2">Categories</label><div className="flex flex-wrap gap-2">{categories.map(c => <button key={c} type="button" onClick={() => toggle(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${cats.includes(c) ? 'bg-brand-500 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}>{c}</button>)}</div></div>
            <div><label className="block text-sm font-medium text-surface-700 mb-1">Keywords</label><input type="text" className="input-field text-sm" placeholder="e.g., automation, SDK" value={keywords} onChange={e => setKeywords(e.target.value)}/></div>
            <button type="submit" className="btn-primary w-full">Subscribe to Alerts</button>
          </form>
        </div>
      </div>
    </div>
  );
}
EOF

# ─── src/components/Footer.jsx ───
cat > src/components/Footer.jsx << 'EOF'
export default function Footer() {
  return (
    <footer className="border-t border-surface-200/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center"><span className="text-white font-bold text-xs">XY</span></div>
              <span className="font-display text-lg text-surface-900">XYZT</span>
            </div>
            <p className="text-sm text-surface-500">The premier platform for XYZT-related advertisements.</p>
          </div>
          <div><h4 className="font-semibold text-surface-800 text-sm mb-3">Platform</h4><ul className="space-y-2 text-sm text-surface-500"><li><a href="#" className="hover:text-brand-600">Browse Ads</a></li><li><a href="#" className="hover:text-brand-600">Categories</a></li><li><a href="#" className="hover:text-brand-600">Submit Ad</a></li><li><a href="#" className="hover:text-brand-600">Pricing</a></li></ul></div>
          <div><h4 className="font-semibold text-surface-800 text-sm mb-3">Company</h4><ul className="space-y-2 text-sm text-surface-500"><li><a href="#" className="hover:text-brand-600">About</a></li><li><a href="#" className="hover:text-brand-600">Blog</a></li><li><a href="#" className="hover:text-brand-600">Careers</a></li><li><a href="#" className="hover:text-brand-600">Contact</a></li></ul></div>
          <div><h4 className="font-semibold text-surface-800 text-sm mb-3">Legal</h4><ul className="space-y-2 text-sm text-surface-500"><li><a href="#" className="hover:text-brand-600">Terms</a></li><li><a href="#" className="hover:text-brand-600">Privacy</a></li><li><a href="#" className="hover:text-brand-600">DMCA</a></li><li><a href="#" className="hover:text-brand-600">Cookies</a></li></ul></div>
        </div>
        <div className="border-t border-surface-200 mt-8 pt-8 text-center"><p className="text-xs text-surface-400">© 2026 XYZT Ad Consolidator. All rights reserved.</p></div>
      </div>
    </footer>
  );
}
EOF

# ─── src/pages/index.js (main page) ───
cat > src/pages/index.js << 'EOF'
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import AdCard from '../components/AdCard';
import AdDetail from '../components/AdDetail';
import StatsBar from '../components/StatsBar';
import SubmitAdModal from '../components/SubmitAdModal';
import NotificationPanel from '../components/NotificationPanel';
import Footer from '../components/Footer';
import { getAds, getAdById, getReviewsByAdId, getStats } from '../lib/data';

export default function HomePage({ initialAds, initialStats }) {
  const [ads, setAds] = useState(initialAds.ads);
  const [totalAds, setTotalAds] = useState(initialAds.total);
  const [stats] = useState(initialStats);
  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedAdReviews, setSelectedAdReviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showSubmit, setShowSubmit] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAds = useCallback(async (q, cat, sort) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 200));
    const result = getAds({ query: q, category: cat, sort });
    setAds(result.ads); setTotalAds(result.total); setLoading(false);
  }, []);

  useEffect(() => { fetchAds(searchQuery, activeCategory, sortBy); }, [searchQuery, activeCategory, sortBy, fetchAds]);

  const handleAdClick = (ad) => { setSelectedAd(getAdById(ad.id)); setSelectedAdReviews(getReviewsByAdId(ad.id)); };

  return (
    <>
      <Head><title>XYZT Ad Consolidator | Discover XYZT Advertisements</title><meta name="viewport" content="width=device-width, initial-scale=1"/></Head>
      <div className="min-h-screen flex flex-col">
        <Header onSearch={setSearchQuery} onCategoryChange={setActiveCategory} activeCategory={activeCategory} />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="text-center max-w-2xl mx-auto opacity-0 animate-slide-up" style={{ animationFillMode:'forwards' }}>
            <h2 className="font-display text-4xl md:text-5xl text-surface-900 mb-4">Discover <span className="gradient-text">XYZT</span> Advertisements</h2>
            <p className="text-surface-600 text-lg leading-relaxed mb-6">Your central hub for finding and publishing advertisements related to XYZT → 123456 now.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShowSubmit(true)} className="btn-primary">+ Submit Your Ad</button>
              <button onClick={() => setShowNotify(true)} className="btn-secondary">🔔 Get Alerts</button>
            </div>
          </div>
        </section>
        <StatsBar stats={stats} />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-surface-500">{loading ? <span className="animate-pulse-soft">Searching...</span> : <>Showing <b>{ads.length}</b> of {totalAds} ads</>}</p>
            <select className="text-sm border border-surface-200 rounded-lg px-3 py-1.5 bg-white" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Featured</option><option value="newest">Newest</option><option value="rating">Top Rated</option><option value="popular">Most Popular</option>
            </select>
          </div>
          {ads.length > 0 ? (
            <div className="card-grid">{ads.map((ad, i) => <AdCard key={ad.id} ad={ad} onClick={handleAdClick} index={i} />)}</div>
          ) : (
            <div className="text-center py-20"><p className="text-surface-500">No ads found. Try a different search.</p></div>
          )}
        </main>
        <Footer />
      </div>
      {selectedAd && <AdDetail ad={selectedAd} reviews={selectedAdReviews} onClose={() => setSelectedAd(null)} />}
      {showSubmit && <SubmitAdModal onClose={() => setShowSubmit(false)} onSubmit={d => console.log('Submitted:', d)} />}
      {showNotify && <NotificationPanel onClose={() => setShowNotify(false)} />}
    </>
  );
}

export async function getServerSideProps() {
  return { props: { initialAds: getAds({ query:'', category:'All', sort:'default' }), initialStats: getStats() } };
}
EOF

# ─── Install & Build ───
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building production..."
npm run build

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ XYZT Ad Consolidator ready!"
echo ""
echo "  cd $PROJECT"
echo "  npm run dev     → http://localhost:3000"
echo "  npm run build   → production build"
echo "  npm start       → serve production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
