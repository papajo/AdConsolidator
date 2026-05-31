// Mock data store - in production this connects to Supabase
const ads = [
  {
    id: 1,
    title: "Premium XYZT Digital Marketing Package",
    description: "Complete digital marketing solution for businesses looking to reach the 123456 audience. Includes SEO, social media management, and targeted ad campaigns with proven ROI tracking.",
    category: "Services",
    contact_email: "marketing@xyztpro.com",
    contact_phone: "+1-555-0142",
    contact_website: "https://xyztpro.com",
    image_urls: [],
    location: "New York, NY",
    is_sponsored: true,
    status: "approved",
    advertiser_name: "XYZT Pro Agency",
    rating: 4.8,
    review_count: 24,
    created_at: "2026-05-28T10:00:00Z",
    views: 1247,
  },
  {
    id: 2,
    title: "XYZT Smart Device - Model X",
    description: "Next-generation smart device with 123456 connectivity protocols. Features include real-time sync, advanced analytics dashboard, and enterprise-grade security. Ships worldwide.",
    category: "Products",
    contact_email: "sales@xyztdevices.io",
    contact_phone: "+1-555-0198",
    contact_website: "https://xyztdevices.io",
    image_urls: [],
    location: "San Francisco, CA",
    is_sponsored: false,
    status: "approved",
    advertiser_name: "XYZT Devices Inc",
    rating: 4.5,
    review_count: 67,
    created_at: "2026-05-27T14:30:00Z",
    views: 892,
  },
  {
    id: 3,
    title: "XYZT Annual Conference 2026",
    description: "Join 5000+ professionals at the largest XYZT industry conference. Keynote speakers, workshops, networking events, and exclusive product launches. Early bird tickets now available.",
    category: "Events",
    contact_email: "events@xyztconf.com",
    contact_phone: "+1-555-0234",
    contact_website: "https://xyztconf.com",
    image_urls: [],
    location: "Austin, TX",
    is_sponsored: true,
    status: "approved",
    advertiser_name: "XYZT Events Group",
    rating: 4.9,
    review_count: 156,
    created_at: "2026-05-26T09:00:00Z",
    views: 3421,
  },
  {
    id: 4,
    title: "XYZT Automation Platform for 123456",
    description: "Streamline your 123456 workflows with our AI-powered automation platform. Reduce manual tasks by 80%, integrate with 200+ tools, and scale effortlessly.",
    category: "Services",
    contact_email: "hello@xyztauto.com",
    contact_phone: null,
    contact_website: "https://xyztauto.com",
    image_urls: [],
    location: "London, UK",
    is_sponsored: false,
    status: "approved",
    advertiser_name: "XYZT Automation Ltd",
    rating: 4.3,
    review_count: 41,
    created_at: "2026-05-25T16:45:00Z",
    views: 654,
  },
  {
    id: 5,
    title: "Bulk XYZT Hardware Components",
    description: "Wholesale pricing on certified XYZT-compatible hardware. Chips, sensors, connectors, and complete assembly kits. Minimum order 100 units. Volume discounts available.",
    category: "Products",
    contact_email: "wholesale@xyztparts.net",
    contact_phone: "+1-555-0367",
    contact_website: "https://xyztparts.net",
    image_urls: [],
    location: "Shenzhen, China",
    is_sponsored: false,
    status: "approved",
    advertiser_name: "XYZT Parts Global",
    rating: 4.1,
    review_count: 89,
    created_at: "2026-05-24T08:20:00Z",
    views: 1103,
  },
  {
    id: 6,
    title: "XYZT Certification Training Workshop",
    description: "Become XYZT-123456 certified in just 5 days. Hands-on training with industry experts, real-world projects, and guaranteed job placement assistance upon completion.",
    category: "Events",
    contact_email: "training@xyztacademy.org",
    contact_phone: "+1-555-0451",
    contact_website: "https://xyztacademy.org",
    image_urls: [],
    location: "Chicago, IL",
    is_sponsored: false,
    status: "approved",
    advertiser_name: "XYZT Academy",
    rating: 4.7,
    review_count: 203,
    created_at: "2026-05-23T11:15:00Z",
    views: 2089,
  },
  {
    id: 7,
    title: "XYZT Data Analytics Consulting",
    description: "Expert consulting for organizations leveraging 123456 data streams. Custom dashboards, predictive modeling, and actionable insights tailored to your business needs.",
    category: "Services",
    contact_email: "consult@xyztanalytics.com",
    contact_phone: "+1-555-0523",
    contact_website: "https://xyztanalytics.com",
    image_urls: [],
    location: "Toronto, Canada",
    is_sponsored: false,
    status: "approved",
    advertiser_name: "XYZT Analytics Co",
    rating: 4.6,
    review_count: 37,
    created_at: "2026-05-22T13:30:00Z",
    views: 478,
  },
  {
    id: 8,
    title: "XYZT Mobile App Development Kit",
    description: "Build mobile apps with native XYZT-123456 integration in minutes. Cross-platform SDK with pre-built UI components, real-time data binding, and offline-first architecture.",
    category: "Products",
    contact_email: "devrel@xyztmobile.dev",
    contact_phone: null,
    contact_website: "https://xyztmobile.dev",
    image_urls: [],
    location: "Berlin, Germany",
    is_sponsored: true,
    status: "approved",
    advertiser_name: "XYZT Mobile GmbH",
    rating: 4.4,
    review_count: 112,
    created_at: "2026-05-21T07:00:00Z",
    views: 1876,
  },
  {
    id: 9,
    title: "XYZT Security Audit Services",
    description: "Comprehensive security assessments for 123456-connected systems. Penetration testing, vulnerability scanning, compliance reporting (SOC2, ISO27001), and remediation guidance.",
    category: "Services",
    contact_email: "security@xyztsec.io",
    contact_phone: "+1-555-0687",
    contact_website: "https://xyztsec.io",
    image_urls: [],
    location: "Washington, DC",
    is_sponsored: false,
    status: "approved",
    advertiser_name: "XYZT Security",
    rating: 4.9,
    review_count: 28,
    created_at: "2026-05-20T15:00:00Z",
    views: 534,
  },
];

