// SEOPages.pro Alternatives - Competitor Data
// 38 competitors organized by category

export interface Competitor {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  website: string;
  logoUrl?: string; // Will use Google Favicon API as fallback
  description: string;
  pricing?: string;
  keyFeatures: string[];
  weaknesses: string[];
}

export const COMPETITORS: Competitor[] = [
  // ============================================
  // AI Writing & Content Tools (15)
  // ============================================
  {
    slug: 'jasper-ai',
    name: 'Jasper AI',
    category: 'AI Writing',
    tagline: 'AI writing assistant for marketing teams',
    website: 'jasper.ai',
    description: 'Jasper AI is a popular AI writing assistant that helps create marketing content, blog posts, and social media copy.',
    pricing: 'Creator $49/mo, Pro $69/mo, Business custom pricing',
    keyFeatures: ['Brand voice training', 'Team collaboration', '50+ template library', 'Chrome extension', 'Multi-language support'],
    weaknesses: ['Expensive monthly subscription', 'No SEO-specific features', 'Generic outputs need editing', 'No alternative page templates'],
  },
  {
    slug: 'copy-ai',
    name: 'Copy.ai',
    category: 'AI Writing',
    tagline: 'AI-powered copywriting tool',
    website: 'copy.ai',
    description: 'Copy.ai helps create marketing copy, product descriptions, and social media content using AI.',
    pricing: 'Free tier, Pro $49/mo, Team $249/mo, Enterprise custom',
    keyFeatures: ['90+ copywriting templates', 'Workflows automation', 'Free tier with 2,000 words/mo', 'Team collaboration', 'API access'],
    weaknesses: ['Output quality varies', 'Limited SEO optimization', 'No comparison page templates', 'Monthly subscription model'],
  },
  {
    slug: 'writesonic',
    name: 'Writesonic',
    category: 'AI Writing',
    tagline: 'AI writer for blogs, ads, and more',
    website: 'writesonic.com',
    description: 'Writesonic is an AI content platform for creating articles, landing pages, and marketing copy using multiple AI models.',
    pricing: 'Free tier, Standard $79/mo (annual), Professional $199/mo (annual)',
    keyFeatures: ['AI Article Writer (5,000+ words)', 'Multiple LLMs (GPT-4o, Claude, Gemini)', 'Chatsonic AI chatbot', 'Real-time SEO integrations', 'WordPress publishing'],
    weaknesses: ['Credit-based pricing can get expensive', 'Quality inconsistent across models', 'No specialized alternative page templates', 'Monthly subscription required'],
  },
  {
    slug: 'surfer-seo',
    name: 'Surfer SEO',
    category: 'SEO Content',
    tagline: 'Content optimization for better rankings',
    website: 'surferseo.com',
    description: 'Surfer SEO analyzes top-ranking pages and provides guidelines to optimize your content for search engines.',
    pricing: 'Essential $99/mo ($79 annual), Scale $219/mo ($175 annual), Enterprise from $999/mo',
    keyFeatures: ['Content Editor with real-time scoring', 'SERP Analyzer', 'Keyword Research', 'Content Audit tool', 'AI writing integration'],
    weaknesses: ['Expensive monthly subscription ($99+)', 'Steep learning curve', 'Does not generate ready-to-deploy pages', 'No alternative page templates'],
  },
  {
    slug: 'frase',
    name: 'Frase',
    category: 'SEO Content',
    tagline: 'AI SEO content workflow tool',
    website: 'frase.io',
    description: 'Frase helps research, write, and optimize SEO content with AI-powered brief generation and content optimization.',
    pricing: 'Solo $15/mo, Basic $45/mo, Team $115/mo (+ AI add-on $35/mo)',
    keyFeatures: ['Content briefs generation', 'AI writer with SERP analysis', 'Question research', 'Content optimization scoring', 'Google Docs integration'],
    weaknesses: ['Limited documents on basic plans', 'UI can be complex for beginners', 'No comparison page templates', 'Monthly subscription required'],
  },
  {
    slug: 'marketmuse',
    name: 'MarketMuse',
    category: 'Content Strategy',
    tagline: 'AI-powered content strategy platform',
    website: 'marketmuse.com',
    description: 'MarketMuse uses AI to plan content strategy, identify gaps, and optimize existing content.',
    pricing: 'Free tier (limited), Standard $149/mo, Team $399/mo, Premium custom',
    keyFeatures: ['Content inventory analysis', 'Topic modeling & clusters', 'AI content briefs', 'Content gap analysis', 'Competitive research'],
    weaknesses: ['Very expensive ($149+/month)', 'Enterprise-focused complexity', 'No page generation or deployment', 'Steep learning curve'],
  },
  {
    slug: 'clearscope',
    name: 'Clearscope',
    category: 'Content Optimization',
    tagline: 'SEO content optimization platform',
    website: 'clearscope.io',
    description: 'Clearscope helps optimize content for search by analyzing top-performing pages and providing keyword recommendations.',
    pricing: 'Essentials $189/mo, Business $399/mo, Enterprise custom',
    keyFeatures: ['Content grading A++ system', 'NLP-powered keyword recommendations', 'Google Docs & WordPress integration', 'Content reports & sharing', 'Real-time optimization'],
    weaknesses: ['Very expensive ($189+/month)', 'Only optimization, no content generation', 'No alternative page features', 'No deploy-ready output'],
  },
  {
    slug: 'neuronwriter',
    name: 'NeuronWriter',
    category: 'SEO Writing',
    tagline: 'AI SEO content editor',
    website: 'neuronwriter.com',
    description: 'NeuronWriter combines AI writing with SEO optimization using NLP and competitor analysis.',
    pricing: 'Bronze $23/mo, Silver $45/mo, Gold $69/mo, Platinum $93/mo',
    keyFeatures: ['NLP optimization', 'AI writer', 'Competitor analysis', 'Content planner'],
    weaknesses: ['UI less polished', 'Limited integrations', 'Generic content focus'],
  },
  {
    slug: 'growthbar',
    name: 'GrowthBar',
    category: 'SEO Tools',
    tagline: 'AI SEO tool for content marketing',
    website: 'growthbarseo.com',
    description: 'GrowthBar offers AI writing, keyword research, and competitor insights in one Chrome extension.',
    pricing: 'Standard $48/mo, Pro $99/mo, Agency $199/mo',
    keyFeatures: ['Chrome extension', 'AI blog outlines', 'Keyword research', 'Competitor analysis'],
    weaknesses: ['Basic compared to enterprise tools', 'Limited features', 'No comparison pages'],
  },
  {
    slug: 'scalenut',
    name: 'Scalenut',
    category: 'AI Content',
    tagline: 'AI-powered SEO content platform',
    website: 'scalenut.com',
    description: 'Scalenut combines AI content writing with SEO optimization for blog posts and articles.',
    pricing: 'Essential $39/mo, Growth $79/mo, Pro $149/mo',
    keyFeatures: ['Cruise Mode', 'SEO hub', 'Content optimizer', 'Keyword planner'],
    weaknesses: ['Interface can be slow', 'AI quality varies', 'No alternative page focus'],
  },
  {
    slug: 'contentshake-ai',
    name: 'ContentShake AI',
    category: 'AI Content',
    tagline: 'Semrush\'s AI content creation tool',
    website: 'semrush.com/contentshake',
    description: 'ContentShake AI by Semrush helps create SEO-optimized content with AI assistance.',
    pricing: 'Part of Semrush subscription',
    keyFeatures: ['Semrush integration', 'AI writing', 'SEO recommendations', 'Competitor insights'],
    weaknesses: ['Requires Semrush subscription', 'Limited standalone use', 'No comparison page templates'],
  },
  {
    slug: 'koala-ai',
    name: 'Koala AI',
    category: 'AI Writing',
    tagline: 'AI article and Amazon product writer',
    website: 'koala.sh',
    description: 'Koala AI generates SEO-optimized articles and Amazon affiliate content automatically.',
    pricing: 'Essentials $9/mo, Starter $25/mo, Professional $49/mo, Boost $99/mo',
    keyFeatures: ['KoalaWriter', 'Amazon reviews', 'Bulk generation', 'WordPress integration'],
    weaknesses: ['Focused on affiliate content', 'Limited customization', 'No alternative pages'],
  },
  {
    slug: 'article-forge',
    name: 'Article Forge',
    category: 'AI Writing',
    tagline: 'Automated article writing AI',
    website: 'articleforge.com',
    description: 'Article Forge automatically generates unique articles on any topic using deep learning.',
    pricing: 'Standard $57/mo ($27/mo annual), Business $127/mo ($57/mo annual)',
    keyFeatures: ['Automatic article generation', 'Bulk mode', 'WordPress integration', 'API access'],
    weaknesses: ['Quality concerns', 'Less control over output', 'No SEO optimization'],
  },
  {
    slug: 'rytr',
    name: 'Rytr',
    category: 'AI Writing',
    tagline: 'AI writing assistant for everyone',
    website: 'rytr.me',
    description: 'Rytr is an affordable AI writing assistant with multiple use cases and languages.',
    pricing: 'Free tier, Saver $9/mo, Unlimited $29/mo',
    keyFeatures: ['40+ use cases', '30+ languages', 'Chrome extension', 'Affordable pricing'],
    weaknesses: ['Basic features', 'Limited SEO', 'No comparison page support'],
  },
  {
    slug: 'anyword',
    name: 'Anyword',
    category: 'AI Copywriting',
    tagline: 'AI copy optimization platform',
    website: 'anyword.com',
    description: 'Anyword uses AI to generate and optimize marketing copy with predictive performance scoring.',
    pricing: 'Starter $49/mo, Data-Driven $99/mo, Business $499/mo, Enterprise custom',
    keyFeatures: ['Predictive analytics', 'Copy intelligence', 'Brand voice', 'A/B testing'],
    weaknesses: ['Marketing copy focus only', 'No SEO features', 'No alternative pages'],
  },

  // ============================================
  // Comprehensive SEO Platforms (9)
  // ============================================
  {
    slug: 'ahrefs',
    name: 'Ahrefs',
    category: 'SEO Suite',
    tagline: 'All-in-one SEO toolset',
    website: 'ahrefs.com',
    description: 'Ahrefs is a comprehensive SEO toolset for backlink analysis, keyword research, and competitor analysis.',
    pricing: 'Lite $129/mo, Standard $249/mo, Advanced $449/mo, Enterprise $1,499/mo',
    keyFeatures: ['Site Explorer (backlink analysis)', 'Keywords Explorer (keyword research)', 'Site Audit (technical SEO)', 'Rank Tracker', 'Content Explorer'],
    weaknesses: ['Expensive subscription ($129+/month)', 'No content generation features', 'No alternative page creation', 'Learning curve for beginners'],
  },
  {
    slug: 'semrush',
    name: 'SEMrush',
    category: 'SEO Suite',
    tagline: 'All-in-one digital marketing platform',
    website: 'semrush.com',
    description: 'SEMrush is a comprehensive digital marketing platform with SEO, PPC, and content marketing tools.',
    pricing: 'Pro $139.95/mo, Guru $249.95/mo, Business $499.95/mo',
    keyFeatures: ['Keyword research & tracking', 'Site audit & technical SEO', 'Position tracking', 'Content marketing toolkit', 'Competitor analysis'],
    weaknesses: ['Very expensive ($139+/month)', 'Complex interface for beginners', 'No dedicated alternative page tool', 'Overwhelming feature set'],
  },
  {
    slug: 'moz-pro',
    name: 'Moz Pro',
    category: 'SEO Suite',
    tagline: 'Professional SEO software',
    website: 'moz.com',
    description: 'Moz Pro offers SEO tools for keyword research, link building, and site optimization.',
    pricing: 'Starter $49/mo, Standard $99/mo, Medium $179/mo, Large $299/mo',
    keyFeatures: ['Keyword Explorer', 'Link Explorer (backlinks)', 'Site Crawl & audit', 'Rank tracking', 'Domain Authority metrics'],
    weaknesses: ['Data less fresh than Ahrefs/SEMrush', 'No content generation features', 'No comparison page tools', 'Monthly subscription model'],
  },
  {
    slug: 'ubersuggest',
    name: 'Ubersuggest',
    category: 'SEO Tools',
    tagline: 'Neil Patel\'s SEO tool',
    website: 'neilpatel.com/ubersuggest',
    description: 'Ubersuggest offers keyword research, SEO audit, and content ideas at affordable pricing.',
    pricing: 'Individual $12/mo, Business $20/mo, Enterprise $40/mo (Lifetime options available)',
    keyFeatures: ['Keyword suggestions', 'Site audit', 'Content ideas', 'Backlink data'],
    weaknesses: ['Limited compared to premium tools', 'Data accuracy concerns', 'No page generation'],
  },
  {
    slug: 'serpstat',
    name: 'Serpstat',
    category: 'SEO Platform',
    tagline: 'Growth hacking SEO tool',
    website: 'serpstat.com',
    description: 'Serpstat is an all-in-one SEO platform for keyword research, rank tracking, and competitor analysis.',
    pricing: 'Lite $69/mo, Standard $149/mo, Advanced $299/mo, Enterprise $499/mo',
    keyFeatures: ['Keyword research', 'Site audit', 'Rank tracker', 'Competitor research'],
    weaknesses: ['Smaller database', 'Interface dated', 'No content generation'],
  },
  {
    slug: 'se-ranking',
    name: 'SE Ranking',
    category: 'SEO Platform',
    tagline: 'All-in-one SEO platform',
    website: 'seranking.com',
    description: 'SE Ranking offers comprehensive SEO tools including rank tracking, audits, and keyword research.',
    pricing: 'Essential $65/mo ($52 annual), Pro $119/mo, Business $259/mo',
    keyFeatures: ['Rank tracker', 'Website audit', 'Keyword research', 'Backlink checker'],
    weaknesses: ['Less brand recognition', 'Limited content features', 'No alternative pages'],
  },
  {
    slug: 'spyfu',
    name: 'SpyFu',
    category: 'Competitor Analysis',
    tagline: 'Competitor keyword research',
    website: 'spyfu.com',
    description: 'SpyFu specializes in competitor keyword and PPC research, showing what keywords competitors rank for.',
    pricing: 'Basic $39/mo, Professional $79/mo, Team $299/mo',
    keyFeatures: ['Competitor keywords', 'PPC research', 'Historical data', 'SERP analysis'],
    weaknesses: ['Narrow focus', 'No content tools', 'No page generation'],
  },
  {
    slug: 'mangools',
    name: 'Mangools',
    category: 'SEO Tools',
    tagline: 'KWFinder and SEO tools bundle',
    website: 'mangools.com',
    description: 'Mangools offers a suite of SEO tools including the popular KWFinder for keyword research.',
    pricing: 'Basic $29/mo, Premium $44/mo, Agency $89/mo (annual billing)',
    keyFeatures: ['KWFinder', 'SERPChecker', 'SERPWatcher', 'LinkMiner'],
    weaknesses: ['Limited advanced features', 'No content creation', 'No comparison pages'],
  },
  {
    slug: 'raven-tools',
    name: 'Raven Tools',
    category: 'SEO Reporting',
    tagline: 'SEO & marketing reporting platform',
    website: 'raventools.com',
    description: 'Raven Tools provides SEO reporting, site audits, and research tools for agencies.',
    pricing: 'Small Biz $49/mo, Start $109/mo, Grow $199/mo, Thrive $299/mo, Lead $479/mo',
    keyFeatures: ['Automated reporting', 'Site auditor', 'Rank tracking', 'Agency features'],
    weaknesses: ['Agency-focused', 'No content generation', 'No alternative page tools'],
  },

  // ============================================
  // Landing Page Builders (5)
  // ============================================
  {
    slug: 'unbounce',
    name: 'Unbounce',
    category: 'Landing Pages',
    tagline: 'AI-powered landing page builder',
    website: 'unbounce.com',
    description: 'Unbounce helps create and optimize landing pages with drag-and-drop builder and AI optimization.',
    pricing: 'Build $99/mo, Experiment $149/mo, Optimize $249/mo, Concierge custom',
    keyFeatures: ['Drag-and-drop landing page builder', 'Smart Traffic AI optimization', 'A/B testing & variants', 'Popups & sticky bars', '100+ templates'],
    weaknesses: ['Expensive monthly subscription ($99+)', 'PPC/conversion focus, not SEO', 'Not designed for comparison pages', 'Pages hosted on Unbounce'],
  },
  {
    slug: 'instapage',
    name: 'Instapage',
    category: 'Landing Pages',
    tagline: 'Post-click optimization platform',
    website: 'instapage.com',
    description: 'Instapage is a landing page platform focused on improving post-click conversion rates.',
    pricing: 'Create $99/mo, Optimize $199/mo, Scale custom pricing',
    keyFeatures: ['Instablocks reusable components', 'Heatmaps & analytics', 'A/B testing', 'Team collaboration', 'AMP landing pages'],
    weaknesses: ['Very expensive ($99+/month)', 'PPC/ads focus only', 'No SEO optimization features', 'No comparison page templates'],
  },
  {
    slug: 'leadpages',
    name: 'Leadpages',
    category: 'Landing Pages',
    tagline: 'Landing pages and lead generation',
    website: 'leadpages.com',
    description: 'Leadpages helps create landing pages, pop-ups, and alert bars for lead generation.',
    pricing: 'Standard $49/mo, Pro $99/mo, Conversion $697/mo (annual billing)',
    keyFeatures: ['Drag-and-drop page builder', '200+ templates', 'Lead routing & notifications', 'Built-in analytics', 'A/B testing (Pro+)'],
    weaknesses: ['Template-focused design', 'No AI content generation', 'No comparison page templates', 'Monthly subscription required'],
  },
  {
    slug: 'clickfunnels',
    name: 'ClickFunnels',
    category: 'Sales Funnels',
    tagline: 'Sales funnel builder',
    website: 'clickfunnels.com',
    description: 'ClickFunnels helps build sales funnels, landing pages, and marketing automation.',
    pricing: 'Startup $97/mo, Pro $297/mo, Funnel Hacker $497/mo',
    keyFeatures: ['Funnel builder with templates', 'Email marketing automation', 'A/B split testing', 'Membership sites', 'Course hosting'],
    weaknesses: ['Very expensive ($97+/month)', 'Complex learning curve', 'Not designed for SEO', 'No comparison page features'],
  },
  {
    slug: 'carrd',
    name: 'Carrd',
    category: 'Simple Pages',
    tagline: 'Simple one-page sites',
    website: 'carrd.co',
    description: 'Carrd lets you create simple, responsive one-page sites quickly and affordably.',
    pricing: 'Free tier, Pro from $19/year',
    keyFeatures: ['Simple builder', 'Responsive', 'Custom domains', 'Very affordable'],
    weaknesses: ['One-page only', 'Very limited', 'No SEO features'],
  },

  // ============================================
  // WordPress SEO & Other Tools (9)
  // ============================================
  {
    slug: 'rank-math',
    name: 'Rank Math',
    category: 'WordPress SEO',
    tagline: 'WordPress SEO plugin',
    website: 'rankmath.com',
    description: 'Rank Math is a powerful WordPress SEO plugin with advanced features and AI integration.',
    pricing: 'Free version, Pro $79/yr, Business $199/yr, Agency $599/yr',
    keyFeatures: ['On-page SEO analysis', 'Advanced Schema markup', 'Keyword rank tracking', 'Google Search Console integration', 'Content AI (paid)'],
    weaknesses: ['WordPress only - not standalone', 'No content generation', 'No comparison page templates', 'Requires WordPress site'],
  },
  {
    slug: 'yoast-seo',
    name: 'Yoast SEO',
    category: 'WordPress SEO',
    tagline: 'The original WordPress SEO plugin',
    website: 'yoast.com',
    description: 'Yoast SEO is the most popular WordPress SEO plugin for on-page optimization.',
    pricing: 'Free version, Premium $99/yr per site, bundles available',
    keyFeatures: ['SEO & readability analysis', 'XML sitemaps generation', 'Schema structured data', 'Internal linking suggestions', 'Social previews'],
    weaknesses: ['WordPress only - not standalone', 'Basic analysis compared to tools', 'No AI content generation', 'No comparison page features'],
  },
  {
    slug: 'all-in-one-seo',
    name: 'All in One SEO',
    category: 'WordPress SEO',
    tagline: 'WordPress SEO toolkit',
    website: 'aioseo.com',
    description: 'All in One SEO (AIOSEO) provides comprehensive WordPress SEO features and optimizations.',
    pricing: 'Free, Basic $49/yr, Plus $99/yr, Pro $199/yr, Elite $299/yr',
    keyFeatures: ['TruSEO score', 'Schema markup', 'Local SEO', 'WooCommerce SEO'],
    weaknesses: ['WordPress only', 'No content creation', 'No comparison pages'],
  },
  {
    slug: 'screaming-frog',
    name: 'Screaming Frog',
    category: 'Technical SEO',
    tagline: 'SEO spider and crawler',
    website: 'screamingfrog.co.uk',
    description: 'Screaming Frog is a desktop SEO spider that crawls websites to analyze technical SEO issues.',
    pricing: 'Free (500 URLs), £199/year',
    keyFeatures: ['Website crawling', 'Technical audit', 'Broken links', 'Duplicate content'],
    weaknesses: ['Technical focus only', 'Desktop app', 'No content generation'],
  },
  {
    slug: 'sitebulb',
    name: 'Sitebulb',
    category: 'Technical SEO',
    tagline: 'Website crawler and auditor',
    website: 'sitebulb.com',
    description: 'Sitebulb is a website crawler that provides visual SEO audits and actionable insights.',
    pricing: 'Lite $13.75/mo, Pro $35/mo, Cloud from $99/mo (annual billing)',
    keyFeatures: ['Visual audits', 'Hints system', 'JavaScript rendering', 'Comparison crawls'],
    weaknesses: ['Technical focus', 'Desktop only', 'No page creation'],
  },
  {
    slug: 'page-optimizer-pro',
    name: 'Page Optimizer Pro',
    category: 'On-Page SEO',
    tagline: 'On-page SEO optimization tool',
    website: 'pageoptimizer.pro',
    description: 'Page Optimizer Pro analyzes top-ranking pages and provides on-page SEO recommendations.',
    pricing: 'Basic $37/mo, Unlimited $67/mo, Teams $130/mo (annual billing)',
    keyFeatures: ['NLP analysis', 'Content briefs', 'Competitor analysis', 'Focus term optimization'],
    weaknesses: ['On-page focus only', 'No content generation', 'No comparison pages'],
  },
  {
    slug: 'surgegraph',
    name: 'SurgeGraph',
    category: 'AI Content',
    tagline: 'AI SEO content writer',
    website: 'surgegraph.io',
    description: 'SurgeGraph creates long-form SEO content using AI with SERP analysis and optimization.',
    pricing: 'Starter $29/mo, Growth $69/mo, Pro $99/mo, Scale $199/mo',
    keyFeatures: ['Long-form AI writer', 'SERP analysis', 'Auto-outline', 'WordPress integration'],
    weaknesses: ['Blog focus', 'Limited templates', 'No alternative page tools'],
  },
  {
    slug: 'wordlift',
    name: 'WordLift',
    category: 'AI SEO',
    tagline: 'AI-powered SEO and structured data',
    website: 'wordlift.io',
    description: 'WordLift uses AI to add structured data and improve SEO through knowledge graphs.',
    pricing: 'Starter $59/mo, Professional $99/mo, Business+ $249/mo',
    keyFeatures: ['Structured data', 'Knowledge graph', 'Content recommendations', 'Analytics'],
    weaknesses: ['Complex setup', 'Schema focus', 'No comparison pages'],
  },
  {
    slug: 'outranking',
    name: 'Outranking',
    category: 'AI SEO',
    tagline: 'AI SEO content platform',
    website: 'outranking.io',
    description: 'Outranking combines AI writing with SEO optimization and automated content workflows.',
    pricing: 'Starter $49/mo, SEO Writer $99/mo, SEO Wizard $199/mo',
    keyFeatures: ['AI writer', 'SEO scoring', 'Fact-checking', 'Workflows'],
    weaknesses: ['Learning curve', 'Generic content', 'No alternative page templates'],
  },
];

