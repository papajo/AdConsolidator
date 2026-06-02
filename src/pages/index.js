import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import AdCard from '../components/AdCard';
import AdDetail from '../components/AdDetail';
import StatsBar from '../components/StatsBar';
import SubmitAdModal from '../components/SubmitAdModal';
import NotificationPanel from '../components/NotificationPanel';
import Footer from '../components/Footer';
import { getAds, getAdById, getReviewsByAdId, getStats } from '../lib/data';

export default function HomePage({ initialAds, initialStats, initialAd, initialAdReviews }) {
  const router = useRouter();
  const [ads, setAds] = useState(initialAds.ads);
  const [totalAds, setTotalAds] = useState(initialAds.total);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleAdClick = async (ad) => {
    const fullAd = await getAdById(ad.id);
    const reviews = await getReviewsByAdId(ad.id);
    setSelectedAd(fullAd);
    setSelectedAdReviews(reviews);
  };

  const handleSubmitAd = (formData) => {
    // In production, this would POST to the API
    console.log('New ad submitted:', formData);
  };

  return (
    <>
      <Head>
        <title>XYZT Ad Consolidator | Discover XYZT Advertisements</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          activeCategory={activeCategory}
        />

        {/* Hero section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
            <div className="text-center max-w-2xl mx-auto opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
              <h2 className="font-display text-4xl md:text-5xl text-surface-900 mb-4 leading-tight">
                Discover <span className="gradient-text">XYZT</span> Advertisements
              </h2>
              <p className="text-surface-600 text-lg leading-relaxed mb-6">
                Your central hub for finding and publishing advertisements related to XYZT → 123456 now. 
                Search, filter, and connect with advertisers instantly.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setShowSubmitModal(true)} className="btn-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Submit Your Ad
                </button>
                <button onClick={() => setShowNotifications(true)} className="btn-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Get Alerts
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Main content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-surface-500">
              {isLoading ? (
                <span className="animate-pulse-soft">Searching...</span>
              ) : (
                <>Showing <span className="font-semibold text-surface-700">{ads.length}</span> of {totalAds} advertisements</>
              )}
            </p>
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

          {/* Ad grid */}
          {isLoading ? (
            <div className="card-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden">
                  <div className="h-2 w-full bg-surface-200 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-surface-200 rounded w-20 animate-pulse" />
                    <div className="h-5 bg-surface-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-surface-100 rounded w-full animate-pulse" />
                    <div className="h-4 bg-surface-100 rounded w-2/3 animate-pulse" />
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
              <p className="text-sm text-surface-500">Try adjusting your search query or category filter.</p>
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Modals */}
      {selectedAd && (
        <AdDetail
          ad={selectedAd}
          reviews={selectedAdReviews}
          onClose={() => setSelectedAd(null)}
        />
      )}

      {showSubmitModal && (
        <SubmitAdModal
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmitAd}
        />
      )}

      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const [initialAds, initialStats] = await Promise.all([
    getAds({ query: '', category: 'All', sort: 'default' }),
    getStats(),
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
      initialAd,
      initialAdReviews,
    },
  };
}
