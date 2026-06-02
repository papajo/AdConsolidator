/**
 * Synthetic ad data — generates rich, deterministic fake ads so the marketplace
 * homepage always looks populated with real-seeming content.
 *
 * Used as fallback in data.js when Supabase returns empty results (dev/preview).
 * Supports category filtering and text search with realistic latency.
 */

// ─── Templates for deterministic generation ───

const PRODUCT_TEMPLATES = [
  { title: 'XYZT Smart Sensor Hub Pro', location: 'San Francisco, CA' },
  { title: 'XYZT-123456 USB-C Adapter Kit', location: 'Shenzhen, China' },
  { title: 'Next-Gen XYZT Processor Module', location: 'Austin, TX' },
  { title: 'XYZT Wireless Beacon Array', location: 'Berlin, Germany' },
  { title: 'Portable XYZT Diagnostic Scanner', location: 'Tokyo, Japan' },
  { title: 'XYZT Edge Compute Node Mini', location: 'Seattle, WA' },
  { title: 'Industrial XYZT IoT Gateway', location: 'Chicago, IL' },
  { title: 'XYZT Environmental Sensor Pack', location: 'Amsterdam, Netherlands' },
  { title: 'Ruggedized XYZT Data Logger', location: 'Denver, CO' },
  { title: 'XYZT LED Matrix Display Module', location: 'Seoul, South Korea' },
  { title: 'Ultra-Low-Power XYZT Transceiver', location: 'Helsinki, Finland' },
  { title: 'XYZT Mesh Network Starter Kit', location: 'Boston, MA' },
  { title: 'High-Precision XYZT Motion Tracker', location: 'Munich, Germany' },
  { title: 'XYZT Biometric Access Control Unit', location: 'Dubai, UAE' },
  { title: 'Modular XYZT Test Bench V3', location: 'Portland, OR' },
  { title: 'XYZT Energy Harvesting Module', location: 'Oslo, Norway' },
  { title: 'Compact XYZT RFID Scanner Pro', location: 'Shanghai, China' },
  { title: 'XYZT Multi-Spectral Camera Array', location: 'Tel Aviv, Israel' },
  { title: 'Underwater XYZT Telemetry Buoy', location: 'Sydney, Australia' },
  { title: 'XYZT High-Temperature Sensor Node', location: 'Houston, TX' },
];

const PRODUCT_DESCS = [
  'Advanced device featuring next-gen XYZT-123456 connectivity, IP67 rating, and real-time data streaming with enterprise-grade encryption.',
  'Precision-engineered for mission-critical 123456 deployments. Features OTA updates, edge ML inference, and 18-month battery life.',
  'Industry-leading XYZT performance with 40% faster throughput, extended range, and seamless integration with existing 123456 infrastructure.',
  'Compact yet powerful. Supports simultaneous XYZT-123456 and Bluetooth 5.4, onboard analytics, and ruggedized enclosure for harsh environments.',
  'Built for scale: manage thousands of XYZT endpoints from a single dashboard. Includes API access, webhooks, and role-based access control.',
];

const SERVICE_TEMPLATES = [
  { title: 'XYZT-123456 Network Optimization', location: 'New York, NY' },
  { title: 'Enterprise XYZT System Integration', location: 'London, UK' },
  { title: 'XYZT Compliance & Security Audit', location: 'Washington, DC' },
  { title: 'Custom XYZT Software Development', location: 'Bangalore, India' },
  { title: 'Managed XYZT Infrastructure Services', location: 'Toronto, Canada' },
  { title: 'XYZT Data Analytics & Visualization', location: 'San Jose, CA' },
  { title: 'XYZT Training & Certification Program', location: 'Singapore' },
  { title: '24/7 XYZT Remote Monitoring Service', location: 'Dublin, Ireland' },
  { title: 'XYZT Migration & Upgrade Consulting', location: 'Zurich, Switzerland' },
  { title: 'On-Site XYZT Troubleshooting & Repair', location: 'Los Angeles, CA' },
  { title: 'XYZT Capacity Planning & Scaling', location: 'Stockholm, Sweden' },
  { title: 'XYZT API Integration & Middleware', location: 'Mumbai, India' },
  { title: 'Custom XYZT Dashboard Development', location: 'Melbourne, Australia' },
  { title: 'XYZT Penetration Testing & Hardening', location: 'Tel Aviv, Israel' },
  { title: 'XYZT RoI Assessment & Feasibility Study', location: 'Paris, France' },
];

const SERVICE_DESCS = [
  'End-to-end XYZT assessment, architecture design, and deployment. Our certified engineers have delivered 200+ 123456 integrations worldwide.',
  'Reduce operational overhead with proactive XYZT monitoring, automated alerting, and dedicated support engineers available 24/7/365.',
  'Comprehensive security audit covering XYZT protocol vulnerabilities, network segmentation, encryption standards, and compliance with ISO 27001.',
  'Custom software solutions built on the XYZT-123456 stack. From PoC to production in 8 weeks with full CI/CD and documentation.',
  'Strategic consulting to optimize your 123456 deployment for scale, reliability, and cost. Includes heatmap analysis and capacity modeling.',
];

