import Link from 'next/link';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';

export default function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-surface-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:shadow-brand-500/30 transition-shadow">
              <span className="text-white font-bold text-xs font-mono">XY</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg text-surface-900 leading-none">XYZT Ad Consolidator</h1>
              <p className="text-[10px] text-surface-500 font-body leading-tight">xyzt → 123456</p>
            </div>
          </Link>

          {/* Nav + auth (desktop) */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-4 mr-5 pr-5 border-r border-surface-200">
              <Link href="/" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Browse</Link>
              <Link href="/pricing" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Pricing</Link>
              <Link href="/about" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">About</Link>
              <Link href="/submit-ad" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Submit Ad</Link>
            </div>
            <div className="flex items-center gap-3">
              {isSignedIn ? (
                <>
                  <Link href="/me/ads" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">My Ads</Link>
                  <span className="text-sm text-surface-400">{user?.firstName || 'User'}</span>
                  <SignOutButton>
                    <button className="btn-secondary text-xs !py-1.5 !px-3">Sign Out</button>
                  </SignOutButton>
                </>
              ) : (
                <SignInButton mode="modal">
                  <button className="btn-primary text-xs !py-1.5 !px-4">Sign In</button>
                </SignInButton>
              )}
            </div>
          </nav>

          {/* Mobile: sign in / menu */}
          <div className="md:hidden flex items-center gap-2">
            {isSignedIn ? (
              <Link href="/me/ads" className="text-xs text-surface-600 hover:text-brand-600 transition-colors">My Ads</Link>
            ) : (
              <SignInButton mode="modal">
                <button className="btn-primary text-xs !py-1.5 !px-3">Sign In</button>
              </SignInButton>
            )}
            <button className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors">
              <svg className="w-5 h-5 text-surface-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
