import { useState } from 'react';
import Link from 'next/link';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';

export default function Header({ onSearch, onCategoryChange, activeCategory }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { isSignedIn, user } = useUser();
  const categories = ['All', 'Products', 'Services', 'Events'];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-surface-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/20">
              <span className="text-white font-bold text-sm font-mono">XY</span>
            </div>
            <div>
              <h1 className="font-display text-xl text-surface-900 leading-none">XYZT Ad Consolidator</h1>
              <p className="text-xs text-surface-500 font-body">xyzt → 123456 now</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Browse</Link>
            <Link href="/pricing" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">About</Link>
            <Link href="/contact" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Contact</Link>
            <Link href="/submit-ad" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">Submit Ad</Link>
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <Link href="/me/ads" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">My Ads</Link>
                <span className="text-sm text-surface-600">{user?.firstName || 'User'}</span>
                <SignOutButton>
                  <button className="btn-secondary text-sm py-2 px-4">Sign Out</button>
                </SignOutButton>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="btn-primary text-sm py-2 px-4">Sign In</button>
              </SignInButton>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors">
            <svg className="w-5 h-5 text-surface-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div className="pb-4 pt-1">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search advertisements by keyword, location, or company..."
                className="input-field pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </form>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                ${activeCategory === cat
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
