import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-surface-200/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-bold text-xs font-mono">XY</span>
              </div>
              <span className="font-display text-lg text-surface-900">XYZT</span>
            </div>
            <p className="text-sm text-surface-500 leading-relaxed">
              The premier platform for discovering and publishing XYZT-related advertisements to the 123456 audience.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-surface-800 text-sm mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">Browse Ads</Link></li>
              <li><Link href="/pricing" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">Pricing</Link></li>
              <li><span className="text-sm text-surface-500 hover:text-brand-600 transition-colors cursor-pointer">Submit Ad</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-surface-800 text-sm mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">About</Link></li>
              <li><span className="text-sm text-surface-500 hover:text-brand-600 transition-colors cursor-pointer">Blog</span></li>
              <li><span className="text-sm text-surface-500 hover:text-brand-600 transition-colors cursor-pointer">Careers</span></li>
              <li><Link href="/contact" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-surface-800 text-sm mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/legal/terms" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/dmca" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">DMCA Requests</Link></li>
              <li><Link href="/legal/cookies" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-200 mt-8 pt-8 text-center">
          <p className="text-xs text-surface-400">© 2026 XYZT Ad Consolidator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
