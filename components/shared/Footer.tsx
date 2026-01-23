import Link from 'next/link';

interface FooterProps {
  theme?: 'light' | 'dark';
}

export default function Footer({ theme = 'light' }: FooterProps) {
  const isDark = theme === 'dark';
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`py-8 sm:py-12 px-4 sm:px-6 border-t ${isDark ? 'border-white/5 bg-[#0A0A0A]' : 'border-gray-200 bg-white'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9A8FEA] via-[#65B4FF] to-[#9A8FEA] rounded-full blur-sm opacity-50 animate-[glow_3s_ease-in-out_infinite]" />
              <img src="/new-logo.png" alt="SEOPages" className="relative h-6 sm:h-7 w-auto" />
            </div>
            <span className={`text-sm sm:text-base italic tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              seopages<span className="text-[#9A8FEA]">.</span>pro
            </span>
          </Link>
          <nav className={`flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <Link href="/" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}>Home</Link>
            <Link href="/alternative-page-guide" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}>Guide</Link>
            <Link href="/#features" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}>Features</Link>
            <Link href="/#pricing" className={`${isDark ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}>Pricing</Link>
          </nav>
        </div>
        
        {/* Legal & Contact Row */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
          <nav className={`flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            <Link href="/privacy" className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-700'} transition-colors`}>Privacy Policy</Link>
            <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>|</span>
            <Link href="/terms" className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-700'} transition-colors`}>Terms of Service</Link>
            <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>|</span>
            <a href="mailto:wps_zy@126.com" className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-700'} transition-colors flex items-center gap-1`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              wps_zy@126.com
            </a>
          </nav>
          <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            © {currentYear} seopages.pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
