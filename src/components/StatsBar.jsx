import { formatNumber } from '../lib/utils';

export default function StatsBar({ stats }) {
  if (!stats) return null;

  const items = [
    { label: 'Active Ads', value: stats.totalAds, icon: '📋' },
    { label: 'User Reviews', value: stats.totalReviews, icon: '⭐' },
    { label: 'Avg Rating', value: stats.avgRating, icon: '📊' },
    { label: 'Total Views', value: formatNumber(stats.totalViews), icon: '👀' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="glass-card rounded-xl p-4 text-center opacity-0 animate-fade-in"
            style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="font-bold text-lg text-surface-900">{item.value}</div>
            <div className="text-xs text-surface-500">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
