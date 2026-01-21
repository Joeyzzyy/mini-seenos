/**
 * Seed Script: Create SEOPages.pro vs Competitors Topic Cluster
 * 
 * This script creates alternative pages for seopages.pro against all major SEO tools/competitors.
 * 
 * Usage:
 * 1. Set your USER_ID and SEO_PROJECT_ID below
 * 2. Run: npx ts-node scripts/seed-seopages-altpages.ts
 * 
 * Or run via API by importing the competitors list.
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ========== CONFIGURE THESE ==========
const USER_ID = ''; // Your Supabase user ID
const SEO_PROJECT_ID = ''; // The seopages.pro project ID
// =====================================

const CLUSTER_NAME = 'SEOPages.pro vs SEO Tools';
const CLUSTER_DESCRIPTION = 'Alternative pages comparing SEOPages.pro against all major SEO tools and AI content platforms. Our advantage: Better altpage generation + competitive pricing.';

// Competitors list with metadata
const COMPETITORS = [
  // AI Content & SEO Writing Tools
  { name: 'Jasper AI', slug: 'jasper-ai', category: 'AI Writing', tagline: 'AI writing assistant' },
  { name: 'Copy.ai', slug: 'copy-ai', category: 'AI Writing', tagline: 'AI copywriting tool' },
  { name: 'Writesonic', slug: 'writesonic', category: 'AI Writing', tagline: 'AI content platform' },
  { name: 'Surfer SEO', slug: 'surfer-seo', category: 'SEO Content', tagline: 'SEO content optimization' },
  { name: 'Frase', slug: 'frase', category: 'SEO Content', tagline: 'AI SEO content tool' },
  { name: 'MarketMuse', slug: 'marketmuse', category: 'Content Strategy', tagline: 'AI content strategy' },
  { name: 'Clearscope', slug: 'clearscope', category: 'Content Optimization', tagline: 'Content optimization platform' },
  { name: 'NeuronWriter', slug: 'neuronwriter', category: 'SEO Writing', tagline: 'AI SEO writing assistant' },
  { name: 'GrowthBar', slug: 'growthbar', category: 'SEO Tools', tagline: 'AI SEO tool' },
  { name: 'Scalenut', slug: 'scalenut', category: 'AI Content', tagline: 'AI-powered SEO content' },
  { name: 'ContentShake AI', slug: 'contentshake-ai', category: 'AI Content', tagline: 'Semrush AI content tool' },
  { name: 'Koala AI', slug: 'koala-ai', category: 'AI Writing', tagline: 'AI article writer' },
  { name: 'Article Forge', slug: 'article-forge', category: 'AI Writing', tagline: 'Automated article writing' },
  { name: 'Rytr', slug: 'rytr', category: 'AI Writing', tagline: 'AI writing assistant' },
  { name: 'Anyword', slug: 'anyword', category: 'AI Copywriting', tagline: 'AI copy optimization' },
  
  // Comprehensive SEO Platforms
  { name: 'Ahrefs', slug: 'ahrefs', category: 'SEO Suite', tagline: 'All-in-one SEO toolset' },
  { name: 'SEMrush', slug: 'semrush', category: 'SEO Suite', tagline: 'Digital marketing platform' },
  { name: 'Moz Pro', slug: 'moz-pro', category: 'SEO Suite', tagline: 'SEO software suite' },
  { name: 'Ubersuggest', slug: 'ubersuggest', category: 'SEO Tools', tagline: 'Keyword research tool' },
  { name: 'Serpstat', slug: 'serpstat', category: 'SEO Platform', tagline: 'Growth hacking tool' },
  { name: 'SE Ranking', slug: 'se-ranking', category: 'SEO Platform', tagline: 'SEO platform' },
  { name: 'SpyFu', slug: 'spyfu', category: 'Competitor Analysis', tagline: 'Competitor keyword research' },
  { name: 'Mangools', slug: 'mangools', category: 'SEO Tools', tagline: 'KWFinder & SEO tools' },
  { name: 'Raven Tools', slug: 'raven-tools', category: 'SEO Reporting', tagline: 'SEO reporting platform' },
  
  // Landing Page Builders (they also do conversion pages)
  { name: 'Unbounce', slug: 'unbounce', category: 'Landing Pages', tagline: 'Landing page builder' },
  { name: 'Instapage', slug: 'instapage', category: 'Landing Pages', tagline: 'Post-click optimization' },
  { name: 'Leadpages', slug: 'leadpages', category: 'Landing Pages', tagline: 'Landing page platform' },
  { name: 'ClickFunnels', slug: 'clickfunnels', category: 'Sales Funnels', tagline: 'Sales funnel builder' },
  { name: 'Carrd', slug: 'carrd', category: 'Simple Pages', tagline: 'Simple one-page sites' },
  
  // Other Content/SEO Tools
  { name: 'Rank Math', slug: 'rank-math', category: 'WordPress SEO', tagline: 'WordPress SEO plugin' },
  { name: 'Yoast SEO', slug: 'yoast-seo', category: 'WordPress SEO', tagline: 'WordPress SEO plugin' },
  { name: 'All in One SEO', slug: 'all-in-one-seo', category: 'WordPress SEO', tagline: 'WordPress SEO toolkit' },
  { name: 'Screaming Frog', slug: 'screaming-frog', category: 'Technical SEO', tagline: 'SEO spider tool' },
  { name: 'Sitebulb', slug: 'sitebulb', category: 'Technical SEO', tagline: 'Website crawler' },
  { name: 'Page Optimizer Pro', slug: 'page-optimizer-pro', category: 'On-Page SEO', tagline: 'On-page optimization' },
  { name: 'SurgeGraph', slug: 'surgegraph', category: 'AI Content', tagline: 'AI SEO content writer' },
  { name: 'WordLift', slug: 'wordlift', category: 'AI SEO', tagline: 'AI-powered SEO' },
  { name: 'INK Editor', slug: 'ink-editor', category: 'AI Writing', tagline: 'AI content optimization' },
  { name: 'Outranking', slug: 'outranking', category: 'AI SEO', tagline: 'AI SEO content platform' },
];

// Generate page outline for each competitor
function generateOutline(competitor: typeof COMPETITORS[0]) {
  return {
    h1: `SEOPages.pro vs ${competitor.name}: Best Alternative Page Generator in 2026`,
    sections: [
      {
        h2: `Why Choose SEOPages.pro Over ${competitor.name}?`,
        key_points: [
          'Specialized in alternative page generation',
          'AI-powered competitive analysis',
          'More affordable pricing',
          'Better conversion-focused templates'
        ],
        word_count: 300
      },
      {
        h2: `${competitor.name} Overview`,
        h3s: [`What is ${competitor.name}?`, `${competitor.name} Key Features`, `${competitor.name} Pricing`],
        key_points: [
          `${competitor.tagline}`,
          'General overview of their offering',
          'Pricing comparison'
        ],
        word_count: 400
      },
      {
        h2: 'SEOPages.pro Overview',
        h3s: ['What is SEOPages.pro?', 'Our Key Features', 'Pricing Plans'],
        key_points: [
          'AI-powered alternative page generator',
          'Specialized for competitor comparison pages',
          'Affordable, transparent pricing',
          'High-converting templates'
        ],
        word_count: 400
      },
      {
        h2: `Feature Comparison: SEOPages.pro vs ${competitor.name}`,
        h3s: ['Alternative Page Generation', 'AI Content Quality', 'Ease of Use', 'Value for Money'],
        key_points: [
          'Direct feature-by-feature comparison',
          'Our strengths in altpage generation',
          'Where we focus vs their broader approach'
        ],
        word_count: 500
      },
      {
        h2: `When to Choose SEOPages.pro Over ${competitor.name}`,
        key_points: [
          'You need high-quality alternative/comparison pages',
          'You want specialized tool over generalist',
          'Budget-conscious but quality-focused',
          'Fast turnaround needed'
        ],
        word_count: 300
      },
      {
        h2: `When ${competitor.name} Might Be Better`,
        key_points: [
          'Honest assessment of their strengths',
          'Use cases where they excel',
          'Build trust through transparency'
        ],
        word_count: 200
      },
      {
        h2: 'Verdict: SEOPages.pro is the Best Choice for Alternative Pages',
        key_points: [
          'Summary of key advantages',
          'Clear recommendation',
          'Call to action'
        ],
        word_count: 200
      },
      {
        h2: 'FAQ',
        h3s: [
          `Is SEOPages.pro really better than ${competitor.name}?`,
          'How much does SEOPages.pro cost?',
          'Can I migrate from ' + competitor.name + '?',
          'Do you offer a free trial?'
        ],
        word_count: 300
      }
    ]
  };
}

// Generate SEO metadata
function generateSEOMeta(competitor: typeof COMPETITORS[0]) {
  return {
    seo_title: `SEOPages.pro vs ${competitor.name} (2026) - Best Alternative Page Generator`,
    seo_description: `Compare SEOPages.pro vs ${competitor.name}. See why SEOPages.pro is the best choice for generating high-converting alternative pages. Better AI, lower prices, specialized focus.`,
    target_keyword: `seopages.pro vs ${competitor.name}`.toLowerCase(),
  };
}

async function main() {
  if (!USER_ID || !SEO_PROJECT_ID) {
    console.error('❌ Please set USER_ID and SEO_PROJECT_ID in the script');
    console.log('\nTo find your IDs:');
    console.log('1. USER_ID: Check your Supabase auth.users table or browser console');
    console.log('2. SEO_PROJECT_ID: Check seo_projects table for seopages.pro domain');
    process.exit(1);
  }

  console.log('🚀 Starting SEOPages.pro vs Competitors seed...\n');

  // 1. Create or find the Topic Cluster (content_project)
  console.log('📁 Creating Topic Cluster...');
  
  let projectId: string;
  
  // Check if cluster already exists
  const { data: existingProject } = await supabase
    .from('content_projects')
    .select('id')
    .eq('user_id', USER_ID)
    .eq('seo_project_id', SEO_PROJECT_ID)
    .ilike('name', CLUSTER_NAME)
    .single();

  if (existingProject) {
    projectId = existingProject.id;
    console.log(`   ✅ Found existing cluster: ${projectId}`);
  } else {
    const { data: newProject, error } = await supabase
      .from('content_projects')
      .insert({
        user_id: USER_ID,
        seo_project_id: SEO_PROJECT_ID,
        name: CLUSTER_NAME,
        description: CLUSTER_DESCRIPTION,
      })
      .select('id')
      .single();

    if (error) {
      console.error('❌ Failed to create cluster:', error);
      process.exit(1);
    }
    projectId = newProject.id;
    console.log(`   ✅ Created new cluster: ${projectId}`);
  }

  // 2. Create content items for each competitor
  console.log(`\n📝 Creating ${COMPETITORS.length} alternative pages...\n`);

  let created = 0;
  let skipped = 0;

  for (const competitor of COMPETITORS) {
    const slug = `seopages-pro-vs-${competitor.slug}-alternative`;
    const outline = generateOutline(competitor);
    const seoMeta = generateSEOMeta(competitor);

    // Check if already exists
    const { data: existing } = await supabase
      .from('content_items')
      .select('id')
      .eq('user_id', USER_ID)
      .eq('slug', slug)
      .single();

    if (existing) {
      console.log(`   ⏭️  Skipped (exists): ${competitor.name}`);
      skipped++;
      continue;
    }

    const { error } = await supabase.from('content_items').insert({
      user_id: USER_ID,
      seo_project_id: SEO_PROJECT_ID,
      project_id: projectId,
      title: outline.h1,
      slug,
      page_type: 'alternative',
      target_keyword: seoMeta.target_keyword,
      seo_title: seoMeta.seo_title,
      seo_description: seoMeta.seo_description,
      outline,
      keyword_data: {
        volume: null,
        kd: null,
        cpc: null,
        competition: null,
        category: competitor.category,
      },
      status: 'ready',
      priority: competitor.category === 'AI Writing' || competitor.category === 'SEO Content' ? 1 : 2,
      estimated_word_count: 2600,
      notes: `Competitor: ${competitor.name} (${competitor.category}) - ${competitor.tagline}`,
    });

    if (error) {
      console.error(`   ❌ Failed: ${competitor.name}`, error.message);
    } else {
      console.log(`   ✅ Created: SEOPages.pro vs ${competitor.name}`);
      created++;
    }
  }

  console.log(`\n🎉 Done!`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total competitors: ${COMPETITORS.length}`);
  console.log(`\n📌 Topic Cluster ID: ${projectId}`);
  console.log(`\nNext steps:`);
  console.log(`1. Go to your seopages.pro project in the app`);
  console.log(`2. You'll see the new "SEOPages.pro vs SEO Tools" cluster`);
  console.log(`3. Click any page and hit "Generate" to create the content!`);
}

main().catch(console.error);
