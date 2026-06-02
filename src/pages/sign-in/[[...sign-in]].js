import { SignIn } from '@clerk/nextjs';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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
