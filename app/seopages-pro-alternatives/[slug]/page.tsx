import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COMPETITORS, getCompetitorBySlug, getFaviconUrl, BRAND, Competitor } from '../data';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

// Generate static paths for all competitors
export function generateStaticParams() {
  return COMPETITORS.map((competitor) => ({
    slug: competitor.slug,
  }));
}

// Generate metadata for each page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const competitor = getCompetitorBySlug(slug);
  
  if (!competitor) {
    return { title: 'Not Found' };
  }
  
  const title = `SEOPages.pro vs ${competitor.name}: Best Alternative Page Generator 2026`;
  const description = `Compare SEOPages.pro vs ${competitor.name}. See why SEOPages.pro is the best choice for generating high-converting alternative pages. Better AI, lower prices, specialized focus.`;
  
  return {
    title,
    description,
    keywords: [`${competitor.name} alternative`, `SEOPages.pro vs ${competitor.name}`, 'alternative page generator', competitor.category],
    openGraph: {
      title,
      description,
      url: `https://seopages.pro/seopages-pro-alternatives/${slug}`,
      type: 'article',
      images: [
        {
          url: 'https://seopages.pro/new-logo.png',
          width: 512,
          height: 512,
          alt: `SEOPages.pro vs ${competitor.name} Comparison`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://seopages.pro/new-logo.png'],
    },
    alternates: {
      canonical: `https://seopages.pro/seopages-pro-alternatives/${slug}`,
    },
  };
}

// Comparison data generator
function getComparisonFeatures(competitor: Competitor) {
  return [
    { 
      feature: 'Alternative Page Generation', 
      brandValue: 'Full automation',
      brandStatus: 'yes',
      competitorValue: competitor.category.includes('Landing') ? 'Generic pages' : 'Not available',
      competitorStatus: competitor.category.includes('Landing') ? 'partial' : 'no',
      description: 'Specialized templates for "X alternative" and "vs" pages' 
    },
    { 
      feature: 'AI-Powered Content', 
      brandValue: 'Claude Sonnet 4.5 + specialized prompts',
      brandStatus: 'yes',
      competitorValue: competitor.category.includes('AI') ? 'Yes' : 'Limited',
      competitorStatus: competitor.category.includes('AI') ? 'yes' : 'partial',
      description: 'AI content generation optimized for comparison pages' 
    },
    { 
      feature: 'SEO Optimization', 
      brandValue: 'SEO + GEO ready',
      brandStatus: 'yes',
      competitorValue: competitor.category.includes('SEO') ? 'Yes' : 'Basic',
      competitorStatus: competitor.category.includes('SEO') ? 'yes' : 'partial',
      description: 'On-page SEO, Schema markup, AI search optimization' 
    },
    { 
      feature: 'Deploy-Ready Output', 
      brandValue: 'Production HTML',
      brandStatus: 'yes',
      competitorValue: competitor.category.includes('Landing') ? 'Hosted pages' : 'Content only',
      competitorStatus: competitor.category.includes('Landing') ? 'partial' : 'no',
      description: 'Get standalone HTML files ready to deploy anywhere' 
    },
    { 
      feature: 'Pricing Model', 
      brandValue: 'One-time payment',
      brandStatus: 'yes',
      competitorValue: 'Monthly subscription',
      competitorStatus: 'partial',
      description: 'One-time payment from $9.9 - no recurring fees' 
    },
    { 
      feature: 'Conversion Optimization', 
      brandValue: 'Built-in CRO',
      brandStatus: 'yes',
      competitorValue: competitor.category.includes('Landing') ? 'A/B testing' : 'Limited',
      competitorStatus: competitor.category.includes('Landing') ? 'yes' : 'no',
      description: 'Templates optimized for lead generation' 
    },
    { 
      feature: 'Comparison Tables', 
      brandValue: 'Auto-generated',
      brandStatus: 'yes',
      competitorValue: 'Manual creation',
      competitorStatus: 'no',
      description: 'Automatic feature comparison table generation' 
    },
    { 
      feature: 'Schema Markup', 
      brandValue: 'FAQ + Article + Product',
      brandStatus: 'yes',
      competitorValue: competitor.category.includes('SEO') ? 'Yes' : 'Limited',
      competitorStatus: competitor.category.includes('SEO') ? 'yes' : 'partial',
      description: 'Rich snippets for better SERP visibility' 
    },
  ];
}

// Page component
export default async function CompetitorComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const competitor = getCompetitorBySlug(slug);
  
  if (!competitor) {
    notFound();
  }
  
  const features = getComparisonFeatures(competitor);
  const brandWins = features.filter(f => f.brandStatus === 'yes' && f.competitorStatus !== 'yes').length;
  const competitorWins = features.filter(f => f.competitorStatus === 'yes' && f.brandStatus !== 'yes').length;
  
  // FAQ data
  const faqItems = [
    {
      q: `Is ${BRAND.name} better than ${competitor.name} for alternative pages?`,
      a: `For creating "X alternative" and comparison pages specifically, yes. ${BRAND.name} is purpose-built for this use case with specialized templates, automatic comparison tables, and SEO optimization. ${competitor.name} is a ${competitor.category.toLowerCase()} tool with different primary focus.`,
    },
    {
      q: `How much does ${BRAND.name} cost compared to ${competitor.name}?`,
      a: `${BRAND.name} uses one-time pricing: Starter $9.9 (10 pages), Standard $19.9 (20 pages), or Pro $39.9 (50 pages). No monthly subscriptions - you keep the HTML forever. ${competitor.name} charges ${competitor.pricing || 'a monthly subscription'}, which adds up over time.`,
    },
    {
      q: `Can I migrate from ${competitor.name} to ${BRAND.name}?`,
      a: `Yes! ${BRAND.name} generates standalone HTML files that work anywhere. You don't need to cancel ${competitor.name} immediately - you can try ${BRAND.name} for your alternative pages while keeping other tools for different needs.`,
    },
    {
      q: `Does ${BRAND.name} offer a free trial?`,
      a: `${BRAND.name} offers affordable pricing starting at just $0.49 per page. Try our Starter plan with 10 pages for $4.9 and see the quality yourself.`,
    },
    {
      q: `What makes ${BRAND.name}'s alternative pages better?`,
      a: `${BRAND.name} pages are specifically designed for conversion, with proven templates including comparison tables, pros/cons sections, and strong CTAs. Pages are also optimized for both Google SEO and AI search engines like ChatGPT and Perplexity (GEO).`,
    },
    {
      q: `Which platform is easier to use for beginners?`,
      a: `${BRAND.name} is very beginner-friendly for alternative pages - just provide your brand info and competitor, and we generate everything. ${competitor.name} may have more features but a steeper learning curve for comparison content.`,
    },
  ];

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${BRAND.name} vs ${competitor.name}: Best Alternative Page Generator 2026`,
            "description": `Compare ${BRAND.name} vs ${competitor.name}. See why ${BRAND.name} is the best choice for generating high-converting alternative pages.`,
            "articleSection": "Product Comparison",
            "datePublished": "2026-01-21",
            "dateModified": "2026-01-21",
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
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://seopages.pro/seopages-pro-alternatives/${competitor.slug}`
            }
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `${BRAND.name} vs ${competitor.name} Comparison`,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": BRAND.name },
              { "@type": "ListItem", "position": 2, "name": competitor.name },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://seopages.pro" },
              { "@type": "ListItem", "position": 2, "name": "Alternatives", "item": "https://seopages.pro/seopages-pro-alternatives" },
              { "@type": "ListItem", "position": 3, "name": `vs ${competitor.name}` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": { "@type": "Answer", "text": item.a },
            })),
          }),
        }}
      />
      
      <div className="page-content-scope min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* CSS Variables & Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
          
          .page-content-scope {
            --brand-500: hsl(199, 89%, 48%);
            --brand-600: hsl(199, 89%, 43%);
            --brand-700: hsl(199, 89%, 36%);
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
            --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          }
          
          .font-serif { font-family: 'Playfair Display', Georgia, serif; }
          
          .btn-primary {
            background: var(--brand-500);
            color: white;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 8px;
            transition: all 0.2s ease;
            box-shadow: var(--shadow-md);
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .btn-primary:hover {
            background: var(--brand-600);
            box-shadow: var(--shadow-lg);
            transform: translateY(-1px);
          }
          
          .btn-secondary {
            background: white;
            color: #404040;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 8px;
            border: 1px solid #e5e5e5;
            transition: all 0.2s ease;
            box-shadow: var(--shadow-sm);
          }
          .btn-secondary:hover {
            border-color: #d4d4d4;
            box-shadow: var(--shadow-md);
          }
          
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: #f5f5f5;
            color: #525252;
          }
          .badge-winner {
            background: var(--brand-500);
            color: white;
          }
          
          .text-brand { color: var(--brand-500); }
          .status-yes { color: var(--brand-500); }
          .status-no { color: #a3a3a3; }
          .status-partial { color: #737373; }
          
          .toc-link {
            color: #525252;
            transition: all 0.2s;
          }
          .toc-link:hover {
            color: #171717;
            background-color: #f5f5f5;
          }
          
          .card {
            background: white;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            box-shadow: var(--shadow);
            transition: box-shadow 0.2s ease, transform 0.2s ease;
          }
          .card:hover {
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
          }
          
          .table-row-alt:nth-child(even) { background-color: #fafafa; }
          
          .faq-item .faq-content { display: none; }
          .faq-item.active .faq-content { display: block; }
          .faq-item.active .faq-icon { transform: rotate(180deg); }
          
          .scroll-top-btn {
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
          }
          .scroll-top-btn.visible {
            opacity: 1;
            pointer-events: auto;
          }
          
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
        
        {/* Header */}
        <Header theme="light" />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 md:pt-28 pb-16 md:pb-24 px-4 md:px-6 bg-white">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
          
          <div className="relative max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6 md:mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              <Link href="/seopages-pro-alternatives" className="hover:text-gray-900 transition-colors">Alternatives</Link>
              <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              <span className="text-gray-700 font-medium">vs {competitor.name}</span>
            </nav>
            
            {/* VS Logos */}
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-10">
              <div className="flex flex-col items-center">
                <img src={BRAND.logoUrl} alt={BRAND.name} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg object-contain bg-white p-2" />
                <span className="mt-2 text-sm font-semibold text-gray-900">{BRAND.name}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-gray-300">VS</span>
              </div>
              <div className="flex flex-col items-center">
                <img src={getFaviconUrl(competitor.website, 128)} alt={competitor.name} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg object-contain bg-white" />
                <span className="mt-2 text-sm font-semibold text-gray-700">{competitor.name}</span>
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
              <span className="text-brand">{BRAND.name}</span> vs {competitor.name}
            </h1>
            
            {/* Description */}
            <p className="text-center text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed">
              Compare {BRAND.name} and {competitor.name} for alternative page generation. 
              See why {BRAND.name} is the best choice for creating high-converting comparison pages in 2026.
            </p>
            
            {/* Author & Update Info - EEAT E01/T05 */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-500 mb-8 md:mb-10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <span>By <strong className="text-gray-700">SEOPages.pro Editorial Team</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>Updated: <time dateTime="2026-01-21">January 21, 2026</time></span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>8 min read</span>
              </div>
            </div>
            
            {/* CTA */}
            <div className="flex items-center justify-center gap-4">
              <Link href="/projects" className="btn-primary px-6 md:px-8 py-3 md:py-4 rounded-xl text-sm md:text-base">
                Try {BRAND.name} Free
              </Link>
              <a href="#comparison" className="btn-secondary px-6 md:px-8 py-3 md:py-4 rounded-xl text-sm md:text-base">
                See Comparison
              </a>
            </div>
          </div>
        </section>
        
        {/* Table of Contents */}
        <nav id="toc" className="sticky top-[73px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-2 px-2">
              <a href="#verdict" className="toc-link flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm whitespace-nowrap rounded-lg transition-all">Quick Verdict</a>
              <a href="#screenshots" className="toc-link flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm whitespace-nowrap rounded-lg transition-all">Screenshots</a>
              <a href="#comparison" className="toc-link flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm whitespace-nowrap rounded-lg transition-all">Features</a>
              <a href="#pricing" className="toc-link flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm whitespace-nowrap rounded-lg transition-all">Pricing</a>
              <a href="#pros-cons" className="toc-link flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm whitespace-nowrap rounded-lg transition-all">Pros &amp; Cons</a>
              <a href="#use-cases" className="toc-link flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm whitespace-nowrap rounded-lg transition-all">Use Cases</a>
              <a href="#faq" className="toc-link flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm whitespace-nowrap rounded-lg transition-all">FAQ</a>
              <a href="#cta" className="toc-link flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm whitespace-nowrap rounded-lg transition-all">Get Started</a>
            </div>
          </div>
        </nav>
        
        {/* Key Takeaways - GEO O01 Summary Box */}
        <div className="bg-white py-6 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Key Takeaways</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="inline-block w-5 h-5 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <span><strong>{BRAND.name}</strong> specializes in alternative page generation; {competitor.name} focuses on {competitor.category.toLowerCase()}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-5 h-5 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <span>One-time pricing ($9.9-$39.9) vs {competitor.pricing?.split(',')[0] || 'monthly subscription'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-5 h-5 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span>Deploy-ready HTML files you own forever vs hosted/content-only output</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-5 h-5 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                  <span>Built-in SEO + GEO optimization for AI search engines</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Quick Verdict Section */}
        <section id="verdict" className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <span className="badge mb-3 md:mb-4">TL;DR Summary</span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 md:mb-4">
                Quick Verdict
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                A 60-second summary to help you decide.
              </p>
            </div>
            
            {/* Winner Announcement */}
            <div className="bg-white rounded-2xl p-5 md:p-8 lg:p-10 mb-8 md:mb-12 shadow-lg">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs md:text-sm mb-3 md:mb-4">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Our Recommendation
                </div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                  {BRAND.name} Wins for Alternative Page Generation
                </h3>
                <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                  {BRAND.name} is the clear choice for creating high-converting alternative and comparison pages. 
                  {competitor.name} is strong in {competitor.category.toLowerCase()}, but lacks the specialized 
                  features for &quot;X alternative&quot; content.
                </p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white rounded-xl p-3 md:p-5 text-center shadow-md">
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{brandWins}</div>
                  <div className="text-xs md:text-sm text-gray-500">{BRAND.name} Wins</div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-5 text-center shadow-md">
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">$9.9</div>
                  <div className="text-xs md:text-sm text-gray-500">Starting Price (10 pages)</div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-5 text-center shadow-md">
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">5min</div>
                  <div className="text-xs md:text-sm text-gray-500">Avg. Generation Time</div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-5 text-center shadow-md">
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">100%</div>
                  <div className="text-xs md:text-sm text-gray-500">Own Your HTML</div>
                </div>
              </div>
            </div>
            
            {/* Side by Side Cards */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {/* Brand Card */}
              <div className="bg-white rounded-xl border-2 border-[var(--brand-500)] p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4 md:mb-5">
                  <img src={BRAND.logoUrl} alt={BRAND.name} className="w-11 h-11 rounded-xl shadow-sm object-contain bg-white p-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">{BRAND.name}</h3>
                    <span className="badge-winner text-xs">Winner</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {BRAND.keyFeatures.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 md:gap-3">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-brand mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-4">
                    <strong className="text-gray-900">Best for:</strong> Alternative pages, comparison content, competitor landing pages
                  </p>
                  <Link href="/projects" className="inline-flex items-center gap-2 text-brand font-semibold hover:opacity-80 transition-opacity">
                    Try {BRAND.name} Free
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Competitor Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4 md:mb-5">
                  <img src={getFaviconUrl(competitor.website, 128)} alt={competitor.name} className="w-11 h-11 rounded-xl shadow-sm object-contain bg-white" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">{competitor.name}</h3>
                    <p className="text-xs md:text-sm text-gray-500">{competitor.category}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {competitor.keyFeatures.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 md:gap-3">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-900">Best for:</strong> {competitor.tagline}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{competitor.pricing}</p>
                </div>
              </div>
            </div>
            
            {/* Bottom Line Summary */}
            <div className="mt-8 md:mt-12 p-5 md:p-8 rounded-2xl bg-white border border-gray-200 shadow-md">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">The Bottom Line</h4>
                  <p className="text-gray-700 leading-relaxed">
                    If you need to create &quot;X alternative&quot; or &quot;X vs Y&quot; comparison pages that rank and convert, 
                    {BRAND.name} is the superior choice over {competitor.name}. Our specialized focus, affordable one-time pricing, 
                    and deploy-ready HTML output make us the best option for this specific use case.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Methodology Disclosure - EEAT T06 Transparency */}
            <div className="mt-6 p-4 md:p-5 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <div className="text-xs text-gray-600">
                  <strong className="text-gray-700">Research Methodology:</strong> This comparison is based on publicly available information from official websites, 
                  pricing pages, and feature documentation as of January 2026. We regularly update our comparisons to ensure accuracy. 
                  <span className="text-gray-500 ml-1">SEOPages.pro is our own product - we&apos;ve aimed to present both platforms fairly, highlighting genuine strengths and limitations.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Interface Screenshots Section */}
        <section id="screenshots" className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <span className="badge mb-3 md:mb-4">Visual Comparison</span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 md:mb-4">
                Interface Comparison
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                See how the dashboards and workflows of {BRAND.name} and {competitor.name} compare visually.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Brand Screenshot */}
              <div className="group">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  {/* Browser Chrome */}
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                    </div>
                    <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 font-mono truncate">
                      seopages.pro
                    </div>
                  </div>
                  
                  {/* Screenshot */}
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    <img 
                      src={`https://api.screenshotmachine.com?key=7cec4c&url=https%3A%2F%2Fseopages.pro&dimension=1366x768&device=desktop&format=png&cacheLimit=86400&delay=2000`}
                      alt={`${BRAND.name} interface screenshot`}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <Link href="/projects" className="btn-primary px-4 py-2 rounded-lg text-sm">
                        Try {BRAND.name}
                        <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Caption */}
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-gray-900 mb-1">{BRAND.name}</h3>
                  <p className="text-sm text-gray-600">Clean, focused interface for alternative page generation.</p>
                </div>
              </div>
              
              {/* Competitor Screenshot */}
              <div className="group">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  {/* Browser Chrome */}
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                    </div>
                    <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 font-mono truncate">
                      {competitor.website}
                    </div>
                  </div>
                  
                  {/* Screenshot */}
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    <img 
                      src={`https://api.screenshotmachine.com?key=7cec4c&url=https%3A%2F%2F${competitor.website}&dimension=1366x768&device=desktop&format=png&cacheLimit=86400&delay=2000`}
                      alt={`${competitor.name} interface screenshot`}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                </div>
                
                {/* Caption */}
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-gray-700 mb-1">{competitor.name}</h3>
                  <p className="text-sm text-gray-500">{competitor.tagline}</p>
                </div>
              </div>
            </div>
            
            {/* Visual Differences Summary */}
            <div className="mt-8 md:mt-12 p-5 md:p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Design Philosophy</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {BRAND.name} features a streamlined, purpose-built interface for alternative page creation. 
                    {competitor.name}, as a {competitor.category.toLowerCase()} platform, has a broader feature set 
                    but may require more setup for comparison content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Feature Comparison Table */}
        <section id="comparison" className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <span className="badge mb-3 md:mb-4">Detailed Analysis</span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 md:mb-4">
                Feature-by-Feature Comparison
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                How {BRAND.name} and {competitor.name} compare across key capabilities.
              </p>
            </div>
            
            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md -mx-4 md:mx-0 bg-white">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 md:px-5 py-3 md:py-4 font-semibold text-gray-900 text-xs md:text-sm w-2/5">Feature</th>
                    <th className="text-center px-2 md:px-4 py-3 md:py-4 w-[30%]">
                      <div className="flex items-center justify-center gap-2">
                        <img src={BRAND.logoUrl} alt={BRAND.name} className="w-6 h-6 rounded object-contain bg-white" />
                        <span className="font-semibold text-gray-900 text-xs md:text-sm">{BRAND.name}</span>
                      </div>
                    </th>
                    <th className="text-center px-2 md:px-4 py-3 md:py-4 w-[30%]">
                      <div className="flex items-center justify-center gap-2">
                        <img src={getFaviconUrl(competitor.website, 64)} alt={competitor.name} className="w-6 h-6 rounded object-contain bg-white" />
                        <span className="font-semibold text-gray-600 text-xs md:text-sm">{competitor.name}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((row, idx) => (
                    <tr key={idx} className="table-row-alt border-b border-gray-100">
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <div className="font-medium text-gray-900 text-xs md:text-sm">{row.feature}</div>
                        <div className="text-xs text-gray-500 mt-0.5 hidden md:block">{row.description}</div>
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          row.brandStatus === 'yes' ? 'bg-gray-100 text-gray-900' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {row.brandStatus === 'yes' && (
                            <svg className="w-3 h-3 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                          {row.brandValue}
                        </span>
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          row.competitorStatus === 'yes' ? 'bg-gray-100 text-gray-700' : 
                          row.competitorStatus === 'partial' ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {row.competitorStatus === 'yes' && (
                            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                          {row.competitorValue}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Feature Summary Cards */}
            <div className="mt-6 md:mt-8 grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 md:p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                  <img src={BRAND.logoUrl} alt={BRAND.name} className="w-6 h-6 rounded object-contain bg-white" />
                  {BRAND.name} Advantages
                </h4>
                <ul className="space-y-1.5 text-xs md:text-sm text-gray-700">
                  {features.filter(f => f.brandStatus === 'yes' && f.competitorStatus !== 'yes').slice(0, 4).map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>{f.feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 md:p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                  <img src={getFaviconUrl(competitor.website, 64)} alt={competitor.name} className="w-6 h-6 rounded object-contain bg-white" />
                  {competitor.name} Advantages
                </h4>
                <ul className="space-y-1.5 text-xs md:text-sm text-gray-600">
                  {competitor.keyFeatures.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Comparison Section */}
        <section id="pricing" className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <span className="badge mb-3 md:mb-4">Value Analysis</span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 md:mb-4">
                Pricing Comparison
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                Understanding the cost and value each platform offers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Brand Pricing */}
              <div className="bg-gray-50 rounded-2xl p-5 md:p-6 shadow-md">
                <div className="flex items-center gap-3 mb-5">
                  <img src={BRAND.logoUrl} alt={BRAND.name} className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm p-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{BRAND.name}</h3>
                    <p className="text-xs text-gray-500">One-time payment, no subscription</p>
                  </div>
                  <span className="px-2 py-1 bg-[var(--brand-500)] text-white text-xs font-semibold rounded">Best Value</span>
                </div>
                
                <div className="space-y-4">
                  {/* Standard Plan - Most Popular */}
                  <div className="bg-white rounded-xl border-2 border-[var(--brand-500)] shadow-md p-4 md:p-5 relative">
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[var(--brand-500)] text-white text-xs font-semibold rounded-full">Most Popular</span>
                    <div className="text-center mb-4">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Standard</h4>
                      <div className="text-xl md:text-2xl font-bold text-gray-900 mt-1">$19.9<span className="text-lg text-gray-500"> one-time</span></div>
                      <p className="text-xs text-gray-500 mt-1">20 Alternative Pages</p>
                    </div>
                    <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>Deploy-ready HTML output</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>SEO + GEO optimization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>Own your code forever</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>Priority Support</span>
                      </li>
                    </ul>
                  </div>
                  {/* Other Plans */}
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                      <div className="text-sm font-semibold text-gray-700">Starter</div>
                      <div className="text-lg font-bold text-gray-900">$9.9</div>
                      <div className="text-xs text-gray-500">10 pages</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                      <div className="text-sm font-semibold text-gray-700">Pro</div>
                      <div className="text-lg font-bold text-gray-900">$39.9</div>
                      <div className="text-xs text-gray-500">50 pages</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Competitor Pricing */}
              <div className="bg-gray-50 rounded-2xl p-5 md:p-6 shadow-md">
                <div className="flex items-center gap-3 mb-5">
                  <img src={getFaviconUrl(competitor.website, 128)} alt={competitor.name} className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{competitor.name}</h3>
                    <p className="text-xs text-gray-500">Monthly subscription model</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base mb-3">Pricing Plans</h4>
                      <div className="space-y-2">
                        {(competitor.pricing || 'Contact for pricing').split(', ').map((plan, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{plan.split(' ')[0]}</span>
                            <span className="font-semibold text-gray-900">{plan.split(' ').slice(1).join(' ')}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-3">Recurring monthly/annual subscription</p>
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">Key Features:</p>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        {competitor.keyFeatures.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Value Summary */}
            <div className="mt-6 md:mt-8 p-5 md:p-6 bg-gray-50 rounded-xl shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Value Analysis</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {BRAND.name}&apos;s one-time pricing ($9.9-$39.9) means no recurring fees draining your budget. 
                    {competitor.name}&apos;s {competitor.pricing || 'subscription'} can add up quickly over months, 
                    while you pay once for {BRAND.name} and own the HTML forever.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Data Source Citation - EEAT R01/A01 */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                Pricing data sourced from{' '}
                <a 
                  href={`https://${competitor.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline hover:text-gray-700"
                >
                  {competitor.website}
                </a>
                {' '}official pricing page (January 2026)
              </span>
            </div>
          </div>
        </section>
        
        {/* Pros & Cons Section */}
        <section id="pros-cons" className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <span className="badge mb-3 md:mb-4">Honest Assessment</span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 md:mb-4">
                Pros &amp; Cons
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                An honest look at what each platform does well and where they could improve.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Brand Pros/Cons */}
              <div className="bg-white rounded-xl p-5 md:p-6 shadow-md border border-gray-200">
                <div className="flex items-center gap-3 mb-5">
                  <img src={BRAND.logoUrl} alt={BRAND.name} className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm p-1" />
                  <h3 className="font-bold text-gray-900 text-lg">{BRAND.name}</h3>
                </div>
                
                {/* Pros */}
                <div className="mb-5">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                    </svg>
                    Pros
                  </h4>
                  <ul className="space-y-2.5">
                    {BRAND.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Cons */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"/>
                    </svg>
                    Cons
                  </h4>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      <span className="text-sm text-gray-700">Only for alternative/comparison pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      <span className="text-sm text-gray-700">No general content writing features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      <span className="text-sm text-gray-700">Newer platform (growing community)</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Competitor Pros/Cons */}
              <div className="bg-white rounded-xl p-5 md:p-6 shadow-md border border-gray-200">
                <div className="flex items-center gap-3 mb-5">
                  <img src={getFaviconUrl(competitor.website, 128)} alt={competitor.name} className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm" />
                  <h3 className="font-bold text-gray-900 text-lg">{competitor.name}</h3>
                </div>
                
                {/* Pros */}
                <div className="mb-5">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                    </svg>
                    Pros
                  </h4>
                  <ul className="space-y-2.5">
                    {competitor.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Cons */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"/>
                    </svg>
                    Cons
                  </h4>
                  <ul className="space-y-2.5">
                    {competitor.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                        <span className="text-sm text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Use Cases Section */}
        <section id="use-cases" className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <span className="badge mb-3 md:mb-4">Decision Guide</span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 md:mb-4">
                Who Should Use Which?
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                Find the right tool based on your specific needs and situation.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Brand Use Cases */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 shadow-md">
                <div className="flex items-center gap-3 mb-5">
                  <img src={BRAND.logoUrl} alt={BRAND.name} className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm p-1" />
                  <h3 className="font-bold text-gray-900 text-lg">Choose {BRAND.name} If...</h3>
                </div>
                
                <ul className="space-y-3">
                  {[
                    'You need "X alternative" or comparison landing pages',
                    'You want one-time pricing (no monthly subscriptions)',
                    'SEO and conversion optimization are priorities',
                    'You want to own the HTML and deploy anywhere',
                    'You\'re targeting competitor keywords',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Competitor Use Cases */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 shadow-md">
                <div className="flex items-center gap-3 mb-5">
                  <img src={getFaviconUrl(competitor.website, 128)} alt={competitor.name} className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm" />
                  <h3 className="font-bold text-gray-900 text-lg">Choose {competitor.name} If...</h3>
                </div>
                
                <ul className="space-y-3">
                  {[
                    `You need ${competitor.category.toLowerCase()} features`,
                    `${competitor.keyFeatures[0]} is your priority`,
                    `You prefer ${competitor.pricing || 'subscription pricing'}`,
                    'You need broader content capabilities',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Pro Tip */}
            <div className="mt-6 md:mt-8 p-5 md:p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Many teams use both tools! {BRAND.name} for targeted competitor comparison pages, 
                    and {competitor.name} for {competitor.category.toLowerCase()} needs. 
                    With {BRAND.name}&apos;s one-time pricing, you can easily add it alongside your existing tools without another subscription.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <span className="badge mb-3 md:mb-4">Questions &amp; Answers</span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 md:mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                Common questions about {BRAND.name} vs {competitor.name}.
              </p>
            </div>
            
            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <details key={idx} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <summary className="w-full px-4 md:px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer list-none">
                    <span className="font-semibold text-gray-900 text-sm md:text-base pr-4">{item.q}</span>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </summary>
                  <div className="px-4 md:px-6 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section id="cta" className="py-16 md:py-24 px-4 md:px-6 bg-white relative overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Ready to Create Better Alternative Pages?
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Stop settling for generic content. Start generating pages that rank for competitor keywords and convert visitors into customers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6">
              <Link href="/projects" className="w-full sm:w-auto btn-primary px-6 md:px-8 py-3 md:py-4 rounded-xl text-sm md:text-base text-center">
                Try {BRAND.name} Free
              </Link>
              <Link href="/seopages-pro-alternatives" className="w-full sm:w-auto btn-secondary px-6 md:px-8 py-3 md:py-4 rounded-xl text-sm md:text-base text-center">
                See More Comparisons
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                <span>Free tier available</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                <span>One-time payment</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                <span>Own your HTML forever</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <Footer theme="light" />
        
        {/* Scroll to Top Button */}
        <button 
          id="scrollTop" 
          className="scroll-top-btn fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all z-50"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18"/>
          </svg>
        </button>
        
        {/* Client-side Scripts - wrapped in setTimeout to avoid hydration mismatch */}
        <script dangerouslySetInnerHTML={{ __html: `
          // Wait for hydration to complete before adding interactive behaviors
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              // Scroll to top button visibility
              const scrollHandler = () => {
                const btn = document.getElementById('scrollTop');
                if (btn) btn.classList.toggle('visible', window.scrollY > 300);
              };
              window.addEventListener('scroll', scrollHandler);
              
              // Scroll to top click handler
              const scrollTopBtn = document.getElementById('scrollTop');
              if (scrollTopBtn) {
                scrollTopBtn.addEventListener('click', () => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                });
              }
              
              // TOC active link highlighting
              const tocLinks = document.querySelectorAll('.toc-link');
              const sections = document.querySelectorAll('section[id]');
              
              const tocScrollHandler = () => {
                let current = '';
                sections.forEach(section => {
                  const sectionTop = section.offsetTop - 150;
                  if (scrollY >= sectionTop) current = section.getAttribute('id');
                });
                tocLinks.forEach(link => {
                  link.classList.remove('bg-gray-100', 'font-semibold', 'text-gray-900');
                  if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('bg-gray-100', 'font-semibold', 'text-gray-900');
                  }
                });
              };
              window.addEventListener('scroll', tocScrollHandler);
            }, 0);
          }
        `}} />
      </div>
    </>
  );
}
