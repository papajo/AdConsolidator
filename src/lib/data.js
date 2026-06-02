import { supabase, supabaseAdmin } from './supabase';

// Map Clerk user IDs (user_xxx) → Supabase profile UUIDs
const clerkIdCache = new Map();

async function resolveProfileId(clerkId) {
  if (!clerkId) return null;
  if (clerkIdCache.has(clerkId)) return clerkIdCache.get(clerkId);

  const { data } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('clerk_id', clerkId)
    .maybeSingle();

  if (data?.id) {
    clerkIdCache.set(clerkId, data.id);
    return data.id;
  }
  return null;
}

// Clear cache (useful after webhook syncs a new user)
export function clearProfileCache() { clerkIdCache.clear(); }

// ============================================
// Data layer — Supabase-backed with mock fallback
// ============================================

// Catch-all mock data (used when Supabase isn't configured)
const MOCK_ADS = [
  {
    id: '1', title: 'Premium XYZT Digital Marketing Package',
    description: 'Complete digital marketing solution for businesses looking to reach the 123456 audience. Includes SEO, social media management, and targeted ad campaigns with proven ROI tracking.',
    category_id: 2, category_name: 'Services', contact_email: 'marketing@xyztpro.com', contact_phone: '+1-555-0142', contact_website: 'https://xyztpro.com',
    images: [], location: 'New York, NY', is_sponsored: true, status: 'approved', advertiser_name: 'XYZT Pro Agency',
    rating: 4.8, review_count: 24, created_at: '2026-05-28T10:00:00Z', views: 1247,
  },
  {
    id: '2', title: 'XYZT Smart Device - Model X',
    description: 'Next-generation smart device with 123456 connectivity protocols. Features include real-time sync, advanced analytics dashboard, and enterprise-grade security.',
    category_id: 1, category_name: 'Products', contact_email: 'sales@xyztdevices.io', contact_phone: '+1-555-0198', contact_website: 'https://xyztdevices.io',
    images: [], location: 'San Francisco, CA', is_sponsored: false, status: 'approved', advertiser_name: 'XYZT Devices Inc',
    rating: 4.5, review_count: 67, created_at: '2026-05-27T14:30:00Z', views: 892,
  },
  {
    id: '3', title: 'XYZT Annual Conference 2026',
    description: 'Join 5000+ professionals at the largest XYZT industry conference. Keynote speakers, workshops, networking events, and exclusive product launches.',
    category_id: 3, category_name: 'Events', contact_email: 'events@xyztconf.com', contact_phone: '+1-555-0234', contact_website: 'https://xyztconf.com',
    images: [], location: 'Austin, TX', is_sponsored: true, status: 'approved', advertiser_name: 'XYZT Events Group',
    rating: 4.9, review_count: 156, created_at: '2026-05-26T09:00:00Z', views: 3421,
  },
  {
    id: '4', title: 'XYZT Automation Platform for 123456',
    description: 'Streamline your 123456 workflows with our AI-powered automation platform. Reduce manual tasks by 80%, integrate with 200+ tools.',
    category_id: 2, category_name: 'Services', contact_email: 'hello@xyztauto.com', contact_phone: null, contact_website: 'https://xyztauto.com',
    images: [], location: 'London, UK', is_sponsored: false, status: 'approved', advertiser_name: 'XYZT Automation Ltd',
    rating: 4.3, review_count: 41, created_at: '2026-05-25T16:45:00Z', views: 654,
  },
  {
    id: '5', title: 'Bulk XYZT Hardware Components',
    description: 'Wholesale pricing on certified XYZT-compatible hardware. Chips, sensors, connectors, and complete assembly kits.',
    category_id: 1, category_name: 'Products', contact_email: 'wholesale@xyztparts.net', contact_phone: '+1-555-0367', contact_website: 'https://xyztparts.net',
    images: [], location: 'Shenzhen, China', is_sponsored: false, status: 'approved', advertiser_name: 'XYZT Parts Global',
    rating: 4.1, review_count: 89, created_at: '2026-05-24T08:20:00Z', views: 1103,
  },
  {
    id: '6', title: 'XYZT Certification Training Workshop',
    description: 'Become XYZT-123456 certified in just 5 days. Hands-on training with industry experts and guaranteed job placement assistance.',
    category_id: 3, category_name: 'Events', contact_email: 'training@xyztacademy.org', contact_phone: '+1-555-0451', contact_website: 'https://xyztacademy.org',
    images: [], location: 'Berlin, Germany', is_sponsored: false, status: 'approved', advertiser_name: 'XYZT Academy',
    rating: 4.7, review_count: 33, created_at: '2026-05-23T11:15:00Z', views: 567,
  },
];

