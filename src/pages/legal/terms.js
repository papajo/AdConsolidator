import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service | XYZT Ad Consolidator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <h1 className="font-display text-4xl md:text-5xl text-surface-900 mb-4">Terms of Service</h1>
          <p className="text-surface-500 text-sm mb-12">Last updated: May 31, 2026</p>

          <div className="prose-content space-y-8">
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing or using XYZT Ad Consolidator ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.</p>
            </section>

            <section>
              <h2>2. Description of Service</h2>
              <p>XYZT Ad Consolidator aggregates and displays XYZT-related advertisements from various sources for the 123456 audience. We do not guarantee the accuracy, completeness, or reliability of any advertisement content displayed on the platform.</p>
            </section>

            <section>
              <h2>3. User Accounts</h2>
              <p>To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            </section>

            <section>
              <h2>4. Content Guidelines</h2>
              <p>Users who submit ads agree to the following:</p>
              <ul>
                <li>No false, misleading, or deceptive content</li>
                <li>No content that infringes on intellectual property rights</li>
                <li>No illegal products or services</li>
                <li>No spam, malware, or harmful content</li>
                <li>No content that harasses, defames, or discriminates</li>
              </ul>
              <p>We reserve the right to remove any content that violates these guidelines without notice.</p>
            </section>

            <section>
              <h2>5. Privacy</h2>
              <p>Your use of the Service is governed by our <Link href="/legal/privacy" className="text-brand-600 hover:text-brand-700">Privacy Policy</Link>.</p>
            </section>

            <section>
              <h2>6. Intellectual Property</h2>
              <p>All content, trademarks, and logos displayed on the Service are the property of their respective owners. You may not copy, modify, distribute, or exploit any content without express written permission.</p>
            </section>

            <section>
              <h2>7. Limitation of Liability</h2>
              <p>XYZT Ad Consolidator is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</p>
            </section>

            <section>
              <h2>8. Modifications</h2>
              <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
            </section>

            <section>
              <h2>9. Contact</h2>
              <p>For questions about these Terms, please <Link href="/contact" className="text-brand-600 hover:text-brand-700">contact us</Link>.</p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
