import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setSent(true);
    } catch (err) {
      console.error('Contact form error:', err);
    }
  };

  return (
    <>
      <Head>
        <title>Contact | XYZT Ad Consolidator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl text-surface-900 mb-4">
              Get in <span className="gradient-text">touch</span>
            </h2>
            <p className="text-surface-600 text-lg">
              Have questions about XYZT Ad Consolidator? We'd love to hear from you.
            </p>
          </div>
        </section>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="glass-card rounded-3xl p-8">
                <h3 className="font-display text-2xl text-surface-900 mb-6">Send us a message</h3>

                {sent ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="font-display text-xl text-surface-900 mb-2">Message sent!</h4>
                    <p className="text-sm text-surface-500">We'll get back to you within 24 hours.</p>
                    <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-secondary mt-6">Send another</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Name *</label>
                        <input type="text" required className="input-field" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Email *</label>
                        <input type="email" required className="input-field" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Subject *</label>
                      <select className="input-field" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                        <option value="">Select a topic...</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing & Subscription</option>
                        <option value="partnership">Partnership</option>
                        <option value="abuse">Report Abuse / DMCA</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Message *</label>
                      <textarea required className="input-field resize-none h-36" placeholder="Tell us what's on your mind..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                    </div>

                    <button type="submit" className="btn-primary w-full">Send Message</button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick answers */}
              <div className="glass-card rounded-3xl p-8">
                <h3 className="font-display text-xl text-surface-900 mb-4">Quick answers</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-surface-800 mb-1">🕐 Business Hours</h4>
                    <p className="text-sm text-surface-500">Monday – Friday: 9AM – 6PM EST<br />Weekend: Closed (support via email)</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-surface-800 mb-1">⏱️ Response Time</h4>
                    <p className="text-sm text-surface-500">Most inquiries are answered within 24 hours during business days.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-surface-800 mb-1">🌐 Languages</h4>
                    <p className="text-sm text-surface-500">English, Spanish, Mandarin, and German supported.</p>
                  </div>
                </div>
              </div>

              {/* Direct contact */}
              <div className="bg-gradient-to-br from-surface-900 to-surface-950 rounded-3xl p-8 text-white">
                <h3 className="font-display text-xl mb-4">Prefer direct contact?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-surface-300">Email</p>
                      <p className="text-sm font-medium">support@xyzadconsolidator.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-surface-300">Phone</p>
                      <p className="text-sm font-medium">+1 (555) 214-5678</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-surface-400 mb-3">Follow us</p>
                  <div className="flex gap-3">
                    {['🐦 Twitter', '💼 LinkedIn', '📘 Facebook'].map(s => (
                      <span key={s} className="text-xs text-surface-300 bg-white/5 px-3 py-1.5 rounded-lg">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
