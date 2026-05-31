import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function StripePricingTable({ id, publishableKey }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && !ref.current.querySelector('stripe-pricing-table')) {
      ref.current.innerHTML = `<stripe-pricing-table pricing-table-id="${id}" publishable-key="${publishableKey}"></stripe-pricing-table>`;
    }
  }, [id, publishableKey]);

  return <div ref={ref} />;
}

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Pricing | XYZT Ad Consolidator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl text-surface-900 mb-4">
              Simple, <span className="gradient-text">transparent</span> pricing
            </h2>
            <p className="text-surface-600 text-lg">
              Start free, upgrade when you need more. No hidden fees, no surprises.
            </p>
          </div>
        </section>

        {/* Stripe Pricing Tables */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Pro Plan Table */}
            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-display text-xl text-surface-900 mb-4 text-center">Pro Plan</h3>
              <StripePricingTable
                pricing-table-id="prctbl_1TdDYcH0yf0ExgHW18Vvr35h"
                publishable-key="pk_test_ukl8beX9GjLAyN4bTUzPztls"
              />
            </div>

            {/* Business Plan Table */}
            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-display text-xl text-surface-900 mb-4 text-center">Business Plan</h3>
              <StripePricingTable
                pricing-table-id="prctbl_1TdDZSH0yf0ExgHWKp6lEZAY"
                publishable-key="pk_test_ukl8beX9GjLAyN4bTUzPztls"
              />
            </div>
          </div>

          <p className="text-center text-xs text-surface-400 mt-6">
            Free Starter plan is automatic — no payment needed. <Link href="/sign-up" className="text-brand-600">Create a free account</Link>.
          </p>
        </section>

        {/* FAQ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl text-center text-surface-900 mb-12">
              Frequently asked questions
            </h2>
            <div className="space-y-0">
              {[
                { q: 'Can I upgrade or downgrade anytime?', a: 'Yes! You can switch between plans at any time. Upgrades take effect immediately and you\'ll be prorated. Downgrades apply at the start of your next billing cycle.' },
                { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, MasterCard, American Express) via Stripe. We also support PayPal for annual plans.' },
                { q: 'Is there a free trial for paid plans?', a: 'Yes — both Pro and Business plans come with a 14-day free trial. No credit card required to sign up.' },
                { q: 'How do sponsored ads work?', a: 'Sponsored ads appear at the top of search results and category pages with a "Sponsored" badge. You can purchase placements starting at $5/day through your Business dashboard.' },
                { q: 'Can I cancel anytime?', a: 'Absolutely. No contracts, no commitments. Cancel from your account settings with one click and you\'ll retain access until the end of your billing period.' },
              ].map((faq, i) => (
                <details key={i} className="group border-b border-surface-200 last:border-0">
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none">
                    <span className="text-base font-medium text-surface-800 group-hover:text-brand-700 transition-colors pr-8">{faq.q}</span>
                    <svg className="w-5 h-5 text-surface-400 group-open:rotate-180 transition-transform duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="pb-5 text-sm text-surface-600 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-900 to-surface-950 p-12 md:p-16 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-40 h-40 bg-brand-500 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-brand-400 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Ready to get started?</h2>
              <p className="text-surface-300 text-lg mb-8 max-w-xl mx-auto">Join thousands of advertisers on the XYZT platform. Start free today.</p>
              <Link href="/sign-up" className="px-8 py-3 bg-gradient-to-r from-brand-500 to-brand-400 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:from-brand-600 hover:to-brand-500 active:scale-[0.98] transition-all duration-200">
                Create Free Account
              </Link>
            </div>
          </div>
        </section>

        <Footer />

        {/* Stripe Pricing Table Script - load before React renders */}
        <Script src="https://js.stripe.com/v3/pricing-table.js" strategy="beforeInteractive" />
      </div>
    </>
  );
}
