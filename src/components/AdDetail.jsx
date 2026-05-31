import { useState } from 'react';
import { formatDate, getCategoryBadgeClass, formatNumber } from '../lib/utils';

export default function AdDetail({ ad, reviews, onClose }) {
  const [showContact, setShowContact] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [localReviews, setLocalReviews] = useState(reviews || []);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const review = {
      id: Date.now(),
      ad_id: ad.id,
      user_name: 'You',
      rating: newReview.rating,
      comment: newReview.comment,
      created_at: new Date().toISOString(),
    };
    setLocalReviews([review, ...localReviews]);
    setNewReview({ rating: 5, comment: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 my-8 glass-card rounded-3xl overflow-hidden animate-slide-up shadow-2xl">
        {/* Header strip */}
        <div className={`h-3 w-full ${
          ad.category === 'Products' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
          ad.category === 'Services' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
          ad.category === 'Events' ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
          'bg-gradient-to-r from-surface-300 to-surface-400'
        }`} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors z-10"
        >
          <svg className="w-4 h-4 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`badge ${getCategoryBadgeClass(ad.category)}`}>{ad.category}</span>
            {ad.is_sponsored && <span className="badge badge-sponsored">⭐ Sponsored</span>}
            <span className="text-xs text-surface-400 ml-auto">{formatDate(ad.created_at)}</span>
          </div>

          {/* Title */}
          <h2 className="font-display text-3xl text-surface-900 mb-2">{ad.title}</h2>
          <p className="text-sm text-surface-500 mb-6">by <span className="font-medium text-surface-700">{ad.advertiser_name}</span></p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-surface-700 leading-relaxed">{ad.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface-50 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-surface-900">{ad.rating}</span>
                  </div>
                  <p className="text-xs text-surface-500">{ad.review_count} reviews</p>
                </div>
                <div className="bg-surface-50 rounded-xl p-4 text-center">
                  <div className="font-bold text-surface-900 mb-1">{formatNumber(ad.views)}</div>
                  <p className="text-xs text-surface-500">Views</p>
                </div>
                <div className="bg-surface-50 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg className="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-surface-500">{ad.location}</p>
                </div>
              </div>

              {/* Reviews section */}
              <div className="border-t border-surface-100 pt-6">
                <h3 className="font-display text-xl text-surface-900 mb-4">Reviews</h3>

                {/* Submit review */}
                <form onSubmit={handleSubmitReview} className="bg-surface-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-surface-600">Your rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="focus:outline-none"
                        >
                          <svg
                            className={`w-5 h-5 ${star <= newReview.rating ? 'text-amber-400' : 'text-surface-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="input-field resize-none h-20 text-sm"
                    placeholder="Write your review..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                  <button type="submit" className="btn-primary text-sm mt-3 py-2 px-4">
                    Submit Review
                  </button>
                </form>

                {/* Review list */}
                <div className="space-y-4">
                  {localReviews.map((review) => (
                    <div key={review.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{review.user_name[0]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-surface-800">{review.user_name}</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? 'text-amber-400' : 'text-surface-200'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-surface-400">{formatDate(review.created_at)}</span>
                        </div>
                        <p className="text-sm text-surface-600">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Contact */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-surface-50 to-surface-100 rounded-2xl p-6 border border-surface-200">
                <h3 className="font-display text-lg text-surface-900 mb-4">Contact Advertiser</h3>
                
                {!showContact ? (
                  <div className="space-y-3">
                    <p className="text-sm text-surface-500">Click below to reveal contact information for this advertiser.</p>
                    <button
                      onClick={() => setShowContact(true)}
                      className="btn-primary w-full text-sm py-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Reveal Contact Info
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                      <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-surface-700 break-all">{ad.contact_email}</span>
                    </div>
                    {ad.contact_phone && (
                      <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                        <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm text-surface-700">{ad.contact_phone}</span>
                      </div>
                    )}
                    {ad.contact_website && (
                      <a
                        href={ad.contact_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-white rounded-lg hover:bg-brand-50 transition-colors group"
                      >
                        <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="text-sm text-brand-600 group-hover:text-brand-700 font-medium">Visit Website →</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Report */}
              <button className="w-full flex items-center justify-center gap-2 p-3 text-xs text-surface-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Report this ad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
