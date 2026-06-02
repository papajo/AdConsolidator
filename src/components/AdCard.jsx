import { formatDate, getCategoryBadgeClass, formatNumber } from '../lib/utils';

function getCategoryName(ad) {
  return ad.category_name || ad.category || ad.categories?.name || 'Other';
}

export default function AdCard({ ad, onClick, index }) {
  const delay = (index % 10) * 0.06;
  const category = getCategoryName(ad);

  const tagColors = {
    Products: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Services: 'bg-blue-100 text-blue-800 border-blue-200',
    Events: 'bg-purple-100 text-purple-800 border-purple-200',
    Other: 'bg-surface-100 text-surface-700 border-surface-200',
  };

  return (
    <article
      onClick={() => onClick(ad)}
      className="group bg-white rounded-xl border border-surface-200/70 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      {/* Color strip */}
      <div className={`h-1.5 rounded-t-xl ${
        category === 'Products' ? 'bg-emerald-400' :
        category === 'Services' ? 'bg-blue-400' :
        category === 'Events' ? 'bg-purple-400' :
        'bg-surface-300'
      }`} />

      <div className="p-4">
        {/* Top badge row */}
        <div className="flex items-center justify-between mb-2.5">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${tagColors[category] || tagColors.Other}`}>
            {category}
          </span>
          {ad.is_sponsored && (
            <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Sponsored
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-medium text-sm text-surface-900 mb-2 line-clamp-2 leading-snug group-hover:text-brand-700 transition-colors">
          {ad.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-surface-500 leading-relaxed line-clamp-2 mb-3">
          {ad.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-surface-100">
          {/* Date with calendar icon */}
          <div className="flex items-center gap-1.5 text-xs text-surface-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(ad.created_at)}
          </div>

          {/* Right side: stats */}
          <div className="flex items-center gap-3">
            {/* Views */}
            <div className="flex items-center gap-1 text-xs text-surface-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formatNumber(ad.views)}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-surface-700">{ad.rating}</span>
            </div>

            {/* Location / avatar */}
            {ad.location && (
              <span className="text-xs text-surface-400 truncate max-w-[60px]" title={ad.location}>
                {ad.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
