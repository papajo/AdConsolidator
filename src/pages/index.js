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

const CATEGORIES = ['All', 'Products', 'Services', 'Events'];

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
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAds = useCallback(async (query, category) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    const result = await getAds({ query, category, sort: 'default' });
    setAds(result.ads);
    setTotalAds(result.total);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAds(searchQuery, activeCategory);
  }, [searchQuery, activeCategory, fetchAds]);

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

  // Count ads per category (from current results)
  const countByCategory = (cat) => {
    if (cat === 'All') return totalAds;
    return ads.filter(a => {
      const name = a.category_name || a.category || a.categories?.name;
      return name === cat;
    }).length;
  };

  return (
    <>
      <Head>
        <title>XYZT Ad Consolidator | Discover XYZT Advertisements</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={handleSearch} onCategoryChange={handleCategoryChange} activeCategory={activeCategory} />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 w-full">
          {/* ─── Board Header ─── */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl text-surface-900">Ad Marketplace</h1>
              <p className="text-sm text-surface-500 mt-1">Browse listings across Products, Services, and Events</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowNotifications(true)} className="btn-secondary text-sm !px-3 !py-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Alerts
              </button>
              <button onClick={() => setShowSubmitModal(true)} className="btn-primary text-sm !px-4 !py-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Ad
              </button>
            </div>
          </div>

          {/* ─── Stats Bar (compact) ─── */}
          {stats && (
            <div className="flex items-center gap-8 mb-8 px-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-display text-surface-900">{stats.totalAds}</span>
                <span className="text-sm text-surface-500">listings</span>
              </div>
              <div className="w-px h-6 bg-surface-300/60" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-display text-surface-900">{stats.avgRating || '—'}</span>
                <span className="text-sm text-surface-500">avg rating</span>
              </div>
              <div className="w-px h-6 bg-surface-300/60" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-display text-surface-900">{(stats.totalViews || 0).toLocaleString()}</span>
                <span className="text-sm text-surface-500">views</span>
              </div>
            </div>
          )}

          {/* ─── Category Columns ─── */}
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              const isAll = cat === 'All';
              const tagColors = {
                Products: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                Services: 'bg-blue-100 text-blue-800 border-blue-200',
                Events: 'bg-purple-100 text-purple-800 border-purple-200',
              };
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`snap-start shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'bg-white border-surface-300 shadow-md text-surface-900'
                      : 'bg-white/60 border-transparent text-surface-500 hover:bg-white/90 hover:border-surface-200'
                  }`}
                >
                  {!isAll && (
                    <span className={`w-2 h-2 rounded-full ${tagColors[cat]?.split(' ')[0] || 'bg-surface-300'}`} />
                  )}
                  <span className="text-sm font-medium">{cat}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-surface-100 text-surface-600' : 'bg-surface-100/60 text-surface-400'
                  }`}>
                    {isAll ? totalAds : countByCategory(cat)}
                  </span>
                </button>
              );
            })}

            {/* Spacer to show scroll hint */}
            <div className="shrink-0 w-2" />
          </div>

          {/* ─── Search Bar ─── */}
          <div className="relative mt-5 mb-6">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-surface-200 rounded-xl text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-300 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* ─── Featured Row ─── */}
          {featured.length > 0 && searchQuery === '' && activeCategory === 'All' && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-surface-700">Featured</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
                {featured.map((ad) => (
                  <div key={ad.id} className="snap-start shrink-0 w-72" onClick={() => handleAdClick(ad)}>
                    <AdCard ad={ad} onClick={handleAdClick} index={0} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Ad Grid ─── */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-surface-200/60 shadow-sm overflow-hidden animate-pulse">
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-surface-100 rounded w-16" />
                    <div className="h-4 bg-surface-100 rounded w-3/4" />
                    <div className="h-3 bg-surface-50 rounded w-full" />
                    <div className="h-3 bg-surface-50 rounded w-1/2" />
                    <div className="flex justify-between pt-2 border-t border-surface-100">
                      <div className="h-3 bg-surface-100 rounded w-16" />
                      <div className="h-3 bg-surface-100 rounded w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : ads.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {ads.map((ad, index) => (
                <AdCard key={ad.id} ad={ad} onClick={handleAdClick} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-full bg-white/80 border border-surface-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-6 h-6 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-display text-lg text-surface-700 mb-1">No ads found</h3>
              <p className="text-sm text-surface-500">Try a different search or category.</p>
            </div>
          )}
        </main>

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
