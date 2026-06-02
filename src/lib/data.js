import { supabase, supabaseAdmin } from './supabase';
import {
  generateAds,
  generateFeatured,
  generateStats as generateSyntheticStats,
  querySyntheticAds,
} from './synthetic-data';

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

// Synthetic reviews (used when Supabase isn't configured)
const SYNTHETIC_REVIEWS = [];

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
    return querySyntheticAds({
      query: search,
      category: filters.category,
      sort: filters.sort,
      page: filters.page || 1,
      limit: filters.limit || 12,
    });
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
  if (!isSupabaseConfigured()) {
    return generateAds().find(a => a.id === String(id)) || null;
  }

  const { data, error } = await supabaseAdmin
    .from('ads')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  // Increment views (only for approved/active ads)
  if (data.status === 'approved' || data.status === 'active') {
    await supabaseAdmin.from('ads').update({ views: (data.views || 0) + 1 }).eq('id', id);
  }
  return data;
}

export async function getFeaturedAds() {
  if (!isSupabaseConfigured()) return generateFeatured();

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
  if (!isSupabaseConfigured()) return SYNTHETIC_REVIEWS.filter(r => r.ad_id === parseInt(adId));

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('ad_id', adId)
    .order('created_at', { ascending: false });

  if (error) { console.error('Supabase getReviews error:', error); return []; }
  return data || [];
}

export async function createReview(adId, userId, rating, comment) {
  if (!isSupabaseConfigured()) { SYNTHETIC_REVIEWS.push({ ad_id: parseInt(adId), user_id: userId, rating, comment }); return { success: true }; }

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
    generateAds(); // ensure cache is warm
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
      const { data: newProfile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          clerk_id: rawClerkId,
          email: adData.contact_email || null,
        }, { onConflict: 'clerk_id' })
        .select()
        .single();

      if (profileError) {
        console.error('Failed to auto-create profile:', JSON.stringify(profileError));
      } else if (newProfile?.id) {
        profileId = newProfile.id;
        clearProfileCache();
      }
    }
  }

  // Strip fields that may not exist in the database schema
  // (only pass columns defined in both supabase-*.sql schemas)
  // Also sanitize price: extract numeric value from strings like "$299/month"
  let sanitizedPrice = adData.price;
  if (typeof sanitizedPrice === 'string' && sanitizedPrice.length > 0) {
    const match = sanitizedPrice.replace(/,/g, '').match(/[\d]+(?:\.[\d]+)?/);
    sanitizedPrice = match ? parseFloat(match[0]) : null;
  } else if (!sanitizedPrice) {
    sanitizedPrice = null;
  }

  const { category, category_name, contactName, price, user_id, ...safeData } = adData;

  const { data, error } = await supabaseAdmin
    .from('ads')
    .insert({
      ...safeData,
      price: sanitizedPrice,
      user_id: profileId || null,
      // Store raw Clerk ID as fallback lookup key when profile doesn't exist yet
      clerk_id: !profileId ? rawClerkId : null,
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
  if (!isSupabaseConfigured()) return generateAds().filter(a => a.user_id === userId);

  // Try resolving Clerk ID → Supabase profile UUID
  const profileResult = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('clerk_id', userId)
    .maybeSingle();

  const profileId = profileResult.data?.id;

  if (profileId) {
    // Profile exists → look up by profile UUID
    const { data } = await supabaseAdmin
      .from('ads')
      .select('*, categories(name, slug)')
      .eq('user_id', profileId)
      .order('created_at', { ascending: false });

    return data || [];
  }

  // No profile yet (webhook hasn't synced, or RLS blocked creation)
  // Fall back to clerk_id lookup on the ads table
  const { data } = await supabaseAdmin
    .from('ads')
    .select('*, categories(name, slug)')
    .eq('clerk_id', userId)
    .order('created_at', { ascending: false });

  return data || [];
}

// ============================================
// Admin: Review Workflow
// ============================================

export async function getPendingAds() {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabaseAdmin
    .from('ads')
    .select('*, categories(name, slug), profiles!ads_user_id_fkey(email, first_name, last_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getPendingAds error:', error);
    return [];
  }
  return data || [];
}

export async function updateAdStatus(adId, status, reviewNote) {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured' };

  const updateData = { status };
  if (reviewNote) updateData.review_note = reviewNote;

  const { data, error } = await supabaseAdmin
    .from('ads')
    .update(updateData)
    .eq('id', adId)
    .select()
    .single();

  if (error) {
    console.error('updateAdStatus error:', error);
    return { error: error.message };
  }
  return { data };
}

// ============================================
// Stats
// ============================================

export async function getStats() {
  if (!isSupabaseConfigured()) return generateSyntheticStats();

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
