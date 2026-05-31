import { formatDate, getCategoryBadgeClass, formatNumber } from '../lib/utils';

export default function AdCard({ ad, onClick, index }) {
  const delay = (index % 6) * 0.08;

  return (
    <article
      onClick={() => onClick(ad)}
      className="group glass-card rounded-2xl overflow-hidden hover-lift cursor-pointer opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      {/* Image thumbnail */}
      {ad.images && ad.images.length > 0 && (
        <div className="h-32 bg-surface-100 relative overflow-hidden">
          <img src={ad.images[0]} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {ad.images.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              +{ad.images.length - 1}
            </span>
          )}
        </div>
      )}

      {/* Visual header strip (fallback when no image) */}
      {!ad.images?.length && (
        <div className={`h-2 w-full ${
          ad.category === 'Products' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
          ad.category === 'Services' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
          ad.category === 'Events' ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
          'bg-gradient-to-r from-surface-300 to-surface-400'
        }`} />
      )}

      <div className="p-5">
        {/* Top meta */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`badge ${getCategoryBadgeClass(ad.category)}`}>
              {ad.category}
            </span>
            {ad.is_sponsored && (
              <span className="badge badge-sponsored">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Sponsored
              </span>
            )}
          </div>
          <span className="text-xs text-surface-400">{formatDate(ad.created_at)}</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg text-surface-900 mb-2 group-hover:text-brand-700 transition-colors line-clamp-2">
          {ad.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-surface-600 leading-relaxed mb-4 line-clamp-2">
          {ad.description}
        </p>

        {/* Footer meta */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-100">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-surface-500">{ad.location}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-semibold text-surface-700">{ad.rating}</span>
              <span className="text-xs text-surface-400">({ad.review_count})</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-xs text-surface-400">{formatNumber(ad.views)}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
