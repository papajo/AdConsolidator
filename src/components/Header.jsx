import Link from "next/link";
import { useState } from "react";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200/50 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            onClick={closeMobileMenu}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:shadow-brand-500/30 transition-shadow">
              <span className="text-white font-bold text-xs font-mono">XY</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg text-surface-900 leading-none">
                XYZT Ad Consolidator
              </h1>
              <p className="text-[10px] text-surface-500 font-body leading-tight">
                xyzt → 123456
              </p>
            </div>
          </Link>

          {/* Nav + auth (desktop) */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-4 mr-5 pr-5 border-r border-surface-200">
              <Link
                href="/"
                className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors"
              >
                Browse
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/submit-ad"
                className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors"
              >
                Submit Ad
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {isSignedIn ? (
                <>
                  <Link
                    href="/me/ads"
                    className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors"
                  >
                    My Ads
                  </Link>
                  <span className="text-sm text-surface-400">
                    {user?.firstName || "User"}
                  </span>
                  <SignOutButton>
                    <button className="btn-secondary text-xs !py-1.5 !px-3">
                      Sign Out
                    </button>
                  </SignOutButton>
                </>
              ) : (
                <SignInButton mode="modal">
                  <button className="btn-primary text-xs !py-1.5 !px-4">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </nav>

          {/* Mobile: sign in / menu */}
          <div className="md:hidden flex items-center gap-2">
            {isSignedIn ? (
              <Link
                href="/me/ads"
                className="text-xs text-surface-600 hover:text-brand-600 transition-colors"
                onClick={closeMobileMenu}
              >
                My Ads
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="btn-primary text-xs !py-1.5 !px-3"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </button>
              </SignInButton>
            )}
            <button
              type="button"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-site-menu"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-lg p-1.5 transition-colors hover:bg-surface-100"
            >
              <svg
                className="w-5 h-5 text-surface-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-site-menu"
            className="border-t border-surface-200/60 py-3 md:hidden animate-fade-in"
          >
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 hover:text-brand-600"
                onClick={closeMobileMenu}
              >
                Browse
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 hover:text-brand-600"
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="rounded-lg px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 hover:text-brand-600"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link
                href="/submit-ad"
                className="rounded-lg px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 hover:text-brand-600"
                onClick={closeMobileMenu}
              >
                Submit Ad
              </Link>
              {isSignedIn && (
                <Link
                  href="/me/ads"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 hover:text-brand-600"
                  onClick={closeMobileMenu}
                >
                  My Ads
                </Link>
              )}
            </nav>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-surface-200 bg-white/70 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-surface-800">
                  {isSignedIn ? user?.firstName || "User" : "Guest"}
                </p>
                <p className="text-xs text-surface-500">
                  {isSignedIn ? "Signed in" : "Sign in to manage your ads"}
                </p>
              </div>

              {isSignedIn ? (
                <SignOutButton>
                  <button
                    className="btn-secondary text-xs !px-3 !py-1.5"
                    onClick={closeMobileMenu}
                  >
                    Sign Out
                  </button>
                </SignOutButton>
              ) : (
                <SignInButton mode="modal">
                  <button
                    className="btn-primary text-xs !px-3 !py-1.5"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
