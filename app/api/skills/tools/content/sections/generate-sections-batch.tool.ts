import { tool } from 'ai';
import { z } from 'zod';

// Import all section generators (execute functions only, not tool wrappers)
import { generate_hero_section } from './generate-hero-section.tool';
import { generate_toc_section } from './generate-toc-section.tool';
import { generate_verdict_section } from './generate-verdict-section.tool';
import { generate_comparison_table } from './generate-comparison-table.tool';
import { generate_pricing_section } from './generate-pricing-section.tool';
import { generate_pros_cons_section } from './generate-pros-cons-section.tool';
import { generate_use_cases_section } from './generate-use-cases-section.tool';
import { generate_faq_section } from './generate-faq-section.tool';
import { generate_cta_section } from './generate-cta-section.tool';
import { generate_screenshots_section } from './generate-screenshots-section.tool';

// Import section storage for auto-saving
import { saveSection } from '@/lib/section-storage';

/**
 * Batch generate all sections in PARALLEL for maximum speed.
 * 
 * This tool executes all section generators concurrently using Promise.all,
 * reducing total generation time from ~60s (serial) to ~15s (parallel).
 */
export const generate_sections_batch = tool({
  description: `🚀 SPEED BOOST: Generate ALL alternative page sections in PARALLEL.

USE THIS TOOL instead of calling individual section tools one by one.
This executes all sections concurrently, reducing generation time by ~75%.

Sections generated (in parallel):
1. Hero Section - VS header with logos and CTAs
2. TOC Section - Table of contents
3. Verdict Section - Quick recommendation with highlights
4. Comparison Table - Feature-by-feature comparison
5. Pricing Section - Plan comparisons
6. Pros & Cons - Honest assessment
7. Use Cases - Who should use which
8. FAQ Section - Common questions
9. Screenshots Section - Visual interface comparison
10. CTA Section - Final call-to-action

Returns all section HTML in a single response.`,
  parameters: z.object({
    // Common data shared across sections
    brand: z.object({
      name: z.string(),
      logo_url: z.string().optional(),
      tagline: z.string().optional(),
      primary_color: z.string().optional().default('#0ea5e9'),
      highlights: z.array(z.string()).optional().describe('Key advantages'),
      best_for: z.string().optional(),
      cta_url: z.string().optional().default('/'),
      website: z.string().optional(),
      pricing: z.object({
        starting_price: z.string().optional(),
        pricing_model: z.string().optional(),
        has_free_tier: z.boolean().optional(),
        plans: z.array(z.object({
          name: z.string(),
          price: z.string(),
          features: z.array(z.string()),
          is_popular: z.boolean().optional(),
        })).optional(),
      }).optional(),
      pros: z.array(z.string()).optional(),
      cons: z.array(z.string()).optional(),
      use_cases: z.array(z.string()).optional(),
    }),
    competitor: z.object({
      name: z.string(),
      logo_url: z.string().optional(),
      tagline: z.string().optional(),
      highlights: z.array(z.string()).optional(),
      best_for: z.string().optional(),
      website: z.string().optional(),
      pricing: z.object({
        starting_price: z.string().optional(),
        pricing_model: z.string().optional(),
        has_free_tier: z.boolean().optional(),
        plans: z.array(z.object({
          name: z.string(),
          price: z.string(),
          features: z.array(z.string()),
          is_popular: z.boolean().optional(),
        })).optional(),
      }).optional(),
      pros: z.array(z.string()).optional(),
      cons: z.array(z.string()).optional(),
      use_cases: z.array(z.string()).optional(),
    }),
    // Verdict/summary data
    verdict: z.object({
      headline: z.string(),
      summary: z.string(),
      bottom_line: z.string().optional(),
    }),
    stats: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).optional(),
    // Comparison data
    features: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
      brand_status: z.enum(['yes', 'partial', 'no', 'coming_soon']).or(z.string()),
      brand_detail: z.string().optional(),
      competitor_status: z.enum(['yes', 'partial', 'no', 'coming_soon']).or(z.string()),
      competitor_detail: z.string().optional(),
    })).optional(),
    // FAQ data
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    // SEO data
    seo_description: z.string().optional(),
    // Content item ID for saving
    contentItemId: z.string().optional(),
  }),
  execute: async (params) => {
    const startTime = Date.now();
    console.log(`[generate_sections_batch] Starting parallel generation for ${params.brand.name} vs ${params.competitor.name}...`);

    const {
      brand,
      competitor,
      verdict,
      stats = [],
      features = [],
      faqs = [],
      seo_description,
      contentItemId,
    } = params;

    // Prepare common data for sections
    const brandData = {
      name: brand.name,
      logo_url: brand.logo_url,
      tagline: brand.tagline,
      primary_color: brand.primary_color,
      highlights: brand.highlights || [],
      best_for: brand.best_for || `Teams looking for ${brand.name}`,
      cta_url: brand.cta_url || '/',
    };

    const competitorData = {
      name: competitor.name,
      logo_url: competitor.logo_url,
      tagline: competitor.tagline,
      highlights: competitor.highlights || [],
      best_for: competitor.best_for || `Users of ${competitor.name}`,
    };

    // Execute ALL sections in parallel using Promise.allSettled
    const sectionPromises = [
      // 1. Hero Section
      (generate_hero_section as any).execute({
        brand: brandData,
        competitor: { name: competitor.name, logo_url: competitor.logo_url },
        seo_description,
        cta_primary: { text: `Try ${brand.name}`, url: brand.cta_url || '/' },
      }).catch((e: Error) => ({ success: false, section_id: 'hero', error: e.message })),

      // 2. TOC Section
      (generate_toc_section as any).execute({
        sections: [
          { id: 'verdict', label: 'Quick Verdict' },
          { id: 'comparison', label: 'Feature Comparison' },
          { id: 'pricing', label: 'Pricing' },
          { id: 'pros-cons', label: 'Pros & Cons' },
          { id: 'use-cases', label: 'Use Cases' },
          { id: 'screenshots', label: 'Screenshots' },
          { id: 'faq', label: 'FAQ' },
        ],
        brand_name: brand.name,
        competitor_name: competitor.name,
      }).catch((e: Error) => ({ success: false, section_id: 'toc', error: e.message })),

      // 3. Verdict Section
      (generate_verdict_section as any).execute({
        brand: brandData,
        competitor: competitorData,
        verdict,
        stats: stats.length > 0 ? stats : [
          { value: 'Beta', label: `${brand.name} Status` },
          { value: 'Est.', label: `${competitor.name} Status` },
        ],
        bottom_line: verdict.bottom_line,
      }).catch((e: Error) => ({ success: false, section_id: 'verdict', error: e.message })),

      // 4. Comparison Table - requires brand_wins and competitor_wins
      features.length > 0 ? (generate_comparison_table as any).execute({
        brand: brandData,
        competitor: competitorData,
        features: features.map(f => ({
          name: f.name,
          description: f.description || '',
          brand_value: f.brand_detail || (f.brand_status === 'yes' ? 'Yes' : f.brand_status === 'partial' ? 'Partial' : 'No'),
          brand_status: f.brand_status === 'coming_soon' ? 'partial' : (f.brand_status as any) || 'partial',
          competitor_value: f.competitor_detail || (f.competitor_status === 'yes' ? 'Yes' : f.competitor_status === 'partial' ? 'Partial' : 'No'),
          competitor_status: f.competitor_status === 'coming_soon' ? 'partial' : (f.competitor_status as any) || 'partial',
        })),
        brand_wins: features.filter(f => f.brand_status === 'yes' && f.competitor_status !== 'yes').slice(0, 4).map(f => f.name) || ['Key feature'],
        competitor_wins: features.filter(f => f.competitor_status === 'yes' && f.brand_status !== 'yes').slice(0, 4).map(f => f.name) || ['Some features'],
      }).catch((e: Error) => ({ success: false, section_id: 'comparison', error: e.message })) :
        Promise.resolve({ success: true, section_id: 'comparison', html: '', skipped: true }),

      // 5. Pricing Section - requires detailed plans structure
      (brand.pricing?.plans || competitor.pricing?.plans) ? (generate_pricing_section as any).execute({
        brand: {
          name: brand.name,
          logo_url: brand.logo_url,
          pricing: {
            free_tier: brand.pricing?.has_free_tier ?? true,
            starting_price: brand.pricing?.starting_price || 'Free',
            billing_note: brand.pricing?.pricing_model || 'Beta pricing',
            plans: brand.pricing?.plans || [{
              name: 'Free',
              price: '$0',
              description: 'Get started for free',
              features: ['Basic features', 'Community support'],
              is_recommended: true,
            }],
          },
        },
        competitor: {
          name: competitor.name,
          logo_url: competitor.logo_url,
          pricing: {
            free_tier: competitor.pricing?.has_free_tier ?? false,
            starting_price: competitor.pricing?.starting_price || 'Contact us',
            billing_note: competitor.pricing?.pricing_model || '',
            plans: competitor.pricing?.plans || [{
              name: 'Standard',
              price: 'Contact us',
              description: 'Contact for pricing',
              features: ['Full features', 'Priority support'],
              is_recommended: false,
            }],
          },
        },
        value_summary: `${brand.name} offers more accessible pricing while ${competitor.name} targets enterprise customers.`,
      }).catch((e: Error) => ({ success: false, section_id: 'pricing', error: e.message })) :
        Promise.resolve({ success: true, section_id: 'pricing', html: '', skipped: true }),

      // 6. Pros & Cons
      (brand.pros || competitor.pros) ? (generate_pros_cons_section as any).execute({
        brand: {
          ...brandData,
          pros: brand.pros || ['Modern platform', 'Regular updates'],
          cons: brand.cons || ['Newer to market'],
        },
        competitor: {
          ...competitorData,
          pros: competitor.pros || ['Established solution', 'Large user base'],
          cons: competitor.cons || ['Legacy features'],
        },
      }).catch((e: Error) => ({ success: false, section_id: 'pros-cons', error: e.message })) :
        Promise.resolve({ success: true, section_id: 'pros-cons', html: '', skipped: true }),

      // 7. Use Cases
      (brand.use_cases || competitor.use_cases) ? (generate_use_cases_section as any).execute({
        brand: {
          ...brandData,
          use_cases: brand.use_cases || [`Teams adopting ${brand.name}`],
        },
        competitor: {
          ...competitorData,
          use_cases: competitor.use_cases || [`Current ${competitor.name} users`],
        },
        pro_tip: `Choose ${brand.name} for innovation, ${competitor.name} for familiarity.`,
      }).catch((e: Error) => ({ success: false, section_id: 'use-cases', error: e.message })) :
        Promise.resolve({ success: true, section_id: 'use-cases', html: '', skipped: true }),

      // 8. FAQ Section - requires content_item_id (snake_case)
      faqs.length > 0 ? (generate_faq_section as any).execute({
        content_item_id: contentItemId,  // Note: snake_case expected by generate_faq_section
        brand_name: brand.name,
        competitor_name: competitor.name,
        faqs,
      }).catch((e: Error) => ({ success: false, section_id: 'faq', error: e.message })) :
        Promise.resolve({ success: true, section_id: 'faq', html: '', skipped: true }),

      // 9. Screenshots Section - uses screenshotmachine.com API internally
      (generate_screenshots_section as any).execute({
        brand: {
          name: brand.name,
          screenshot_url: `https://api.screenshotmachine.com?key=7cec4c&url=${encodeURIComponent(brand.website || brand.cta_url || `https://${brand.name.toLowerCase().replace(/\s+/g, '')}.com`)}&dimension=1366x768&device=desktop&format=png&cacheLimit=86400&delay=2000&zoom=100`,
          caption: `${brand.name} dashboard interface`,
          cta_url: brand.cta_url || '/',
          primary_color: brand.primary_color || '#0ea5e9',
        },
        competitor: {
          name: competitor.name,
          screenshot_url: `https://api.screenshotmachine.com?key=7cec4c&url=${encodeURIComponent(competitor.website || `https://${competitor.name.toLowerCase().replace(/\s+/g, '')}.com`)}&dimension=1366x768&device=desktop&format=png&cacheLimit=86400&delay=2000&zoom=100`,
          caption: `${competitor.name} interface`,
        },
      }).catch((e: Error) => ({ success: false, section_id: 'screenshots', error: e.message })),

      // 10. CTA Section - requires content_item_id for database storage
      contentItemId ? (generate_cta_section as any).execute({
        content_item_id: contentItemId,
        brand_name: brand.name,
        brand_primary_color: brand.primary_color || '#0ea5e9',
        headline: `Ready to try ${brand.name}?`,
        description: brand.tagline || `Get started with ${brand.name} today and see the difference.`,
        primary_cta: { text: `Get Started with ${brand.name}`, url: brand.cta_url || '/' },
        secondary_cta: { text: 'Learn More', url: brand.cta_url || '/' },
        trust_badges: ['Free trial available', 'No credit card required'],
      }).catch((e: Error) => ({ success: false, section_id: 'cta', error: e.message })) :
        Promise.resolve({ success: true, section_id: 'cta', html: '', skipped: true, reason: 'No contentItemId provided' }),
    ];

    // Wait for ALL sections to complete in parallel
    const results = await Promise.all(sectionPromises);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);

    // Collect successful sections - format compatible with assemble_alternative_page
    const sections: Record<string, string> = {};  // section_id -> html (flat format for assemble)
    const sectionDetails: Record<string, any> = {}; // section_id -> {html, name} (detailed format)
    const errors: string[] = [];
    let totalHtmlSize = 0;

    results.forEach((result: any) => {
      if (result.success && result.html) {
        // Map section_id to the format expected by assemble_alternative_page
        // Convert kebab-case to snake_case for sections that need it
        let mappedId = result.section_id;
        if (mappedId === 'pros-cons') mappedId = 'pros_cons';
        if (mappedId === 'use-cases') mappedId = 'use_cases';
        sections[mappedId] = result.html;
        sectionDetails[result.section_id] = {
          html: result.html,
          name: result.section_name || result.section_id,
        };
        totalHtmlSize += result.html.length;
      } else if (result.skipped) {
        // Skipped sections are fine
      } else if (result.error) {
        errors.push(`${result.section_id}: ${result.error}`);
      }
    });

    const sectionCount = Object.keys(sections).length;
    console.log(`[generate_sections_batch] Completed ${sectionCount} sections in ${duration}s (${(totalHtmlSize / 1024).toFixed(1)} KB)`);

    if (errors.length > 0) {
      console.warn(`[generate_sections_batch] ${errors.length} sections failed:`, errors);
    }

    // AUTO-SAVE all sections to database for recovery
    // This ensures assemble_alternative_page can recover sections even if AI passes placeholder
    let savedCount = 0;
    if (contentItemId && sectionCount > 0) {
      console.log(`[generate_sections_batch] Auto-saving ${sectionCount} sections to database...`);
      
      // Define section order for proper assembly
      const sectionOrderMap: Record<string, number> = {
        'hero': 1,
        'toc': 2,
        'verdict': 3,
        'comparison': 4,
        'pricing': 5,
        'pros_cons': 6,
        'use_cases': 7,
        'screenshots': 8,
        'faq': 9,
        'cta': 10,
      };
      
      // Save all sections in parallel
      const savePromises = Object.entries(sections).map(async ([sectionId, html]) => {
        const order = sectionOrderMap[sectionId] || 99;
        try {
          const result = await saveSection({
            content_item_id: contentItemId,
            section_id: sectionId,
            section_type: 'alternative',
            section_order: order,
            section_html: html,
            metadata: { generated_by: 'batch', duration_seconds: parseFloat(duration) },
          });
          if (result.success) {
            savedCount++;
          } else {
            console.warn(`[generate_sections_batch] Failed to save section ${sectionId}:`, result.error);
          }
        } catch (e) {
          console.warn(`[generate_sections_batch] Error saving section ${sectionId}:`, e);
        }
      });
      
      await Promise.all(savePromises);
      console.log(`[generate_sections_batch] Auto-saved ${savedCount}/${sectionCount} sections to database`);
    }

    // If sections are saved to database, return minimal data to reduce token usage
    // assemble_alternative_page can recover all sections from database
    if (savedCount > 0 && contentItemId) {
      return {
        success: true,
        content_item_id: contentItemId,
        section_ids: Object.keys(sections),
        section_count: sectionCount,
        sections_saved: savedCount,
        total_html_size: totalHtmlSize,
        duration_seconds: parseFloat(duration),
        errors: errors.length > 0 ? errors : undefined,
        message: `Generated ${sectionCount} sections in ${duration}s (parallel). All ${savedCount} sections saved to database. Call assemble_alternative_page with item_id="${contentItemId}" - it will auto-recover sections from database.`,
        // DO NOT return full sections HTML to reduce token usage (~45K -> ~1K tokens)
      };
    }

    // Fallback: return full sections if not saved to database
    return {
      success: true,
      sections,
      section_details: sectionDetails,
      section_count: sectionCount,
      sections_saved: savedCount,
      total_html_size: totalHtmlSize,
      duration_seconds: parseFloat(duration),
      errors: errors.length > 0 ? errors : undefined,
      message: `Generated ${sectionCount} sections in ${duration}s (parallel). Pass 'sections' directly to assemble_alternative_page.`,
    };
  },
});
