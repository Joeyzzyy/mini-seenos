import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { COMPETITORS, getCategories, getFaviconUrl, BRAND } from './data';

export const metadata: Metadata = {
  title: 'SEOPages.pro Alternatives & Comparisons | vs 38 SEO Tools',
  description: 'Compare SEOPages.pro against 38 popular SEO tools, AI writers, and landing page builders. Find out why SEOPages.pro is the best choice for alternative page generation.',
  keywords: ['SEOPages.pro alternatives', 'SEO tool comparison', 'AI content tool comparison', 'alternative page generator'],
  openGraph: {
    title: 'SEOPages.pro vs 38 SEO Tools - Complete Comparison Hub',
    description: 'Compare SEOPages.pro against Jasper, Surfer SEO, Ahrefs, Unbounce, and 34 more tools. See why we\'re the best for alternative pages.',
    url: 'https://seopages.pro/seopages-pro-alternatives',
    type: 'website',
    images: [
      {
        url: 'https://seopages.pro/new-logo.png',
        width: 512,
        height: 512,
        alt: 'SEOPages.pro Alternative Comparisons',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEOPages.pro vs 38 SEO Tools - Complete Comparison Hub',
    description: 'Compare SEOPages.pro against Jasper, Surfer SEO, Ahrefs, Unbounce, and 34 more tools.',
    images: ['https://seopages.pro/new-logo.png'],
  },
  alternates: {
    canonical: 'https://seopages.pro/seopages-pro-alternatives',
  },
};

export default function AlternativesHubPage() {
  const categories = getCategories();
  
  // Group competitors by category
  const groupedCompetitors = categories.map(category => ({
    category,
    competitors: COMPETITORS.filter(c => c.category === category),
  }));

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="text-sm text-gray-400">38 Detailed Comparisons</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#FFAF40] via-[#D194EC] to-[#65B4FF] bg-clip-text text-transparent">
              SEOPages.pro
            </span>
            <br />
            <span className="text-white">vs Every SEO Tool</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            See how SEOPages.pro compares against {COMPETITORS.length} popular SEO tools, AI writers, 
            and landing page builders. Spoiler: We&apos;re the only one focused on alternative pages.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/projects"
              className="px-6 py-3 bg-gradient-to-r from-[#FFAF40] via-[#9A8FEA] to-[#65B4FF] text-white font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              Try SEOPages.pro Free
            </Link>
            <a
              href="#comparisons"
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              View All Comparisons
            </a>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { stat: '38', label: 'Competitors Compared' },
              { stat: '9', label: 'Tool Categories' },
              { stat: '#1', label: 'For Alternative Pages' },
              { stat: '5x', label: 'Faster Than Manual' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-2xl font-bold bg-gradient-to-r from-[#9A8FEA] to-[#65B4FF] bg-clip-text text-transparent">
                  {item.stat}
                </div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why SEOPages.pro Section */}
      <section className="py-16 px-4 sm:px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Why SEOPages.pro Stands Out
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            While other tools try to do everything, we focus on one thing: generating the best alternative and comparison pages.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-[#9A8FEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Specialized Focus',
                description: 'We only do alternative pages. No bloat, no distractions - just the best comparison page generator.',
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-[#9A8FEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Pay Per Page',
                description: 'No monthly subscriptions draining your budget. Pay only for the pages you generate.',
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-[#9A8FEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
                title: 'Deploy-Ready HTML',
                description: 'Get production-ready HTML files. Upload to any hosting - the code is yours forever.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#9A8FEA]/50 transition-all">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* All Comparisons by Category */}
      <section id="comparisons" className="py-16 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            All Comparisons
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Click any comparison to see the full breakdown of features, pricing, pros & cons.
          </p>
          
          {groupedCompetitors.map(({ category, competitors }) => (
            <div key={category} className="mb-12">
              <h3 className="text-lg font-semibold text-[#9A8FEA] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9A8FEA]"></span>
                {category}
                <span className="text-sm text-gray-500 font-normal">({competitors.length})</span>
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {competitors.map((competitor) => (
                  <Link
                    key={competitor.slug}
                    href={`/seopages-pro-alternatives/${competitor.slug}`}
                    className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#9A8FEA]/50 hover:bg-white/[0.08] transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center -space-x-2">
                        <img
                          src={BRAND.logoUrl}
                          alt={BRAND.name}
                          className="w-8 h-8 rounded-lg border-2 border-[#0A0A0A] bg-white p-1"
                        />
                        <img
                          src={getFaviconUrl(competitor.website, 64)}
                          alt={competitor.name}
                          className="w-8 h-8 rounded-lg border-2 border-[#0A0A0A] bg-white"
                        />
                      </div>
                      <span className="text-xs text-gray-500">VS</span>
                    </div>
                    
                    <h4 className="font-semibold text-white group-hover:text-[#9A8FEA] transition-colors mb-1">
                      SEOPages.pro vs {competitor.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {competitor.tagline}
                    </p>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-600">{competitor.pricing || 'View pricing'}</span>
                      <svg className="w-4 h-4 text-gray-600 group-hover:text-[#9A8FEA] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Create Your Alternative Pages?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Stop reading comparisons. Start generating pages that rank and convert.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FFAF40] via-[#9A8FEA] to-[#65B4FF] text-white font-semibold rounded-xl hover:opacity-90 transition-all text-lg"
          >
            Generate Your First Page Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
      
      <SiteFooter />
    </div>
  );
}
