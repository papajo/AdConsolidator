import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | XYZT Ad Consolidator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <h1 className="font-display text-4xl md:text-5xl text-surface-900 mb-4">Privacy Policy</h1>
          <p className="text-surface-500 text-sm mb-12">Last updated: May 31, 2026</p>

          <div className="prose-content space-y-8">
            <section>
              <h2>1. Information We Collect</h2>
              <ul>
                <li><strong>Account info:</strong> Name, email address, and password when you register</li>
                <li><strong>Usage data:</strong> Pages visited, search queries, clicks, and time spent</li>
                <li><strong>Device info:</strong> Browser type, IP address, and device identifiers</li>
                <li><strong>Submitted content:</strong> Ad listings, reviews, and messages you post</li>
              </ul>
            </section>

            <section>
              <h2>2. How We Use Your Information</h2>
              <ul>
                <li>To provide and improve the Service</li>
                <li>To personalize your experience and search results</li>
                <li>To send email alerts and notifications (with your consent)</li>
                <li>To prevent fraud and enforce our Terms</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2>3. Cookies</h2>
              <p>We use cookies and similar technologies to enhance your experience. See our <Link href="/legal/cookies" className="text-brand-600 hover:text-brand-700">Cookie Policy</Link> for details.</p>
            </section>

            <section>
              <h2>4. Data Sharing</h2>
              <p>We do not sell your personal data. We may share information with:</p>
              <ul>
                <li>Service providers hosting our infrastructure (Supabase, Vercel, Railway)</li>
                <li>Analytics tools (aggregated, de-identified data only)</li>
                <li>Law enforcement when legally required</li>
              </ul>
            </section>

            <section>
              <h2>5. Data Retention</h2>
              <p>Your data is retained as long as your account is active or as needed to provide the Service. You may request deletion of your account and data at any time by contacting us.</p>
            </section>

            <section>
              <h2>6. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have rights to access, correct, delete, or port your data. Contact us to exercise these rights.</p>
            </section>

            <section>
              <h2>7. Children's Privacy</h2>
              <p>Our Service is not directed to individuals under 13. We do not knowingly collect information from children.</p>
            </section>

            <section>
              <h2>8. Changes</h2>
              <p>We may update this policy periodically. We will notify users of significant changes via email or a notice on the Service.</p>
            </section>

            <section>
              <h2>9. Contact</h2>
              <p>For privacy-related inquiries, please <Link href="/contact" className="text-brand-600 hover:text-brand-700">contact us</Link>.</p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
