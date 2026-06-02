import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export default function AdminReviews() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const isAdmin = isSignedIn && user?.primaryEmailAddress &&
    ADMIN_EMAILS.includes(user.primaryEmailAddress.emailAddress.toLowerCase());

  useEffect(() => {
    if (!isSignedIn || !isAdmin) {
      setLoading(false);
      return;
    }
    fetch('/api/admin/review')
      .then(r => r.json())
      .then(data => {
        setAds(data.ads || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isSignedIn, isAdmin]);

  const handleReview = async (adId, status) => {
    const note = status === 'rejected'
      ? prompt('Reason for rejection (optional):')
      : null;

    setActionLoading(adId);
    try {
      const res = await fetch('/api/admin/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId, status, reviewNote: note }),
      });
      if (res.ok) {
        setAds(prev => prev.filter(a => a.id !== adId));
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update');
      }
    } catch (err) {
      alert('Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin — Review Ads | XYZT Ad Consolidator</title>
      </Head>
      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />

        <main className="flex-1 max-w-4xl mx-auto px-4 py-10">
          <h1 className="font-display text-3xl text-surface-900 mb-2">Review Ads</h1>
          <p className="text-surface-500 text-sm mb-8">Approve or reject pending advertisements.</p>

          {!isSignedIn ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-surface-600 mb-4">Sign in with an admin account to review ads.</p>
              <a href="/sign-in" className="btn-primary inline-block">Sign In</a>
            </div>
          ) : !isAdmin ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10" />
                </svg>
              </div>
              <p className="text-surface-600">You don't have admin permissions.</p>
              <p className="text-xs text-surface-400 mt-1">
                Your email ({user?.primaryEmailAddress?.emailAddress}) is not in the admin list.
              </p>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                  <div className="h-5 bg-surface-200 rounded w-1/2 mb-3" />
                  <div className="h-4 bg-surface-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-lg text-surface-700 mb-1">All caught up!</h3>
              <p className="text-sm text-surface-500">No pending ads to review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ads.map(ad => (
                <div key={ad.id} className="glass-card rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-surface-900">{ad.title}</h3>
                      <p className="text-sm text-surface-500 line-clamp-2 mt-1">{ad.description}</p>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full ml-4">
                      Pending
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-surface-400 mb-4">
                    <span>Category: {ad.categories?.name || ad.category || 'N/A'}</span>
                    <span>Location: {ad.location || 'N/A'}</span>
                    <span>Contact: {ad.contact_email || 'N/A'}</span>
                    <span>Submitted: {new Date(ad.created_at).toLocaleDateString()}</span>
                    {ad.profiles && (
                      <span>By: {ad.profiles.first_name || ad.profiles.email || 'Unknown'}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(ad.id, 'approved')}
                      disabled={actionLoading === ad.id}
                      className="btn-primary text-sm"
                    >
                      {actionLoading === ad.id ? 'Processing...' : '✓ Approve'}
                    </button>
                    <button
                      onClick={() => handleReview(ad.id, 'rejected')}
                      disabled={actionLoading === ad.id}
                      className="btn-secondary text-sm text-red-600 border-red-200 hover:bg-red-50"
                    >
                      ✕ Deny
                    </button>
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