const MOCK_REVIEWS = [];

function isSupabaseConfigured() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}

// ============================================
// Ads
// ============================================

export async function getAds(filters = {}) {
  // Accept both 'query' and 'search' as the search parameter
  const search = filters.search || filters.query || '';

  if (!isSupabaseConfigured()) {
    let results = [...MOCK_ADS];
    if (filters.category && filters.category !== 'All') {
      results = results.filter(a => a.category_name === filters.category);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    if (filters.sort === 'price_asc') results.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (filters.sort === 'price_desc') results.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (filters.sort === 'rating') results.sort((a, b) => b.rating - a.rating);
    else if (filters.sort === 'popular') results.sort((a, b) => b.views - a.views);
    else { results.sort((a, b) => (b.is_sponsored ? 1 : 0) - (a.is_sponsored ? 1 : 0) || new Date(b.created_at) - new Date(a.created_at)); }
    const total = results.length;
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const start = (page - 1) * limit;
    return { ads: results.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) };
  }

  // Supabase query
  let query = supabaseAdmin
    .from('ads')
    .select('*, categories(name, slug)', { count: 'exact' })
    .eq('status', 'approved');

  if (filters.category && filters.category !== 'All') {
    // Try categories table first, fall back to category_id mapping
    const { data: cat } = await supabaseAdmin.from('categories').select('id').eq('name', filters.category).maybeSingle();
    if (cat) {
      query = query.eq('category_id', cat.id);
    } else {
      // Map category name to category_id
      const map = { Products: 1, Services: 2, Events: 3 };
      const catId = map[filters.category];
      if (catId) query = query.eq('category_id', catId);
    }
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (filters.sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (filters.sort === 'price_desc') query = query.order('price', { ascending: false });
  else if (filters.sort === 'rating') query = query.order('rating', { ascending: false });
  else if (filters.sort === 'popular') query = query.order('views', { ascending: false });
  else query = query.order('sponsored', { ascending: false }).order('created_at', { ascending: false });

  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) { console.error('Supabase getAds error:', JSON.stringify(error)); return { ads: [], total: 0, page, totalPages: 0 }; }
  return { ads: data || [], total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) };
}

export async function getAdById(id) {
  if (!isSupabaseConfigured()) return MOCK_ADS.find(a => a.id === String(id)) || null;

  const { data, error } = await supabaseAdmin
    .from('ads')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .eq('status', 'approved')
    .maybeSingle();

  if (error || !data) return null;
  // Increment views
  await supabaseAdmin.from('ads').update({ views: (data.views || 0) + 1 }).eq('id', id);
  return data;
}

export async function getFeaturedAds() {
  if (!isSupabaseConfigured()) return MOCK_ADS.filter(a => a.is_sponsored);

  const { data, error } = await supabaseAdmin
    .from('ads')
    .select('*, categories(name, slug)')
    .eq('status', 'approved')
    .eq('sponsored', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) return [];
  return data || [];
}

// ============================================
// Reviews
// ============================================

export async function getReviewsByAdId(adId) {
  if (!isSupabaseConfigured()) return MOCK_REVIEWS.filter(r => r.ad_id === parseInt(adId));

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('ad_id', adId)
    .order('created_at', { ascending: false });

  if (error) { console.error('Supabase getReviews error:', error); return []; }
  return data || [];
}

