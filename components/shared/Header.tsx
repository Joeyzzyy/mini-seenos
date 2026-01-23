'use client';

import Link from 'next/link';

interface HeaderProps {
  theme?: 'light' | 'dark';
}

export default function Header({ theme = 'light' }: HeaderProps) {
  const isDark = theme === 'dark';
  
  return (
    <header className={`sticky top-0 z-50 ${isDark ? 'bg-[#0A0A0A]/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <img src="/new-logo.png" alt="SEOPages" className="h-8 sm:h-10 w-auto" />
          <span className={`text-lg sm:text-xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            SEOPages<span className={isDark ? 'text-gray-500' : 'text-gray-400'}>.</span>pro
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Comparisons Dropdown */}
          <div className="hidden sm:block relative group">
            <button className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors flex items-center gap-1`}>
              Comparisons
              <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className={`${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200 shadow-lg'} border rounded-xl p-2 min-w-[240px]`}>
                <Link href="/seopages-pro-alternatives" className={`block px-3 py-2 text-sm ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors font-medium`}>
                  All 54 Comparisons
                </Link>
                <div className={`border-t ${isDark ? 'border-white/5' : 'border-gray-100'} my-1`}></div>
                <Link href="/seopages-pro-alternatives/jasper-ai" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  vs Jasper AI
                </Link>
                <Link href="/seopages-pro-alternatives/surfer-seo" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  vs Surfer SEO
                </Link>
                <Link href="/seopages-pro-alternatives/ahrefs" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  vs Ahrefs
                </Link>
                <Link href="/seopages-pro-alternatives/semrush" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  vs SEMrush
                </Link>
              </div>
            </div>
          </div>

          {/* Listicles Dropdown */}
          <div className="hidden sm:block relative group">
            <button className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors flex items-center gap-1`}>
              Listicles
              <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className={`${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200 shadow-lg'} border rounded-xl p-2 min-w-[240px]`}>
                <Link href="/best-alternatives" className={`block px-3 py-2 text-sm ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors font-medium`}>
                  All 64 Listicles
                </Link>
                <div className={`border-t ${isDark ? 'border-white/5' : 'border-gray-100'} my-1`}></div>
                <Link href="/best-alternatives/jasper-ai" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  Jasper AI Alternatives
                </Link>
                <Link href="/best-alternatives/ahrefs" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  Ahrefs Alternatives
                </Link>
                <Link href="/best-alternatives/ai-seo-tools" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  Best AI SEO Tools
                </Link>
                <Link href="/best-alternatives/ai-writing-tools" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  Best AI Writing Tools
                </Link>
              </div>
            </div>
          </div>
          
          {/* Guide Dropdown */}
          <div className="hidden sm:block relative group">
            <button className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors flex items-center gap-1`}>
              Guide
              <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className={`${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200 shadow-lg'} border rounded-xl p-2 min-w-[280px]`}>
                <Link href="/alternative-page-guide" className={`block px-3 py-2 text-sm ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors font-medium`}>
                  Alternative Page Guide
                </Link>
                <div className={`border-t ${isDark ? 'border-white/5' : 'border-gray-100'} my-1`}></div>
                <Link href="/alternative-page-guide/what-are-alternative-pages" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  What Are Alternative Pages?
                </Link>
                <Link href="/alternative-page-guide/alternative-page-seo-best-practices" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  SEO Best Practices
                </Link>
                <Link href="/alternative-page-guide/alternative-page-vs-landing-page" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  Alternative vs Landing Page
                </Link>
                <Link href="/alternative-page-guide/how-to-write-alternative-page-copy" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  How to Write Copy
                </Link>
                <Link href="/alternative-page-guide/alternative-page-examples" className={`block px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-lg transition-colors`}>
                  Page Examples
                </Link>
              </div>
            </div>
          </div>
          
          <Link href="/#features" className={`hidden sm:block text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Features</Link>
          <Link href="/#pricing" className={`hidden sm:block text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Pricing</Link>
          
          {/* CTA Button */}
          <Link
            href="/projects"
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#FFAF40] via-[#9A8FEA] to-[#65B4FF] text-white text-xs sm:text-sm font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-1 sm:gap-2"
          >
            Get Started
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
