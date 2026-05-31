import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function DMCA() {
  return (
    <>
      <Head>
        <title>DMCA Policy | XYZT Ad Consolidator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <h1 className="font-display text-4xl md:text-5xl text-surface-900 mb-4">DMCA Policy</h1>
          <p className="text-surface-500 text-sm mb-12">Last updated: May 31, 2026</p>

          <div className="prose-content space-y-8">
            <section>
              <h2>Reporting Copyright Infringement</h2>
              <p>If you believe content on XYZT Ad Consolidator infringes your copyright, please submit a DMCA takedown notice to our designated agent.</p>
            </section>

            <section>
              <h2>How to Submit a Takedown Notice</h2>
              <p>Send your notice to <strong>dmca@xyzadconsolidator.com</strong> with the following:</p>
              <ul>
                <li>A physical or electronic signature of the copyright owner or authorized agent</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the infringing material and its URL on our Service</li>
                <li>Your contact information (name, address, phone, email)</li>
                <li>A statement of good faith belief that the use is unauthorized</li>
                <li>A statement under penalty of perjury that the information is accurate</li>
              </ul>
            </section>

            <section>
              <h2>Counter-Notices</h2>
              <p>If you believe your content was removed by mistake, you may submit a counter-notice. We will restore the content within 10-14 business days unless we receive a court order.</p>
            </section>

            <section>
              <h2>Repeat Infringers</h2>
              <p>We will terminate accounts of users who repeatedly infringe on copyrights.</p>
            </section>

            <section>
              <h2>Contact</h2>
              <p>DMCA Agent: DMCA Coordinator<br />
              Email: <Link href="mailto:dmca@xyzadconsolidator.com" className="text-brand-600 hover:text-brand-700">dmca@xyzadconsolidator.com</Link></p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
