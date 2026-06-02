import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import AdCard from '../components/AdCard';
import AdDetail from '../components/AdDetail';
import SubmitAdModal from '../components/SubmitAdModal';
import NotificationPanel from '../components/NotificationPanel';
import Footer from '../components/Footer';
import { getAds, getFeaturedAds, getAdById, getReviewsByAdId, getStats } from '../lib/data';

export default function HomePage({ initialAds, initialStats, initialAd, initialAdReviews, initialFeatured }) {
  const router = useRouter();
  const [ads, setAds] = useState(initialAds.ads);
  const [totalAds, setTotalAds] = useState(initialAds.total);
  const [featured, setFeatured] = useState(initialFeatured || []);
  const [stats, setStats] = useState(initialStats);
  const [selectedAd, setSelectedAd] = useState(initialAd || null);
  const [selectedAdReviews, setSelectedAdReviews] = useState(initialAdReviews || []);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAds = useCallback(async (query, category, sort) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = await getAds({ query, category, sort });
    setAds(result.ads);
    setTotalAds(result.total);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAds(searchQuery, activeCategory, sortBy);
  }, [searchQuery, activeCategory, sortBy, fetchAds]);

  // Read ?ad=UUID from URL and open the detail modal
  useEffect(() => {
    const adId = router.query.ad;
    if (adId && !initialAd) {
      getAdById(adId).then((fullAd) => {
        if (fullAd) {
          getReviewsByAdId(adId).then((reviews) => {
            setSelectedAd(fullAd);
            setSelectedAdReviews(reviews || []);
          });
        }
      });
    }
  }, [router.query.ad, initialAd]);

  const handleSearch = (query) => { setSearchQuery(query); };
  const handleCategoryChange = (category) => { setActiveCategory(category); };

  const handleAdClick = async (ad) => {
    const fullAd = await getAdById(ad.id);
    const reviews = await getReviewsByAdId(ad.id);
    if (fullAd) {
      setSelectedAd(fullAd);
      setSelectedAdReviews(reviews);
    }
  };

  // ─── How It Works steps ───
  const steps = [
    { icon: '🔍', title: 'Browse Listings', desc: 'Explore advertisements across Products, Services, and Events — all in one place.' },
    { icon: '📋', title: 'Post Your Ad', desc: 'Submit your own advertisement in minutes. Reach the XYZT-123456 audience instantly.' },
    { icon: '📈', title: 'Grow Your Reach', desc: 'Track views, get reviews, and upgrade to sponsored spots for maximum visibility.' },
  ];

  return (
    <>
      <Head>
        <title>XYZT Ad Consolidator | Discover XYZT Advertisements</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={handleSearch} onCategoryChange={handleCategoryChange} activeCategory={activeCategory} />

        {/* ──────── HERO ──────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                Connecting the XYZT-123456 ecosystem
              </div>
              <h1 className="font-display text-5xl md:text-6xl text-surface-900 mb-4 leading-tight">
                Discover <span className="gradient-text">XYZT</span> Advertisements
              </h1>
              <p className="text-surface-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Your central hub for publishing and finding advertisements related to XYZT → 123456.
                Browse, search, and connect with advertisers — all in one marketplace.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button onClick={() => setShowSubmitModal(true)} className="btn-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Submit Your Ad
                </button>
                {stats && (
                  <div className="flex items-center gap-6 px-6 py-2">
                    <div className="text-center">
                      <span className="font-display text-2xl text-surface-900">{stats.totalAds}</span>
                      <p className="text-xs text-surface-500">Listings</p>
                    </div>
                    <div className="w-px h-8 bg-surface-200" />
                    <div className="text-center">
                      <span className="font-display text-2xl text-surface-900">{stats.avgRating || '—'}</span>
                      <p className="text-xs text-surface-500">Avg Rating</p>
                    </div>
                    <div className="w-px h-8 bg-surface-200" />
                    <div className="text-center">
                      <span className="font-display text-2xl text-surface-900">{stats.totalViews?.toLocaleString() || '—'}</span>
                      <p className="text-xs text-surface-500">Views</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
        </section>

        {/* ──────── HOW IT WORKS ──────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="font-display text-2xl text-surface-900 text-center mb-10">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-display text-lg text-surface-900 mb-1">{s.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ──────── FEATURED ADS ──────── */}
        {featured.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl text-surface-900">Featured</h2>
                <p className="text-xs text-surface-500 mt-0.5">Sponsored and top advertisements</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-surface-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Sponsored
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {featured.map((ad, i) => (
                <AdCard key={ad.id} ad={ad} onClick={handleAdClick} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ──────── ALL ADS ──────── */}
        <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl text-surface-900">Browse All</h2>
              <p className="text-xs text-surface-500 mt-0.5">
                {isLoading
                  ? 'Searching...'
                  : `${ads.length} of ${totalAds} advertisements`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-400">Sort:</span>
              <select
                className="text-sm border border-surface-200 rounded-lg px-3 py-1.5 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Featured</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="card-grid">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden">
                  <div className="h-2 w-full bg-gradient-to-r from-brand-400/30 to-brand-500/30 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                  <div className="p-4 space-y-2.5">
                    <div className="h-3 bg-surface-200 rounded w-16 animate-pulse" />
                    <div className="h-4 bg-surface-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-surface-100 rounded w-full animate-pulse" />
                    <div className="h-3 bg-surface-100 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : ads.length > 0 ? (
            <div className="card-grid">
              {ads.map((ad, index) => (
                <AdCard key={ad.id} ad={ad} onClick={handleAdClick} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-surface-700 mb-2">No ads found</h3>
              <p className="text-sm text-surface-500">Try adjusting your search or category filter.</p>
            </div>
          )}
        </section>

        <Footer />
      </div>

      {/* Modals */}
      {selectedAd && (
        <AdDetail ad={selectedAd} reviews={selectedAdReviews} onClose={() => setSelectedAd(null)} />
      )}
      {showSubmitModal && (
        <SubmitAdModal onClose={() => setShowSubmitModal(false)} onSubmit={() => {}} />
      )}
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const [initialAds, initialStats, initialFeatured] = await Promise.all([
    getAds({ query: '', category: 'All', sort: 'default' }),
    getStats(),
    getFeaturedAds().catch(() => []),
  ]);

  // Pre-fetch ad detail if ?ad=UUID is provided (deep link from My Ads)
  const adId = context.query?.ad;
  let initialAd = null;
  let initialAdReviews = [];
  if (adId && typeof adId === 'string') {
    const [ad, reviews] = await Promise.all([
      getAdById(adId).catch(() => null),
      getReviewsByAdId(adId).catch(() => []),
    ]);
    initialAd = ad;
    initialAdReviews = reviews || [];
  }

  return {
    props: {
      initialAds,
      initialStats,
      initialFeatured: initialFeatured || [],
      initialAd,
      initialAdReviews,
    },
  };
}
