import { SignUp } from '@clerk/nextjs';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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