// Get competitor by slug
export function getCompetitorBySlug(slug: string): Competitor | undefined {
  return COMPETITORS.find(c => c.slug === slug);
}

// Get competitors by category
export function getCompetitorsByCategory(category: string): Competitor[] {
  return COMPETITORS.filter(c => c.category === category);
}

// Get all unique categories
export function getCategories(): string[] {
  return [...new Set(COMPETITORS.map(c => c.category))];
}

// Get Google Favicon URL for a domain
export function getFaviconUrl(domain: string, size: number = 64): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

// Our brand info - REAL pricing from homepage
export const BRAND = {
  name: 'SEOPages.pro',
  tagline: 'AI-Powered Alternative Page Generator',
  website: 'seopages.pro',
  logoUrl: '/new-logo.png',
  primaryColor: '#0ea5e9',
  description: 'SEOPages.pro is a specialized AI tool that generates high-converting alternative and comparison pages. Unlike generic content tools, we focus exclusively on creating pages that rank for "X alternative" and "X vs Y" keywords.',
  keyFeatures: [
    'Specialized for alternative/comparison pages only',
    'AI-powered competitor research built-in',
    'Premium, conversion-optimized templates',
    'Deploy-ready HTML - own your code forever',
    'One-time payment, no monthly subscriptions',
    'SEO + GEO (AI search) optimized output',
  ],
  // REAL pricing from homepage:
  // Starter: $9.9 one-time (10 pages)
  // Standard: $19.9 one-time (20 pages) - MOST POPULAR
  // Pro: $39.9 one-time (50 pages)
  // + 1 FREE page for every Google user
  pricing: {
    model: 'one-time',
    freeTier: '1 free page',
    plans: [
      { name: 'Starter', price: '$9.9', pages: 10 },
      { name: 'Standard', price: '$19.9', pages: 20, popular: true },
      { name: 'Pro', price: '$39.9', pages: 50 },
    ],
    displayPrice: 'From $9.9 one-time',
  },
  cta: {
    primary: 'Generate Your Alternative Page',
    secondary: 'See Example Pages',
  },
};
