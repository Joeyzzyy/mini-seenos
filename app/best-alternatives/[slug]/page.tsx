import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LISTICLE_PAGES, getListiclePageBySlug, BRAND_INFO, ListicleProduct } from '../data';

// Generate static paths for all listicle pages
export function generateStaticParams() {
  return LISTICLE_PAGES.map((page) => ({
    slug: page.slug,
  }));
}

// Generate metadata for each page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getListiclePageBySlug(slug);
  
  if (!page) {
    return { title: 'Not Found' };
  }
  
  return {
    title: page.title,
    description: page.metaDescription,
    keywords: [`${page.targetProduct} alternatives`, `best ${page.targetProduct} alternatives`, 'software comparison', page.targetProduct],
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `https://seopages.pro/best-alternatives/${slug}`,
      type: 'article',
      images: [
        {
          url: 'https://seopages.pro/new-logo.png',
          width: 512,
          height: 512,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.metaDescription,
      images: ['https://seopages.pro/new-logo.png'],
    },
    alternates: {
      canonical: `https://seopages.pro/best-alternatives/${slug}`,
    },
  };
}

// Favicon helper
function getFaviconUrl(domain: string, size: number = 64): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

// Product card component
function ProductCard({ product, isTop }: { product: ListicleProduct; isTop?: boolean }) {
  const logoSrc = product.logoUrl || getFaviconUrl(product.website, 128);
  
  return (
    <div 
      id={`product-${product.rank}`}
      className={`bg-white rounded-2xl border ${isTop ? 'border-2 border-[#9A8FEA] shadow-lg shadow-[#9A8FEA]/10' : 'border-gray-200 shadow-md'} p-6 md:p-8 transition-all hover:shadow-lg scroll-mt-32`}
    >
      {/* Header with rank and badges */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isTop ? 'bg-[#9A8FEA] text-white' : 'bg-gray-100 text-gray-700'}`}>
            {product.rank}
          </div>
          <div className="w-16 h-16 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={logoSrc}
              alt={product.name}
              className="w-12 h-12 object-contain"
            />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.tagline}</p>
          </div>
        </div>
        {product.isWinner && (
          <span className="px-3 py-1 bg-[#9A8FEA] text-white text-xs font-semibold rounded-full">
            🏆 Top Pick
          </span>
        )}
      </div>
      
      {/* Rating and pricing row */}
      <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <StarRating rating={product.rating} />
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">{product.pricing}</span>
          {product.pricingNote && (
            <span className="text-xs text-[#9A8FEA] bg-[#9A8FEA]/10 px-2 py-0.5 rounded">{product.pricingNote}</span>
          )}
        </div>
        {product.hasFreeplan && (
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">✓ Free tier</span>
        )}
      </div>
      
      {/* Description */}
      <p className="text-gray-700 mb-6 leading-relaxed">
        {product.description}
      </p>
      
      {/* Key Features */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Key Features</h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {product.keyFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#9A8FEA] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pros and Cons */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50/50 rounded-xl p-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Pros
          </h4>
          <ul className="space-y-1.5">
            {product.pros.map((pro, idx) => (
              <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                <span className="text-green-500">+</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50/50 rounded-xl p-4">
          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
            Cons
          </h4>
          <ul className="space-y-1.5">
            {product.cons.map((con, idx) => (
              <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                <span className="text-red-500">−</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Best For */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-[#9A8FEA] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <div>
          <span className="text-sm font-semibold text-gray-900">Best For: </span>
          <span className="text-sm text-gray-700">{product.bestFor}</span>
        </div>
      </div>
      
      {/* CTA */}
      <div className="mt-6 flex items-center gap-3">
        {product.isWinner ? (
          <Link
            href={BRAND_INFO.ctaUrl}
            className="flex-1 text-center px-6 py-3 bg-[#9A8FEA] text-white font-semibold rounded-xl hover:bg-[#8a7fda] transition-colors"
          >
            Try {product.name} Free →
          </Link>
        ) : (
          <a
            href={`https://${product.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Visit {product.name} →
          </a>
        )}
      </div>
    </div>
  );
}

