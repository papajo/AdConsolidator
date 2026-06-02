import { SignUp } from '@clerk/nextjs';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const IS_DEV = (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '').startsWith('pk_test_');
const TEST_EMAIL = 'test@test.com';

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Create Account | XYZT Ad Consolidator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            {IS_DEV && (
              <div className="glass-card rounded-2xl p-4 mb-6 border border-brand-200 bg-brand-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-surface-700 uppercase tracking-wider">Development Mode</span>
                </div>
                <p className="text-xs text-surface-600">
                  Use <strong>{TEST_EMAIL}</strong> to quickly create a test account.
                </p>
                <div className="mt-2 flex items-start gap-1.5">
                  <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-amber-600">
                    Clerk will send a <strong>verification email</strong>. Open it on <strong>this same browser</strong> to complete sign-up.
                  </p>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h1 className="font-display text-3xl text-surface-900 mb-2">Create your account</h1>
              <p className="text-surface-500 text-sm">Join XYZT Ad Consolidator today</p>
            </div>
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary: 'btn-primary',
                  card: 'glass-card rounded-3xl',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'bg-surface-50 border border-surface-200 text-surface-800 text-sm font-medium rounded-xl hover:bg-surface-100 transition-colors',
                  formFieldInput: 'input-field',
                  footerActionLink: 'text-brand-600 hover:text-brand-700 font-medium',
                },
              }}
              redirectUrl="/"
            />
            <p className="text-center text-sm text-surface-500 mt-6">
              Already have an account? <a href="/sign-in" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</a>
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
