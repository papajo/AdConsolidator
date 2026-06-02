import { useState, useRef } from 'react';
import Head from 'next/head';
import { useUser } from '@clerk/nextjs';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CATEGORIES = ['Products', 'Services', 'Events'];
const LOCATIONS = ['Global', 'North America', 'Europe', 'Asia Pacific', 'Online'];

// Compress image: resize to max 1200px, quality 0.7
async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round((h / w) * MAX); w = MAX; }
          else { w = Math.round((w / h) * MAX); h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const IS_DEV = (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '').startsWith('pk_test_');

const TEST_AD_DATA = {
  title: "Premium XYZT Marketing Bundle",
  category: "Services",
  location: "Global",
  price: "299",
  description: "Complete XYZT marketing solution for the 123456 audience. Includes SEO optimization, targeted ad campaigns, social media management, and monthly performance reports with actionable insights. Perfect for businesses looking to expand their reach in the XYZT ecosystem.",
  contactName: "John Doe",
  contactEmail: "john@xyztmarketing.test",
  contactPhone: "+1-555-0123",
  website: "https://xyztmarketing.test",
  tags: "marketing, seo, social-media, analytics, enterprise",
};

export default function SubmitAd() {
  const { isSignedIn, user } = useUser();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: '', category: '', location: '', price: '', description: '', contactName: '', contactEmail: '', contactPhone: '', website: '', tags: '', images: [],
  });
  const [submitted, setSubmitted] = useState(false);

  const fillTestData = () => {
    setForm({
      ...form,
      title: TEST_AD_DATA.title,
      category: TEST_AD_DATA.category,
      location: TEST_AD_DATA.location,
      price: TEST_AD_DATA.price,
      description: TEST_AD_DATA.description,
      contactName: TEST_AD_DATA.contactName,
      contactEmail: TEST_AD_DATA.contactEmail,
      contactPhone: TEST_AD_DATA.contactPhone,
      website: TEST_AD_DATA.website,
      tags: TEST_AD_DATA.tags,
    });
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl text-surface-900 mb-3">Sign in to post an ad</h1>
            <p className="text-surface-500 mb-6">You need an account to submit advertisements.</p>
            <a href="/sign-in" className="btn-primary inline-block">Sign In</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const update = (key, val) => setForm({ ...form, [key]: val });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = 5 - form.images.length;
    const toUpload = files.slice(0, remaining);
    if (files.length > remaining) {
      alert(`Maximum 5 images allowed. Uploading ${remaining} of ${files.length} selected.`);
    }

    setUploading(true);
    const newImages = [];

    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image`);
        continue;
      }

      try {
        const base64 = await compressImage(file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64 }),
        });

        const data = await res.json();
        if (data.url) {
          newImages.push({ url: data.url, publicId: data.publicId });
        } else {
          alert(`Upload failed for ${file.name}: ${data.error || 'Unknown error'}`);
        }
      } catch (err) {
        alert(`Upload error for ${file.name}: ${err.message}`);
      }
    }

    setForm({ ...form, images: [...form.images, ...newImages] });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (idx) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryMap = { Products: 1, Services: 2, Events: 3 };
    const adData = {
      title: form.title,
      category_id: categoryMap[form.category],
      location: form.location,
      price: form.price || null,
      description: form.description,
      contact_email: form.contactEmail,
      contact_phone: form.contactPhone || null,
      contact_website: form.website || null,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      image_url: form.images[0]?.url || null,
      image_urls: form.images.map(img => img.url),
      user_id: user?.id,
      status: 'pending',
    };

    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adData),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Submit ad error:', err);
        alert(typeof err.error === 'string' ? err.error : (err.error?.message || 'Failed to submit ad. Please try again.'));
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submit ad error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 animate-fade-in">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-3xl text-surface-900 mb-3">Ad submitted!</h1>
            <p className="text-surface-500 mb-2">Your ad is pending review. We'll notify you once it's approved.</p>
            <p className="text-xs text-surface-400 mb-8">Estimated review time: 24 hours</p>
            <div className="flex gap-3 justify-center">
              <a href="/me/ads" className="btn-primary">Go to Dashboard</a>
              <button onClick={() => { setStep(1); setSubmitted(false); setForm({ title: '', category: '', location: '', price: '', description: '', contactName: '', contactEmail: '', contactPhone: '', website: '', tags: '' }); }} className="btn-secondary">Submit Another</button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canProceed = () => {
    if (step === 1) return form.title && form.category && form.location;
    if (step === 2) return form.description && form.contactEmail;
    return true;
  };

  return (
    <>
      <Head>
        <title>Submit Ad | XYZT Ad Consolidator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />

        <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          <h1 className="font-display text-4xl md:text-5xl text-surface-900 mb-2">Submit your ad</h1>
          <p className="text-surface-500 mb-10">Reach the 123456 audience with your XYZT advertisement.</p>

          {IS_DEV && (
            <div className="glass-card rounded-2xl p-4 mb-6 border border-brand-200 bg-brand-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-surface-600">
                  <strong>Testing:</strong> Click to pre-fill sample ad data
                </span>
              </div>
              <button
                type="button"
                onClick={fillTestData}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 bg-white px-3 py-1.5 rounded-lg border border-brand-200"
              >
                Fill test data
              </button>
            </div>
          )}

          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-10">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${step >= s ? 'bg-brand-500 text-white' : 'bg-surface-100 text-surface-400'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${step > s ? 'bg-brand-500' : 'bg-surface-100'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic info */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Ad Title *</label>
                  <input type="text" className="input-field" placeholder="e.g. Enterprise XYZT License - Annual Plan" value={form.title} onChange={e => update('title', e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Category *</label>
                    <select className="input-field" value={form.category} onChange={e => update('category', e.target.value)}>
                      <option value="">Select category...</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Location *</label>
                    <select className="input-field" value={form.location} onChange={e => update('location', e.target.value)}>
                      <option value="">Select location...</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Price <span className="text-surface-400 font-normal">(optional)</span></label>
                  <input type="text" className="input-field" placeholder="e.g. $299/year or Free / Contact us" value={form.price} onChange={e => update('price', e.target.value)} />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Images <span className="text-surface-400 font-normal">(optional, max 5)</span>
                  </label>
                  <p className="text-xs text-surface-400 mb-3">Upload product photos (PNG, JPG, WebP — max 5MB each)</p>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-surface-200 group">
                        <img src={img.url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >×</button>
                      </div>
                    ))}
                    {form.images.length < 5 && (
                      <label className="w-24 h-24 rounded-xl border-2 border-dashed border-surface-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-colors">
                        <svg className="w-6 h-6 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-xs text-surface-400 mt-1">Add</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                  {uploading && <p className="text-xs text-brand-600">Uploading...</p>}
                </div>
              </div>
            )}

            {/* Step 2: Description & contact */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Description *</label>
                  <textarea className="input-field resize-none h-40" placeholder="Describe your product or service, its benefits, and what makes it stand out..." value={form.description} onChange={e => update('description', e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Tags <span className="text-surface-400 font-normal">(comma separated)</span></label>
                  <input type="text" className="input-field" placeholder="e.g. enterprise, license, 2026, premium" value={form.tags} onChange={e => update('tags', e.target.value)} />
                </div>

                <div className="glass-card rounded-2xl p-5 bg-brand-50/50 border border-brand-100">
                  <h3 className="text-sm font-semibold text-surface-800 mb-3">🔒 Contact Information</h3>
                  <p className="text-xs text-surface-500 mb-4">Your info is masked until a user clicks "Reveal" to prevent scraping.</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Contact Name *</label>
                      <input type="text" className="input-field" placeholder="Your name or company" value={form.contactName} onChange={e => update('contactName', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Email *</label>
                        <input type="email" className="input-field" placeholder="you@example.com" value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
                        <input type="tel" className="input-field" placeholder="+1 (555) 000-0000" value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Website</label>
                      <input type="url" className="input-field" placeholder="https://..." value={form.website} onChange={e => update('website', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="glass-card rounded-3xl p-6">
                  <h3 className="font-display text-lg text-surface-900 mb-4">Review your ad</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-surface-100">
                      <span className="text-sm text-surface-500">Title</span>
                      <span className="text-sm font-medium text-surface-900">{form.title}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-surface-100">
                      <span className="text-sm text-surface-500">Category</span>
                      <span className="text-sm font-medium text-surface-900">{form.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-surface-100">
                      <span className="text-sm text-surface-500">Location</span>
                      <span className="text-sm font-medium text-surface-900">{form.location}</span>
                    </div>
                    {form.price && <div className="flex justify-between py-2 border-b border-surface-100">
                      <span className="text-sm text-surface-500">Price</span>
                      <span className="text-sm font-medium text-surface-900">{form.price}</span>
                    </div>}
                    <div className="py-2 border-b border-surface-100">
                      <span className="text-sm text-surface-500 block mb-1">Description</span>
                      <p className="text-sm text-surface-900">{form.description}</p>
                    </div>
                    {form.tags && <div className="py-2">
                      <span className="text-sm text-surface-500 block mb-1">Tags</span>
                      <div className="flex flex-wrap gap-2">
                        {form.tags.split(',').map((t, i) => (
                          <span key={i} className="text-xs bg-surface-100 text-surface-600 px-2 py-1 rounded-full">{t.trim()}</span>
                        ))}
                      </div>
                    </div>}
                    <div className="pt-2">
                      <span className="text-sm text-surface-500 block mb-2">Contact (masked in listing)</span>
                      <p className="text-sm text-surface-900">{form.contactName} · {form.contactEmail} {form.contactPhone && `· ${form.contactPhone}`} {form.website && `· ${form.website}`}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-xs text-amber-800">⚠️ Your ad will be reviewed by our team before going live. This usually takes less than 24 hours. By submitting, you agree to our <a href="/legal/terms" className="underline">Terms of Service</a>.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary">← Back</button>
              ) : <div />}
              {step < 3 ? (
                <button type="button" onClick={() => canProceed() && setStep(step + 1)} disabled={!canProceed()} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue →
                </button>
              ) : (
                <button type="submit" className="btn-primary">Submit Ad</button>
              )}
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </>
  );
}
