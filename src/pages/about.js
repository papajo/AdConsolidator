import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  const team = [
    { name: 'Alex Chen', role: 'Founder & CEO', bio: 'Former ad tech executive with 12+ years building marketplace platforms.' },
    { name: 'Sarah Johnson', role: 'Head of Product', bio: 'UX-focused product leader who previously scaled a B2B SaaS to 50k users.' },
    { name: 'Marcus Rivera', role: 'Lead Engineer', bio: 'Full-stack engineer passionate about clean architecture and developer experience.' },
    { name: 'Priya Patel', role: 'Growth & Marketing', bio: 'Data-driven growth marketer who loves connecting businesses with their audience.' },
  ];

  const milestones = [
    { year: '2025 Q1', title: 'Idea Born', desc: 'Identified the gap in XYZT-specific ad aggregation while consulting for 123456 enterprises.' },
    { year: '2025 Q3', title: 'MVP Launched', desc: 'Released the first version with 50 curated ads and basic search functionality.' },
    { year: '2026 Q1', title: '1,000 Users', desc: 'Reached 1,000 active users and 200+ verified advertisers on the platform.' },
    { year: '2026 Q2', title: 'Global Expansion', desc: 'Expanded to 15 countries with multi-language support and local category filters.' },
  ];

  const values = [
    { icon: '🔍', title: 'Transparency', desc: 'Every ad is clearly labeled with contact details, ratings, and sponsored status. No hidden agendas.' },
    { icon: '⚡', title: 'Speed', desc: 'Real-time updates, fast search, and instant contact reveal. We value your time.' },
    { icon: '🛡️', title: 'Trust', desc: 'Verified advertisers, community ratings, and a report system keeps the platform safe for everyone.' },
    { icon: '🌍', title: 'Accessibility', desc: 'Free tier for browsing, no walls to entry. Quality information should be available to all.' },
  ];

  return (
    <>
      <Head>
        <title>About | XYZT Ad Consolidator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl text-surface-900 mb-4">
              Building the future of <span className="gradient-text">XYZT advertising</span>
            </h2>
            <p className="text-surface-600 text-lg leading-relaxed">
              We're on a mission to make XYZT-related advertisements discoverable, trustworthy, and accessible to everyone — from individual shoppers to enterprise buyers.
            </p>
          </div>
        </section>

        {/* Stats bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '2.5K', label: 'Verified Ads' },
              { value: '15', label: 'Countries' },
              { value: '4.8', label: 'Avg Rating' },
            ].map(stat => (
              <div key={stat.label} className="glass-card rounded-2xl p-6 text-center">
                <div className="font-display text-3xl text-brand-600 mb-1">{stat.value}</div>
                <div className="text-xs text-surface-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display text-2xl text-surface-900 mb-4">Our Mission</h3>
                <p className="text-surface-600 leading-relaxed mb-4">
                  The XYZT to 123456 now ecosystem is fragmented. Advertisers struggle to reach the right audience, and users waste hours searching across dozens of disconnected platforms.
                </p>
                <p className="text-surface-600 leading-relaxed">
                  XYZT Ad Consolidator solves this by being the single source of truth — a curated, searchable, and community-moderated hub where quality ads meet qualified buyers.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {values.map(v => (
                  <div key={v.title} className="bg-surface-50 rounded-2xl p-5">
                    <div className="text-2xl mb-2">{v.icon}</div>
                    <h4 className="text-sm font-semibold text-surface-800 mb-1">{v.title}</h4>
                    <p className="text-xs text-surface-500 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h3 className="font-display text-3xl text-center text-surface-900 mb-12">Our Journey</h3>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-surface-200 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1 glass-card rounded-2xl p-6 max-w-md">
                    <span className="text-xs font-mono text-brand-600 font-semibold">{m.year}</span>
                    <h4 className="font-display text-lg text-surface-900 mt-1 mb-2">{m.title}</h4>
                    <p className="text-sm text-surface-500">{m.desc}</p>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-brand-500 border-4 border-white shadow-md z-10 hidden md:block" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-surface-50 border-y border-surface-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h3 className="font-display text-3xl text-center text-surface-900 mb-12">Meet the team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map(member => (
                <div key={member.name} className="glass-card rounded-2xl p-6 text-center hover-lift">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-300 to-brand-600 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <h4 className="font-display text-base text-surface-900">{member.name}</h4>
                  <p className="text-xs text-brand-600 font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-surface-500 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-900 to-surface-950 p-12 md:p-16 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 bg-brand-500 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-60 h-60 bg-brand-400 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
                Want to join us?
              </h2>
              <p className="text-surface-300 text-lg mb-8 max-w-xl mx-auto">
                We're always looking for talented people who want to reshape how XYZT advertising works.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/contact" className="px-8 py-3 bg-gradient-to-r from-brand-500 to-brand-400 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:from-brand-600 hover:to-brand-500 active:scale-[0.98] transition-all duration-200">
                  Join the team
                </Link>
                <Link href="/pricing" className="px-8 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-200">
                  View plans
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
