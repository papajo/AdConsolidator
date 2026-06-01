import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function SubmitAdModal({ onClose, onSubmit }) {
  const { isSignedIn, user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Products',
    contact_email: '',
    contact_phone: '',
    contact_website: '',
    location: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isSignedIn) {
      setError('Please sign in to submit an ad.');
      return;
    }

    setSubmitting(true);
    try {
      const categoryMap = { Products: 1, Services: 2, Events: 3, Other: 1 };
      const adData = {
        title: form.title,
        category_id: categoryMap[form.category],
        category: form.category,
        location: form.location,
        description: form.description,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone || null,
        contact_website: form.contact_website || null,
        tags: [],
        image_url: null,
        user_id: user?.id,
        status: 'pending',
      };

      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit ad');
      }

      const result = await res.json();
      setSubmitted(true);
      if (onSubmit) onSubmit(result.ad);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
        <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
        <div className="relative w-full max-w-2xl mx-4 my-8 glass-card rounded-3xl overflow-hidden animate-slide-up shadow-2xl">
          <div className="h-3 w-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />
          <div className="p-8 text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-display text-xl text-surface-900 mb-2">Sign in required</h3>
            <p className="text-sm text-surface-500 mb-6">You need to sign in before submitting an ad.</p>
            <div className="flex gap-3 justify-center">
              <a href="/sign-in" className="btn-primary">Sign In</a>
              <button onClick={onClose} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
        <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
        <div className="relative w-full max-w-2xl mx-4 my-8 glass-card rounded-3xl overflow-hidden animate-slide-up shadow-2xl">
          <div className="h-3 w-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />
          <div className="p-8 text-center py-16">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 animate-fade-in">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-xl text-surface-900 mb-2">Ad submitted!</h3>
            <p className="text-sm text-surface-500 mb-6">Your ad is pending review. Estimated time: 24 hours.</p>
            <div className="flex gap-3 justify-center">
              <a href="/me/ads" className="btn-primary" onClick={onClose}>My Ads</a>
              <button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', category: 'Products', contact_email: '', contact_phone: '', contact_website: '', location: '' }); }} className="btn-secondary">Submit Another</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-2xl mx-4 my-8 glass-card rounded-3xl overflow-hidden animate-slide-up shadow-2xl">
        <div className="h-3 w-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <h2 className="font-display text-2xl text-surface-900 mb-2">Submit New Advertisement</h2>
          <p className="text-sm text-surface-500 mb-6">Fill in the details below to submit your ad for review.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Ad Title *</label>
              <input
                type="text"
                name="title"
                required
                className="input-field"
                placeholder="e.g., Premium XYZT Marketing Service"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Description *</label>
              <textarea
                name="description"
                required
                className="input-field resize-none h-28"
                placeholder="Describe your product, service, or event in detail..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Category *</label>
                <select
                  name="category"
                  className="input-field"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="Products">Products</option>
                  <option value="Services">Services</option>
                  <option value="Events">Events</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  className="input-field"
                  placeholder="City, Country"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="border-t border-surface-100 pt-4 mt-4">
              <h3 className="text-sm font-semibold text-surface-700 mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-surface-500 mb-1">Email *</label>
                  <input
                    type="email"
                    name="contact_email"
                    required
                    className="input-field text-sm"
                    placeholder="you@company.com"
                    value={form.contact_email}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-surface-500 mb-1">Phone (optional)</label>
                    <input
                      type="tel"
                      name="contact_phone"
                      className="input-field text-sm"
                      placeholder="+1-555-0000"
                      value={form.contact_phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-surface-500 mb-1">Website (optional)</label>
                    <input
                      type="url"
                      name="contact_website"
                      className="input-field text-sm"
                      placeholder="https://yoursite.com"
                      value={form.contact_website}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit for Review'}
              </button>
              <button type="button" onClick={onClose} className="btn-secondary" disabled={submitting}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
