import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'free forever',
      description: 'Perfect for individuals browsing ads',
      features: [
        'Browse all advertisements',
        'Basic keyword search',
        'Category filtering',
        'Leave reviews & ratings',
        'Reveal advertiser contacts',
        '',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'per month',
      description: 'For power users who want more',
      features: [
        'Everything in Starter',
        'Ad-free browsing experience',
        'Advanced search filters',
        'Save & manage searches',
        'Email alerts for new ads',
        'Priority support',
        'Export ad listings to CSV',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Business',
      price: '$29',
      period: 'per month',
      description: 'For businesses promoting their services',
      features: [
        'Everything in Pro',
        'Post up to 10 ads/month',
        'Sponsored ad placements',
        'Analytics dashboard',
        'Bulk ad management',
        'API access',
        'Dedicated account manager',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
  ];

  const faqs = [
    {
      q: 'Can I upgrade or downgrade anytime?',
      a: 'Yes! You can switch between plans at any time. Upgrades take effect immediately and you\'ll be prorated. Downgrades apply at the start of your next billing cycle.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards (Visa, MasterCard, American Express) via Stripe. We also support PayPal for annual plans.',
    },
    {
      q: 'Is there a free trial for paid plans?',
      a: 'Yes — both Pro and Business plans come with a 14-day free trial. No credit card required to sign up.',
    },
    {
      q: 'How do sponsored ads work?',
      a: 'Sponsored ads appear at the top of search results and category pages with a "Sponsored" badge. You can purchase placements starting at $5/day through your Business dashboard.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Absolutely. No contracts, no commitments. Cancel from your account settings with one click and you\'ll retain access until the end of your billing period.',
    },
  ];

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

        {/* Pricing cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? 'glass-card shadow-2xl shadow-brand-500/10 ring-2 ring-brand-500 scale-105'
                    : 'glass-card'
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white text-center text-sm font-semibold py-2">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className="font-display text-2xl text-surface-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-surface-500 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="font-display text-5xl text-surface-900">{plan.price}</span>
                    <span className="text-surface-500 text-sm ml-1">/{plan.period}</span>
                  </div>

                  <button
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${
                      plan.popular
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        {feature ? (
                          <>
                            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-surface-600">{feature}</span>
                          </>
                        ) : (
                          <span className="text-sm text-surface-300">—</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-16 text-center">
            <p className="text-sm text-surface-400 mb-4">Trusted by 1,000+ advertisers worldwide</p>
            <div className="flex items-center justify-center gap-8 opacity-40">
              {['🔒 SSL Secured', '💳 Stripe Payments', '🔄 Cancel Anytime', '⭐ 4.9/5 Rating'].map((badge) => (
                <span key={badge} className="text-sm font-medium text-surface-600 whitespace-nowrap">{badge}</span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-surface-50 border-y border-surface-200/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="font-display text-3xl text-center text-surface-900 mb-12">
              Frequently asked questions
            </h2>

            <div className="space-y-0">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border-b border-surface-200 last:border-0"
                >
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none">
                    <span className="text-base font-medium text-surface-800 group-hover:text-brand-700 transition-colors pr-8">
                      {faq.q}
                    </span>
                    <svg
                      className="w-5 h-5 text-surface-400 group-open:rotate-180 transition-transform duration-200 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="pb-5 text-sm text-surface-600 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-surface-500">
                Still have questions?{' '}
                <Link href="/contact" className="text-brand-600 hover:text-brand-700 font-medium">
                  Contact our sales team
                </Link>
              </p>
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
              <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-surface-300 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of advertisers and businesses on the XYZT platform. Start free today.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-brand-500 to-brand-400 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:from-brand-600 hover:to-brand-500 active:scale-[0.98] transition-all duration-200">
                  Start Free Trial
                </button>
                <Link href="/" className="px-8 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-200">
                  Browse Ads
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