export async function createReview(adId, userId, rating, comment) {
  if (!isSupabaseConfigured()) { MOCK_REVIEWS.push({ ad_id: parseInt(adId), user_id: userId, rating, comment }); return { success: true }; }

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .upsert({ ad_id: adId, user_id: userId, rating, comment }, { onConflict: 'ad_id,user_id' })
    .select()
    .single();

  if (error) { console.error('Supabase createReview error:', error); return { error }; }
  return { data, success: true };
}

// ============================================
// Categories
// ============================================

export async function getCategories() {
  if (!isSupabaseConfigured()) return ['All', 'Products', 'Services', 'Events', 'Other'];

  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('name, slug')
    .order('name');

  if (error || !data) return ['All', 'Products', 'Services', 'Events', 'Other'];
  return ['All', ...data.map(c => c.name)];
}

export async function getCategoryStats() {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('name, slug, ad_count')
    .order('ad_count', { ascending: false });

  if (error) return [];
  return data || [];
}

// ============================================
// Ads CRUD
// ============================================

export async function createAd(adData) {
  if (!isSupabaseConfigured()) {
    const newAd = { ...adData, id: String(Date.now()), created_at: new Date().toISOString(), views: 0, is_sponsored: false, status: 'approved' };
    MOCK_ADS.unshift(newAd);
    return { data: newAd, success: true };
  }

  // Resolve Clerk ID → Supabase profile UUID
  let profileId = null;
  const rawClerkId = adData.user_id && typeof adData.user_id === 'string' && adData.user_id.startsWith('user_')
    ? adData.user_id
    : null;

  if (rawClerkId) {
    profileId = await resolveProfileId(rawClerkId);

    // If no profile exists yet (Clerk webhook hasn't synced),
    // create one automatically so the ad links to a real profile
    if (!profileId) {
      const { data: newProfile } = await supabaseAdmin
        .from('profiles')
        .upsert({
          clerk_id: rawClerkId,
          email: adData.contact_email || null,
        }, { onConflict: 'clerk_id' })
        .select()
        .single();

      if (newProfile?.id) {
        profileId = newProfile.id;
        clearProfileCache();
      }
    }
  }

  const { data, error } = await supabaseAdmin
    .from('ads')
    .insert({
      ...adData,
      user_id: profileId || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase createAd error:', JSON.stringify(error));
    return { error: { message: error.message || JSON.stringify(error) } };
  }
  return { data, success: true };
}

export async function getUserAds(userId) {
  if (!isSupabaseConfigured()) return MOCK_ADS.filter(a => a.user_id === userId);

  // Resolve Clerk ID → Supabase profile UUID
  const profileResult = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('clerk_id', userId)
    .maybeSingle();

  const profileId = profileResult.data?.id;
  if (!profileId) return [];

  const { data } = await supabaseAdmin
    .from('ads')
    .select('*, categories(name, slug)')
    .eq('user_id', profileId)
    .order('created_at', { ascending: false });

  return data || [];
}

// ============================================
// Stats
// ============================================

export async function getStats() {
  if (!isSupabaseConfigured()) {
    return {
      totalAds: MOCK_ADS.length,
      totalReviews: MOCK_REVIEWS.length,
      avgRating: (MOCK_ADS.reduce((sum, a) => sum + a.rating, 0) / MOCK_ADS.length).toFixed(1),
      totalViews: MOCK_ADS.reduce((sum, a) => sum + a.views, 0),
    };
  }

  const [{ count: adCount }, { count: reviewCount }, { data: adRatingData }] = await Promise.all([
    supabaseAdmin.from('ads').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('reviews').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('ads').select('rating, views'),
  ]);

  const avgRating = adRatingData?.length
    ? (adRatingData.reduce((sum, a) => sum + (a.rating || 0), 0) / adRatingData.length).toFixed(1)
    : '0.0';
  const totalViews = adRatingData?.reduce((sum, a) => sum + (a.views || 0), 0) || 0;

  return { totalAds: adCount || 0, totalReviews: reviewCount || 0, avgRating, totalViews };
}
