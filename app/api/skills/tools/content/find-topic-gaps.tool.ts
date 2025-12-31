import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const find_topic_gaps = tool({
  description: `Analyze existing topic hubs to identify content gaps and expansion opportunities.

PURPOSE:
- Identify "orphan" pillar content without supporting pages
- Find topic hubs that need more depth
- Discover new hub opportunities
- Suggest strategic content to build topical authority

ANALYSIS APPROACH:
1. Reviews existing topic structure from detect_site_topics
2. Analyzes coverage depth for each hub
3. Identifies under-developed hubs
4. Suggests specific content opportunities

BEST FOR:
- Strategic content planning
- Building topic clusters
- Expanding topical authority
- Long-term content roadmap`,

  parameters: z.object({
    user_id: z.string().describe('The user ID'),
    focus_hub: z.string().optional().describe('Optional: focus on a specific topic hub'),
    min_hub_size: z.number().default(3).describe('Minimum URLs for a hub to be considered established (default: 3)')
  }),

  execute: async ({ user_id, focus_hub, min_hub_size }) => {
    try {
      // 1. Get enhanced sitemap data with topic hubs
      const { data: sitemapContext } = await supabase
        .from('site_contexts')
        .select('content')
        .eq('user_id', user_id)
        .eq('type', 'sitemap')
        .maybeSingle();

      if (!sitemapContext?.content) {
        return {
          success: false,
          error: 'No sitemap data found. Please run Site Context Acquisition first to fetch your sitemap.',
          gaps: [],
          suggestion: 'Run the "Site Context Acquisition" skill to analyze your website structure first.'
        };
      }

      const parsed = JSON.parse(sitemapContext.content);
      let topicHubs = parsed.topicHubs || [];
      let analysis = parsed.analysis || {};

      // If no topic hubs, the sitemap data hasn't been analyzed yet
      if (!topicHubs || topicHubs.length === 0) {
        // Automatically trigger topic detection
        console.log('[find_topic_gaps] No topic hubs found, triggering detect_site_topics...');
        
        // Import and call detect_site_topics
        const { detect_site_topics } = require('./detect-site-topics.tool');
        const detectionResult = await detect_site_topics.execute?.({
          user_id,
          sitemap_data: parsed
        });
        
        if (!detectionResult?.success || !detectionResult?.topicHubs) {
          return {
            success: false,
            error: 'Failed to analyze sitemap data. The sitemap may be empty or invalid.',
            gaps: []
          };
        }
        
        // Use the newly analyzed topic hubs
        topicHubs = detectionResult.topicHubs;
        analysis = detectionResult.analysis;
        
        console.log('[find_topic_gaps] Topic detection completed, found', topicHubs.length, 'hubs');
      }

      // 2. Filter hubs if focus_hub is specified
      let hubsToAnalyze = topicHubs;
      if (focus_hub) {
        hubsToAnalyze = topicHubs.filter((hub: any) => 
          hub.name.toLowerCase().includes(focus_hub.toLowerCase())
        );
        
        if (hubsToAnalyze.length === 0) {
          return {
            success: false,
            error: `No hub found matching "${focus_hub}". Available hubs: ${topicHubs.map((h: any) => h.name).join(', ')}`,
            gaps: []
          };
        }
      }

      // 3. Analyze each hub for gaps
      const gaps: Array<{
        hubName: string;
        currentSize: number;
        coverage: string;
        gapType: 'under_developed' | 'needs_pillar' | 'needs_supporting' | 'orphan' | 'new_opportunity';
        priority: 'high' | 'medium' | 'low';
        opportunities: string[];
        reasoning: string;
      }> = [];

      hubsToAnalyze.forEach((hub: any) => {
        const hubSize = hub.urlCount;
        const coverage = hub.coverage;

        // Gap Type 1: Under-developed hubs (weak coverage)
        if (coverage === 'Weak' || hubSize < min_hub_size) {
          gaps.push({
            hubName: hub.name,
            currentSize: hubSize,
            coverage,
            gapType: 'under_developed',
            priority: 'high',
            opportunities: [
              `Create 3-5 comprehensive guides covering "${hub.name}" fundamentals`,
              `Develop a pillar page: "Complete Guide to ${hub.name}"`,
              `Add case studies or examples related to ${hub.name}`,
              `Create comparison content: "${hub.name} vs [alternatives]"`,
              `Build how-to content: "How to [action] with ${hub.name}"`
            ],
            reasoning: `Hub has only ${hubSize} page(s). Need minimum ${min_hub_size} to establish topical authority.`
          });
        }

        // Gap Type 2: Moderate hubs that could be stronger
        if (coverage === 'Moderate' && hubSize < 15) {
          const missingCount = 15 - hubSize;
          gaps.push({
            hubName: hub.name,
            currentSize: hubSize,
            coverage,
            gapType: 'needs_supporting',
            priority: 'medium',
            opportunities: [
              `Add ${missingCount} supporting articles to strengthen "${hub.name}" cluster`,
              `Create advanced tutorials for ${hub.name}`,
              `Develop troubleshooting guides for common ${hub.name} issues`,
              `Add industry-specific applications of ${hub.name}`,
              `Create tools/resources pages for ${hub.name}`
            ],
            reasoning: `Hub is established but has room to grow from ${hubSize} to 15+ pages for strong authority.`
          });
        }

        // Gap Type 3: Strong hubs that might need pillar consolidation
        if (coverage === 'Strong' && hubSize >= 15) {
          // Check if there's a clear pillar page
          const hasPillarPattern = hub.sampleUrls?.some((url: string) => 
            url.includes('guide') || url.includes('complete') || url.includes('ultimate')
          );

          if (!hasPillarPattern) {
            gaps.push({
              hubName: hub.name,
              currentSize: hubSize,
              coverage,
              gapType: 'needs_pillar',
              priority: 'medium',
              opportunities: [
                `Create a comprehensive pillar page: "The Complete Guide to ${hub.name}"`,
                `Consolidate ${hubSize} existing pages with internal links to the pillar`,
                `Add a ${hub.name} landing page with topic overview and navigation`,
                `Create a ${hub.name} resource hub aggregating all related content`
              ],
              reasoning: `Hub has ${hubSize} pages but no clear pillar page to tie them together.`
            });
          }
        }
      });

      // 4. Identify potential new hub opportunities
      // Look for single pages that could become hubs
      const orphanHubs = topicHubs.filter((hub: any) => hub.urlCount === 1 || hub.urlCount === 2);
      
      if (orphanHubs.length > 0) {
        orphanHubs.slice(0, 5).forEach((hub: any) => {
          gaps.push({
            hubName: hub.name,
            currentSize: hub.urlCount,
            coverage: 'Weak',
            gapType: 'orphan',
            priority: 'low',
            opportunities: [
              `Decide: Expand "${hub.name}" into a full topic cluster or merge into related hub`,
              `If expanding: Add 5-8 supporting pages around ${hub.name}`,
              `If merging: Integrate ${hub.name} content into a larger related topic`
            ],
            reasoning: `Only ${hub.urlCount} page(s) - not enough to establish authority. Either expand or consolidate.`
          });
        });
      }

      // 5. Suggest completely new hub opportunities
      const establishedHubs = topicHubs.filter((hub: any) => hub.urlCount >= min_hub_size);
      const hubNames = establishedHubs.map((h: any) => h.name.toLowerCase());
      
      // Common complementary topics based on existing hubs
      const suggestNewHubs: string[] = [];
      
      if (hubNames.some((n: string) => n.includes('seo') || n.includes('search'))) {
        if (!hubNames.some((n: string) => n.includes('content'))) suggestNewHubs.push('Content Marketing');
        if (!hubNames.some((n: string) => n.includes('analytics'))) suggestNewHubs.push('Analytics & Data');
      }
      
      if (hubNames.some((n: string) => n.includes('content'))) {
        if (!hubNames.some((n: string) => n.includes('strategy'))) suggestNewHubs.push('Content Strategy');
        if (!hubNames.some((n: string) => n.includes('writing'))) suggestNewHubs.push('Copywriting');
      }

      suggestNewHubs.slice(0, 3).forEach(newHub => {
        gaps.push({
          hubName: newHub,
          currentSize: 0,
          coverage: 'None',
          gapType: 'new_opportunity',
          priority: 'low',
          opportunities: [
            `Launch new "${newHub}" hub with 8-12 foundational pages`,
            `Create pillar content: "Ultimate Guide to ${newHub}"`,
            `Develop beginner, intermediate, and advanced content tiers`,
            `Cross-link with existing hubs for synergy`
          ],
          reasoning: `Potential new topic hub based on your existing content focus. Complements current hubs.`
        });
      });

      // 6. Sort gaps by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      gaps.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      // 7. Generate summary
      const highPriorityCount = gaps.filter(g => g.priority === 'high').length;
      const mediumPriorityCount = gaps.filter(g => g.priority === 'medium').length;
      const totalOpportunities = gaps.reduce((sum, g) => sum + g.opportunities.length, 0);

      return {
        success: true,
        gaps,
        summary: {
          totalGapsFound: gaps.length,
          highPriority: highPriorityCount,
          mediumPriority: mediumPriorityCount,
          lowPriority: gaps.length - highPriorityCount - mediumPriorityCount,
          totalOpportunities,
          focusedOn: focus_hub || 'All hubs',
          analyzedHubs: hubsToAnalyze.length,
          totalHubs: topicHubs.length
        },
        recommendations: [
          highPriorityCount > 0 ? `🔥 ${highPriorityCount} high-priority gap(s) - address these first to build topical authority` : null,
          `Focus on expanding ${gaps.slice(0, 3).map(g => g.hubName).join(', ')} for maximum impact`,
          `${totalOpportunities} specific content opportunities identified across all gaps`
        ].filter(Boolean),
        message: `Analyzed ${hubsToAnalyze.length} topic hub(s) and found ${gaps.length} content gap(s) with ${totalOpportunities} opportunities.`
      };

    } catch (error: any) {
      console.error('[find_topic_gaps] Error:', error);
      return {
        success: false,
        error: error.message,
        gaps: []
      };
    }
  }
});

