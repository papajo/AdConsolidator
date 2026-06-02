import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getUserAds } from '../../lib/data';

export default function MyAds() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;
    getUserAds(user.id).then((result) => {
      setAds(Array.isArray(result) ? result : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [isSignedIn, user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center">
            <h1 className="font-display text-3xl text-surface-900 mb-3">Sign in required</h1>
            <p className="text-surface-500 mb-6">Please sign in to view your ads.</p>
            <a href="/sign-in" className="btn-primary inline-block">Sign In</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusColor = (s) => {
    switch (s) {
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-surface-100 text-surface-600';
    }
  };

  return (
    <>
      <Head>
        <title>My Ads | XYZT Ad Consolidator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl text-surface-900">My Ads</h1>
              <p className="text-surface-500 text-sm mt-1">Manage and track your advertisements</p>
            </div>
            <a href="/submit-ad" className="btn-primary">+ New Ad</a>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                  <div className="h-5 bg-surface-200 rounded w-1/3 mb-3" />
                  <div className="h-4 bg-surface-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-surface-700 mb-2">No ads yet</h3>
              <p className="text-sm text-surface-500 mb-6">You haven't submitted any advertisements.</p>
              <a href="/submit-ad" className="btn-primary">Submit Your First Ad</a>
            </div>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div key={ad.id} className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-surface-900">{ad.title}</h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(ad.status)}`}>
                          {ad.status}
                        </span>
                      </div>
                      <p className="text-sm text-surface-500 line-clamp-1 mb-3">{ad.description}</p>
                      <div className="flex items-center gap-4 text-xs text-surface-400">
                        <span>{ad.location || 'Global'}</span>
                        <span>{ad.views || 0} views</span>
                        <span>{new Date(ad.created_at).toLocaleDateString()}</span>
                        {ad.category && <span className="bg-surface-100 px-2 py-0.5 rounded-full text-surface-600">{ad.category}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link href={`/?ad=${ad.id}`} className="text-xs text-brand-600 hover:text-brand-700 font-medium">View</Link>
                      <button className="text-xs text-surface-500 hover:text-surface-700 font-medium">Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