const reviews = [
  { id: 1, ad_id: 1, user_name: "Alex M.", rating: 5, comment: "Incredible results! Our ROI tripled within the first month.", created_at: "2026-05-29T10:00:00Z" },
  { id: 2, ad_id: 1, user_name: "Sarah K.", rating: 4, comment: "Great service, responsive team. Slightly pricey but worth it.", created_at: "2026-05-28T14:30:00Z" },
  { id: 3, ad_id: 2, user_name: "James R.", rating: 5, comment: "Best device on the market. Setup was seamless.", created_at: "2026-05-27T09:15:00Z" },
  { id: 4, ad_id: 2, user_name: "Linda P.", rating: 4, comment: "Good build quality. Battery life could be better.", created_at: "2026-05-26T16:45:00Z" },
  { id: 5, ad_id: 3, user_name: "Mike T.", rating: 5, comment: "Last year's conference was phenomenal. Already registered for 2026!", created_at: "2026-05-25T11:30:00Z" },
  { id: 6, ad_id: 3, user_name: "Rachel W.", rating: 5, comment: "The networking alone was worth the ticket price.", created_at: "2026-05-24T08:00:00Z" },
  { id: 7, ad_id: 6, user_name: "David L.", rating: 5, comment: "Got certified and landed a new job within 2 weeks!", created_at: "2026-05-23T13:00:00Z" },
  { id: 8, ad_id: 8, user_name: "Emma C.", rating: 4, comment: "SDK is powerful but documentation could be clearer.", created_at: "2026-05-22T10:30:00Z" },
];

export function getAds({ query, category, sort, page = 1, limit = 9 }) {
  let filtered = [...ads];

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (ad) =>
        ad.title.toLowerCase().includes(q) ||
        ad.description.toLowerCase().includes(q) ||
        ad.location.toLowerCase().includes(q)
    );
  }

  if (category && category !== "All") {
    filtered = filtered.filter((ad) => ad.category === category);
  }

  // Sort
  switch (sort) {
    case "newest":
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "popular":
      filtered.sort((a, b) => b.views - a.views);
      break;
    default:
      // Sponsored first, then by date
      filtered.sort((a, b) => {
        if (a.is_sponsored && !b.is_sponsored) return -1;
        if (!a.is_sponsored && b.is_sponsored) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return { ads: paginated, total, page, totalPages: Math.ceil(total / limit) };
}

export function getAdById(id) {
  return ads.find((ad) => ad.id === parseInt(id)) || null;
}

export function getReviewsByAdId(adId) {
  return reviews.filter((r) => r.ad_id === parseInt(adId));
}

export function getCategories() {
  return ["All", "Products", "Services", "Events", "Other"];
}

export function getStats() {
  return {
    totalAds: ads.length,
    totalReviews: reviews.length,
    avgRating: (ads.reduce((sum, ad) => sum + ad.rating, 0) / ads.length).toFixed(1),
    totalViews: ads.reduce((sum, ad) => sum + ad.views, 0),
  };
}
