import { useState } from 'react';

export default function NotificationPanel({ onClose }) {
  const [email, setEmail] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categories = ['Products', 'Services', 'Events', 'Other'];

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-md mx-4 my-8 glass-card rounded-3xl overflow-hidden animate-slide-up shadow-2xl">
        <div className="h-3 w-full bg-gradient-to-r from-purple-400 via-pink-400 to-brand-400" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {subscribed ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-display text-2xl text-surface-900 mb-2">Subscribed!</h2>
              <p className="text-sm text-surface-500">You'll receive alerts when new matching ads are posted.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display text-xl text-surface-900">Ad Alerts</h2>
                  <p className="text-xs text-surface-500">Get notified about new ads</p>
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="input-field text-sm"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                          ${selectedCategories.includes(cat)
                            ? 'bg-brand-500 text-white shadow-sm'
                            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Keywords (optional)</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    placeholder="e.g., automation, conference, SDK"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                  <p className="text-xs text-surface-400 mt-1">Separate multiple keywords with commas</p>
                </div>

                <button type="submit" className="btn-primary w-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Subscribe to Alerts
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
