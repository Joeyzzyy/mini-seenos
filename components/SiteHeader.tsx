'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface SiteHeaderProps {
  variant?: 'default' | 'transparent';
}

export default function SiteHeader({ variant = 'default' }: SiteHeaderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${variant === 'transparent' ? 'bg-[#0A0A0A]/80' : 'bg-[#0A0A0A]/80'} backdrop-blur-xl border-b border-white/5`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <img src="/new-logo.png" alt="SEOPages" className="h-8 sm:h-10 w-auto" />
          <span className="text-white text-lg sm:text-xl font-medium tracking-tight">
            SEOPages<span className="text-gray-500">.</span>pro
          </span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Comparisons Mega Dropdown */}
          <div className="hidden lg:block relative group">
            <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 py-2">
              54 Comparisons
              <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="fixed left-0 right-0 top-[56px] pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-[#111111] border-b border-white/10 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">SEOPages.pro vs 54 Tools</h3>
                      <p className="text-gray-500 text-sm">1v1 comparison pages — all AI-generated</p>
                    </div>
                    <Link href="/seopages-pro-alternatives" className="text-sm text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                      View All 54
                    </Link>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { name: 'Jasper AI', slug: 'jasper-ai' },
                      { name: 'Surfer SEO', slug: 'surfer-seo' },
                      { name: 'Ahrefs', slug: 'ahrefs' },
                      { name: 'SEMrush', slug: 'semrush' },
                      { name: 'Copy.ai', slug: 'copy-ai' },
                      { name: 'Frase', slug: 'frase' },
                      { name: 'ChatGPT', slug: 'chatgpt' },
                      { name: 'Claude', slug: 'claude' },
                      { name: 'Clearscope', slug: 'clearscope' },
                      { name: 'MarketMuse', slug: 'marketmuse' },
                      { name: 'Writesonic', slug: 'writesonic' },
                      { name: 'Rytr', slug: 'rytr' },
                      { name: 'Moz Pro', slug: 'moz-pro' },
                      { name: 'Unbounce', slug: 'unbounce' },
                      { name: 'Webflow', slug: 'webflow' },
                      { name: 'Rank Math', slug: 'rank-math' },
                      { name: 'Yoast SEO', slug: 'yoast-seo' },
                      { name: 'Perplexity', slug: 'perplexity' },
                    ].map((item) => (
                      <Link
                        key={item.slug}
                        href={`/seopages-pro-alternatives/${item.slug}`}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group/item"
                      >
                        <img 
                          src={`https://www.google.com/s2/favicons?domain=${item.slug.replace(/-/g, '')}.com&sz=32`}
                          alt={item.name}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-gray-400 group-hover/item:text-white truncate">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Listicles Mega Dropdown */}
          <div className="hidden lg:block relative group">
            <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 py-2">
              64 Listicles
              <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="fixed left-0 right-0 top-[56px] pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-[#111111] border-b border-white/10 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">Best Alternatives Guides</h3>
                      <p className="text-gray-500 text-sm">Ranked listicle pages — all AI-generated</p>
                    </div>
                    <Link href="/best-alternatives" className="text-sm text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                      View All 64
                    </Link>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { name: 'Jasper AI Alternatives', slug: 'jasper-ai' },
                      { name: 'Surfer SEO Alternatives', slug: 'surfer-seo' },
                      { name: 'Ahrefs Alternatives', slug: 'ahrefs' },
                      { name: 'SEMrush Alternatives', slug: 'semrush' },
                      { name: 'ChatGPT Alternatives', slug: 'chatgpt' },
                      { name: 'Best AI SEO Tools', slug: 'ai-seo-tools' },
                      { name: 'Best AI Writing Tools', slug: 'ai-writing-tools' },
                      { name: 'Keyword Research Tools', slug: 'keyword-research-tools' },
                      { name: 'Rank Tracking Tools', slug: 'rank-tracking-tools' },
                      { name: 'Content Optimization', slug: 'content-optimization-tools' },
                      { name: 'Local SEO Tools', slug: 'local-seo-tools' },
                      { name: 'AI Chatbots', slug: 'ai-chatbots' },
                      { name: 'SEO Chrome Extensions', slug: 'seo-chrome-extensions' },
                      { name: 'SEO for Agencies', slug: 'seo-tools-agencies' },
                      { name: 'SEO for E-commerce', slug: 'seo-tools-ecommerce' },
                    ].map((item) => (
                      <Link
                        key={item.slug}
                        href={`/best-alternatives/${item.slug}`}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors group/item"
                      >
                        <span className="text-sm text-gray-400 group-hover/item:text-white">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Guide Link */}
          <Link href="/alternative-page-guide" className="hidden lg:block text-sm text-gray-400 hover:text-white transition-colors">Guide</Link>
          <Link href="/#features" className="hidden lg:block text-sm text-gray-400 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="hidden lg:block text-sm text-gray-400 hover:text-white transition-colors">
            Pricing
          </Link>
          
          {user ? (
            <Link
              href="/projects"
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#FFAF40] via-[#9A8FEA] to-[#65B4FF] text-white text-xs sm:text-sm font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-1 sm:gap-2"
            >
              <span className="hidden sm:inline">Go to</span> Workspace
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <Link
              href="/projects"
              className="px-3 sm:px-4 py-2 bg-white text-black text-xs sm:text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
