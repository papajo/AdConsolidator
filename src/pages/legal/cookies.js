import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Cookies() {
  return (
    <>
      <Head>
        <title>Cookie Policy | XYZT Ad Consolidator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <h1 className="font-display text-4xl md:text-5xl text-surface-900 mb-4">Cookie Policy</h1>
          <p className="text-surface-500 text-sm mb-12">Last updated: May 31, 2026</p>

          <div className="prose-content space-y-8">
            <section>
              <h2>What Are Cookies</h2>
              <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.</p>
            </section>

            <section>
              <h2>How We Use Cookies</h2>
              <div className="space-y-4">
                <div><strong>Essential cookies</strong> — Required for the Service to function (session management, CSRF protection). Cannot be disabled.</div>
                <div><strong>Analytics cookies</strong> — Help us understand how visitors use the site (anonymous). You can opt out.</div>
                <div><strong>Preference cookies</strong> — Remember your settings (theme, search filters).</div>
              </div>
            </section>

            <section>
              <h2>Third-Party Cookies</h2>
              <p>We may use third-party services (like Stripe for payments) that set their own cookies. These are governed by the respective third-party policies.</p>
            </section>

            <section>
              <h2>Managing Cookies</h2>
              <p>You can control cookies through your browser settings. Note that disabling essential cookies will break some features of the Service.</p>
            </section>

            <section>
              <h2>Updates</h2>
              <p>We may update this policy. Changes will be posted on this page with an updated date.</p>
            </section>

            <section>
              <h2>Contact</h2>
              <p>Questions? <Link href="/contact" className="text-brand-600 hover:text-brand-700">Contact us</Link>.</p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
