import { SignIn } from '@clerk/nextjs';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const IS_DEV = (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '').startsWith('pk_test_');
const TEST_EMAIL = 'test@test.com';

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign In | XYZT Ad Consolidator</title>
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
                <p className="text-xs text-surface-600 mb-2">
                  Use <strong>{TEST_EMAIL}</strong> to sign in.
                </p>
                <div className="flex items-start gap-1.5 mb-2">
                  <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-amber-600">
                    Clerk sends a verification email. Open it on <strong>this same browser</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[name=identifier]');
                    if (input) {
                      input.value = TEST_EMAIL;
                      input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 bg-white px-3 py-1.5 rounded-lg border border-brand-200"
                >
                  Pre-fill test email
                </button>
              </div>
            )}

            <div className="text-center mb-8">
              <h1 className="font-display text-3xl text-surface-900 mb-2">Welcome back</h1>
              <p className="text-surface-500 text-sm">Sign in to your XYZT Ad Consolidator account</p>
            </div>
            <SignIn
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
              Don't have an account? <a href="/sign-up" className="text-brand-600 hover:text-brand-700 font-medium">Create one</a>
            </p>
            <p className="text-center mt-3">
              <span className="text-xs text-surface-400">
                Forgot password? Reset using the link on the sign-in form.
              </span>
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
