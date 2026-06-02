import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../components/Header";
import AdCard from "../components/AdCard";
import AdDetail from "../components/AdDetail";
import SubmitAdModal from "../components/SubmitAdModal";
import NotificationPanel from "../components/NotificationPanel";
import Footer from "../components/Footer";
import {
  getAds,
  getFeaturedAds,
  getAdById,
  getReviewsByAdId,
  getStats,
} from "../lib/data";

const CATEGORIES = ["All", "Products", "Services", "Events"];
const PAGE_SIZE = 12;

export default function HomePage({
  initialAds,
  initialStats,
  initialAd,
  initialAdReviews,
  initialFeatured,
}) {
  const router = useRouter();
  const [ads, setAds] = useState(initialAds.ads);
  const [totalAds, setTotalAds] = useState(initialAds.total);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialAds.totalPages || 1);
  const [featured, setFeatured] = useState(initialFeatured || []);
  const [stats, setStats] = useState(initialStats);
  const [selectedAd, setSelectedAd] = useState(initialAd || null);
  const [selectedAdReviews, setSelectedAdReviews] = useState(
    initialAdReviews || [],
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAds = useCallback(async (query, category, page) => {
    setIsLoading(true);
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    const result = await getAds({
      query,
      category,
      sort: "default",
      page,
      limit: PAGE_SIZE,
    });
    setAds(result.ads);
    setTotalAds(result.total);
    setCurrentPage(result.page);
    setTotalPages(result.totalPages);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAds(searchQuery, activeCategory, 1);
  }, [searchQuery, activeCategory, fetchAds]);

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
    const [fullAd, reviews] = await Promise.all([
      getAdById(ad.id),
      getReviewsByAdId(ad.id),
    ]);

    if (fullAd) {
      setSelectedAd(fullAd);
      setSelectedAdReviews(reviews || []);
      router.push(
        { pathname: router.pathname, query: { ...router.query, ad: ad.id } },
        undefined,
        { shallow: true },
      );
    }
  };

  const handleCloseAdDetail = () => {
    const nextQuery = { ...router.query };
    delete nextQuery.ad;
    setSelectedAd(null);
    setSelectedAdReviews([]);
    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, {
      shallow: true,
    });
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchAds(searchQuery, activeCategory, page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);
      if (currentPage <= 3) {
        start = 2;
        end = Math.min(totalPages - 1, 6);
      }
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 5);
        end = totalPages - 1;
      }
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <Head>
        <title>XYZT Ad Consolidator | Discover XYZT Advertisements</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-14 w-full">
          {/* ─── Unified Filter & Status Bar ─── */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {/* Filter group: category pills + search */}
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <div className="-mx-1 flex gap-1 overflow-x-auto px-1 scrollbar-none sm:mx-0 sm:px-0">
                {CATEGORIES.map((cat) => {
                  const isActive = cat === activeCategory;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                        isActive
                          ? "bg-white border-surface-300 shadow-sm text-surface-900"
                          : "bg-white/60 border-transparent text-surface-500 hover:bg-white/80 hover:border-surface-200"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-auto sm:min-w-[180px] sm:max-w-[220px]">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search ads..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white/80 border border-surface-200 rounded-lg text-xs text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-300 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Status group: stats + action buttons */}
            <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end">
              {stats && (
                <>
                  <div className="flex items-center gap-2 rounded-lg border border-surface-200/60 bg-white/70 px-3 py-1.5 text-[11px] text-surface-500 sm:hidden">
                    <span>
                      <strong className="text-surface-700">
                        {stats.totalAds}
                      </strong>{" "}
                      listings
                    </span>
                    <span className="text-surface-300">·</span>
                    <span>
                      <strong className="text-surface-700">
                        {stats.avgRating}
                      </strong>{" "}
                      ★
                    </span>
                  </div>
                  <div className="hidden items-center gap-2.5 rounded-lg border border-surface-200/60 bg-white/70 px-3 py-1.5 text-xs text-surface-500 sm:flex">
                    <span>
                      <strong className="text-surface-700">
                        {stats.totalAds}
                      </strong>{" "}
                      listings
                    </span>
                    <span className="h-3 w-px bg-surface-300/40" />
                    <span>
                      <strong className="text-surface-700">
                        {stats.avgRating}
                      </strong>{" "}
                      ★
                    </span>
                    <span className="h-3 w-px bg-surface-300/40" />
                    <span>
                      <strong className="text-surface-700">
                        {(stats.totalViews || 0).toLocaleString()}
                      </strong>{" "}
                      views
                    </span>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white transition-colors hover:bg-brand-600 sm:h-7 sm:w-7"
                  title="New Ad"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setShowNotifications(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-200 bg-white text-surface-500 transition-colors hover:bg-surface-50 sm:h-7 sm:w-7"
                  title="Alerts"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ─── Featured Row ─── */}
          {featured.length > 0 &&
            searchQuery === "" &&
            activeCategory === "All" && (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-surface-800">
                    Featured
                  </span>
                  <span className="text-[11px] text-surface-400">
                    Featured picks
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
                  {featured.map((ad, index) => (
                    <AdCard
                      key={ad.id}
                      ad={ad}
                      onClick={handleAdClick}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* ─── Result count ─── */}
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-surface-400">
              {isLoading
                ? "Loading..."
                : totalAds > 0
                  ? `Page ${currentPage} · ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, totalAds)} of ${totalAds}`
                  : "0 results"}
            </p>
            {searchQuery && totalAds > 0 && (
              <p className="text-[11px] text-surface-400">
                {totalAds} result{totalAds !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* ─── Ad Grid ─── */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:auto-rows-fr sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="min-h-[220px] overflow-hidden rounded-xl border border-surface-200/60 bg-white shadow-sm animate-pulse"
                >
                  <div className="h-1.5 bg-surface-100 rounded-t-xl" />
                  <div className="space-y-2 p-3.5 sm:space-y-1.5 sm:p-3">
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
            <div className="grid grid-cols-1 gap-3 sm:auto-rows-fr sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {ads.map((ad, index) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onClick={handleAdClick}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-12 h-12 rounded-full bg-white/80 border border-surface-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg
                  className="w-5 h-5 text-surface-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-base text-surface-700 mb-1">
                No ads found
              </h3>
              <p className="text-sm text-surface-500">
                Try a different search or category.
              </p>
            </div>
          )}

          {/* ─── Pagination ─── */}
          {totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-2 mt-10 pb-2"
              aria-label="Pagination"
            >
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-surface-600 rounded-lg hover:bg-surface-100 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className="px-1.5 text-xs text-surface-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`min-w-[36px] h-9 text-sm font-medium rounded-lg transition-all ${
                      p === currentPage
                        ? "bg-brand-500 text-white shadow-sm"
                        : "text-surface-600 hover:bg-surface-100"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-surface-600 rounded-lg hover:bg-surface-100 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
              >
                Next
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </nav>
          )}
        </main>

        <Footer />
      </div>

      {/* Modals */}
      {selectedAd && (
        <AdDetail
          ad={selectedAd}
          reviews={selectedAdReviews}
          onClose={handleCloseAdDetail}
        />
      )}
      {showSubmitModal && (
        <SubmitAdModal
          onClose={() => setShowSubmitModal(false)}
          onSubmit={() => {}}
        />
      )}
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const [initialAds, initialStats, initialFeatured] = await Promise.all([
    getAds({
      query: "",
      category: "All",
      sort: "default",
      page: 1,
      limit: PAGE_SIZE,
    }),
    getStats(),
    getFeaturedAds().catch(() => []),
  ]);

  const adId = context.query?.ad;
  let initialAd = null;
  let initialAdReviews = [];
  if (adId && typeof adId === "string") {
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