export default async function ListicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getListiclePageBySlug(slug);
  
  if (!page) {
    notFound();
  }

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": page.title,
            "description": page.metaDescription,
            "articleSection": "Software Reviews",
            "datePublished": "2026-01-23",
            "dateModified": "2026-01-23",
            "author": {
              "@type": "Organization",
              "name": "SEOPages.pro Editorial Team",
              "url": "https://seopages.pro"
            },
            "publisher": {
              "@type": "Organization",
              "name": "SEOPages.pro",
              "logo": {
                "@type": "ImageObject",
                "url": "https://seopages.pro/new-logo.png"
              }
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": page.title,
            "numberOfItems": page.products.length,
            "itemListElement": page.products.map((product, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "item": {
                "@type": "SoftwareApplication",
                "name": product.name,
                "applicationCategory": "BusinessApplication",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": product.rating,
                  "bestRating": 5,
                  "worstRating": 1,
                },
              },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": page.faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
            })),
          }),
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <img src={BRAND_INFO.logoUrl} alt={BRAND_INFO.name} className="h-8 w-auto" />
                <span className="text-lg italic font-serif hidden sm:block">
                  seopages<span className="text-[#9A8FEA]">.</span>pro
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/best-alternatives" className="text-sm text-gray-600 hover:text-gray-900">All Guides</Link>
                <Link href="/seopages-pro-alternatives" className="text-sm text-gray-600 hover:text-gray-900">Comparisons</Link>
                <Link href={BRAND_INFO.ctaUrl} className="px-4 py-2 bg-[#9A8FEA] text-white text-sm font-semibold rounded-lg hover:bg-[#8a7fda] transition-colors">
                  Get Started
                </Link>
              </nav>
            </div>
          </div>
        </header>
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 pt-8 md:pt-16 pb-8 md:pb-12 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/best-alternatives" className="hover:text-gray-900">Best Alternatives</Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-700">{page.targetProduct}</span>
            </nav>
            
            {/* Title */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center">
                <img
                  src={getFaviconUrl(page.targetWebsite, 48)}
                  alt={page.targetProduct}
                  className="w-10 h-10"
                />
              </div>
              <div>
                <span className="text-sm text-[#9A8FEA] font-medium">Updated January 2026</span>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  {page.title}
                </h1>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              {page.heroDescription}
            </p>
            
            {/* Author info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#9A8FEA] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span>By <strong className="text-gray-700">SEOPages.pro Team</strong></span>
              </div>
              <span>•</span>
              <span>{page.products.length} alternatives reviewed</span>
              <span>•</span>
              <span>10 min read</span>
            </div>
            
            {/* Quick Jump TOC */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#9A8FEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Quick Jump
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {page.products.map((product) => (
                  <a
                    key={product.rank}
                    href={`#product-${product.rank}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${product.rank === 1 ? 'bg-[#9A8FEA] text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {product.rank}
                    </span>
                    <span className="text-sm text-gray-700 group-hover:text-[#9A8FEA] truncate">{product.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <main className="py-8 md:py-12 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Products List */}
            <div className="space-y-6 md:space-y-8">
              {page.products.map((product, idx) => (
                <ProductCard key={product.slug} product={product} isTop={idx === 0} />
              ))}
            </div>
            
            {/* Comparison Table */}
            <section className="mt-12 md:mt-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Quick Comparison Table
              </h2>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">Tool</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-900 text-sm">Rating</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-900 text-sm">Pricing</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-900 text-sm">Free Tier</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-900 text-sm">Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      {page.products.map((product, idx) => (
                        <tr key={product.slug} className={`border-b border-gray-100 ${idx === 0 ? 'bg-[#9A8FEA]/5' : ''}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-[#9A8FEA] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                {product.rank}
                              </span>
                              <img 
                                src={product.logoUrl || getFaviconUrl(product.website, 32)} 
                                alt={product.name}
                                className="w-6 h-6 rounded"
                              />
                              <span className="font-medium text-gray-900 text-sm">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-sm text-gray-700">{product.rating}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-700">{product.pricing}</td>
                          <td className="px-4 py-3 text-center">
                            {product.hasFreeplan ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600 max-w-[200px] truncate">{product.bestFor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
            
            {/* FAQ Section */}
            <section className="mt-12 md:mt-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {page.faqs.map((faq, idx) => (
                  <details key={idx} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <summary className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer list-none">
                      <span className="font-semibold text-gray-900">{faq.question}</span>
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
            
            {/* Final CTA */}
            <section className="mt-12 md:mt-16 bg-gradient-to-r from-[#9A8FEA] to-[#65B4FF] rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Create Your Own Comparison Pages
              </h2>
              <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                Want to create professional alternative pages like this for your product? 
                SEOPages.pro generates conversion-optimized comparison content in minutes.
              </p>
              <Link
                href={BRAND_INFO.ctaUrl}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#9A8FEA] font-semibold rounded-xl hover:bg-gray-100 transition-colors text-lg"
              >
                {BRAND_INFO.ctaText}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </section>
            
            {/* Methodology Note */}
            <div className="mt-8 p-4 bg-gray-100 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-gray-600">
                  <strong className="text-gray-700">Research Methodology:</strong> We personally test each tool and verify pricing from official websites. 
                  Ratings are based on features, ease of use, value for money, and real-world performance. 
                  Last updated: January 2026.
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img src={BRAND_INFO.logoUrl} alt={BRAND_INFO.name} className="h-8 w-auto invert" />
                  <span className="text-white italic font-serif">
                    seopages<span className="text-[#9A8FEA]">.</span>pro
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  AI-powered alternative page generator for SEO professionals.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="hover:text-white">Home</Link></li>
                  <li><Link href="/#features" className="hover:text-white">Features</Link></li>
                  <li><Link href="/#pricing" className="hover:text-white">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/best-alternatives" className="hover:text-white">Best Alternatives</Link></li>
                  <li><Link href="/seopages-pro-alternatives" className="hover:text-white">Comparisons</Link></li>
                  <li><Link href="/alternative-page-guide" className="hover:text-white">Guide</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-800 text-center text-sm">
              <p>© 2026 {BRAND_INFO.name}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
