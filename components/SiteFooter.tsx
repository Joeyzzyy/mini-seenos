'use client';

import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-12 px-4 sm:px-6 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <img src="/new-logo.png" alt="seopages.pro" className="h-6 w-auto" />
            <span className="text-white text-sm italic" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              seopages<span className="text-[#9A8FEA]">.</span>pro
            </span>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/alternative-page-guide" className="hover:text-white transition-colors">Guide</Link>
            <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
        </div>
        
        {/* Legal & Contact Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <nav className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <span className="text-gray-700">|</span>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <span className="text-gray-700">|</span>
            <a href="mailto:wps_zy@126.com" className="hover:text-gray-300 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              wps_zy@126.com
            </a>
          </nav>
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} seopages.pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