const EVENT_TEMPLATES = [
  { title: 'XYZT World Expo 2026', location: 'Las Vegas, NV' },
  { title: 'International XYZT Summit', location: 'Barcelona, Spain' },
  { title: 'XYZT-123456 Hackathon Series', location: 'San Francisco, CA' },
  { title: 'XYZT Developers Conference 2026', location: 'Amsterdam, Netherlands' },
  { title: 'Annual XYZT Industry Awards Gala', location: 'Vienna, Austria' },
  { title: 'XYZT Product Launch Keynote', location: 'New York, NY' },
  { title: 'XYZT Community Meetup: East Coast', location: 'Boston, MA' },
  { title: 'Virtual XYZT Workshop: Getting Started', location: 'Online (Global)' },
  { title: 'XYZT Partner Networking Mixer', location: 'Chicago, IL' },
  { title: 'Hands-On XYZT Training Bootcamp', location: 'Austin, TX' },
  { title: 'XYZT Women in Tech Leadership Forum', location: 'San Diego, CA' },
  { title: 'XYZT Hardware Prototyping Sprint', location: 'Portland, OR' },
  { title: 'XYZT Open Source Contribution Day', location: 'Tokyo, Japan' },
  { title: 'XYZT Executive Roundtable Dinner', location: 'London, UK' },
  { title: 'XYZT Student Innovation Challenge', location: 'Cambridge, MA' },
];

const EVENT_DESCS = [
  'Join 8000+ professionals for three days of keynotes, workshops, and networking. Featuring 150+ speakers and 200+ exhibitors from the XYZT ecosystem.',
  'An exclusive gathering of XYZT thought leaders and decision makers. Invitation-only with curated 1:1 networking sessions.',
  '48-hour build sprint with $100K in prizes. Teams will compete to build the most innovative 123456-powered solution using XYZT hardware and APIs.',
  'Deep-dive technical sessions covering XYZT architecture, security, scaling patterns, and real-world case studies from Fortune 500 adopters.',
  'A full-day workshop designed for engineers and architects new to XYZT-123456. Bring your laptop — all exercises are hands-on and production-focused.',
];

// ─── Deterministic pseudo-random (seeded by index) ───

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function pick(arr, seed) {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function daysAgo(n) {
  const d = new Date('2026-06-01T12:00:00Z');
  d.setDate(d.getDate() - n);
  return d.toISOString().replace('Z', '') + 'Z';
}

// ─── Generator ───

let cached = null;

export function generateAds() {
  if (cached) return cached;

  const ads = [];
  let id = 1;

  const makeTemplate = (templates, descs, categoryId, categoryName) =>
    templates.forEach((t, i) => {
      const seed = id * 137 + i * 7;
      const isSponsored = i < 2;
      ads.push({
        id: String(id),
        title: t.title,
        description: pick(descs, seed),
        category_id: categoryId,
        category_name: categoryName,
        contact_email: `contact${id}@xyzt-marketplace.io`,
        contact_phone: id % 3 === 0 ? null : `+1-555-${String(1000 + id).slice(1)}`,
        contact_website: `https://xyzt-marketplace.io/item/${id}`,
        images: [],
        location: t.location,
        is_sponsored: isSponsored,
        status: 'approved',
        advertiser_name: `${categoryName} Vendor ${String.fromCharCode(65 + (i % 26))}`,
        rating: parseFloat((3.5 + seededRandom(id + 100) * 1.5).toFixed(1)),
        review_count: Math.floor(seededRandom(id + 200) * 120) + 1,
        created_at: daysAgo(Math.floor(seededRandom(id + 300) * 14)),
        views: Math.floor(seededRandom(id + 400) * 5000) + 50,
        price: Math.floor(seededRandom(id + 500) * 9900) / 100 + 0.99,
        user_id: null,
        clerk_id: null,
      });
      id++;
    });

  makeTemplate(PRODUCT_TEMPLATES, PRODUCT_DESCS, 1, 'Products');
  makeTemplate(SERVICE_TEMPLATES, SERVICE_DESCS, 2, 'Services');
  makeTemplate(EVENT_TEMPLATES, EVENT_DESCS, 3, 'Events');

  cached = ads;
  return cached;
}

export function generateFeatured() {
  return generateAds().filter(a => a.is_sponsored);
}

export function generateStats() {
  const all = generateAds();
  const totalViews = all.reduce((s, a) => s + a.views, 0);
  const avgRating = (all.reduce((s, a) => s + a.rating, 0) / all.length).toFixed(1);
  return { totalAds: all.length, totalReviews: 487, avgRating, totalViews };
}

/**
 * Synthetic query layer — mirrors the shape of getAds() result.
 */
export function querySyntheticAds({ query = '', category = 'All', sort = 'default', page = 1, limit = 12 } = {}) {
  let results = generateAds();

  // Filter by category
  if (category && category !== 'All') {
    results = results.filter(a => a.category_name === category);
  }

  // Search
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popular') {
    results.sort((a, b) => b.views - a.views);
  } else {
    // Default: sponsored first, then newest
    results.sort(
      (a, b) => (b.is_sponsored ? 1 : 0) - (a.is_sponsored ? 1 : 0) || new Date(b.created_at) - new Date(a.created_at)
    );
  }

  const total = results.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const sliced = results.slice(start, start + limit);

  return { ads: sliced, total, page, totalPages };
}
