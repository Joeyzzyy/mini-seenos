import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const check_topic_duplication = tool({
  description: `Check if proposed topics already exist in the website's content (sitemap + library).

CRITICAL FOR:
- Topic Brainstorming - prevent suggesting existing topics
- Content Planning - avoid self-cannibalization
- SEO Protection - prevent keyword conflicts

HOW IT WORKS:
1. Builds a comprehensive index of existing content (titles, keywords, URL slugs)
2. Checks each proposed topic for:
   - Exact matches
   - Semantic similarity (high overlap)
   - Keyword conflicts
3. Returns detailed conflict reports

OUTPUT:
- Safe topics (no conflicts)
- Conflicting topics (with existing content details)
- Recommendations for each topic`,

  parameters: z.object({
    user_id: z.string().describe('The user ID'),
    proposed_topics: z.array(z.object({
      title: z.string().describe('Proposed topic/page title'),
      keyword: z.string().optional().describe('Target keyword'),
      description: z.string().optional().describe('Brief topic description')
    })).describe('List of proposed topics to check'),
    similarity_threshold: z.number().min(0).max(1).default(0.7).describe('Similarity threshold (0-1). Higher = stricter. Default 0.7')
  }),

  execute: async ({ user_id, proposed_topics, similarity_threshold }) => {
    try {
      // 1. Get sitemap data
      const { data: sitemapContext } = await supabase
        .from('site_contexts')
        .select('content')
        .eq('user_id', user_id)
        .eq('type', 'sitemap')
        .maybeSingle();

      let existingUrls: string[] = [];
      if (sitemapContext?.content) {
        const parsed = JSON.parse(sitemapContext.content);
        existingUrls = parsed.urls || [];
      }

      // 2. Get content library items
      const { data: contentItems } = await supabase
        .from('content_items')
        .select('id, title, slug, target_keyword, page_type, status')
        .eq('user_id', user_id);

      // 3. Build existing content index
      const existingContent: Array<{
        source: 'sitemap' | 'library';
        title: string;
        url?: string;
        keyword?: string;
        id?: string;
        status?: string;
      }> = [];

      // Add sitemap URLs
      existingUrls.forEach(url => {
        try {
          const urlObj = new URL(url);
          const path = urlObj.pathname;
          const slug = path.split('/').filter(Boolean).pop() || '';
          const title = slug.replace(/-/g, ' ').replace(/_/g, ' ');
          
          existingContent.push({
            source: 'sitemap',
            title,
            url,
            keyword: title
          });
        } catch (e) {}
      });

      // Add library items
      if (contentItems) {
        contentItems.forEach(item => {
          existingContent.push({
            source: 'library',
            title: item.title,
            url: `/${item.slug}`,
            keyword: item.target_keyword || undefined,
            id: item.id,
            status: item.status
          });
        });
      }

      // 4. Check each proposed topic
      const results = proposed_topics.map(proposedTopic => {
        const conflicts: Array<{
          source: string;
          title: string;
          url?: string;
          keyword?: string;
          similarity: number;
          conflictType: 'exact_title' | 'exact_keyword' | 'high_similarity' | 'keyword_overlap';
        }> = [];

        const proposedTitle = proposedTopic.title.toLowerCase().trim();
        const proposedKeyword = proposedTopic.keyword?.toLowerCase().trim();
        const proposedWords = new Set(proposedTitle.split(/\s+/).filter(w => w.length > 3));

        existingContent.forEach(existing => {
          const existingTitle = existing.title.toLowerCase().trim();
          const existingKeyword = existing.keyword?.toLowerCase().trim();
          
          // Check 1: Exact title match
          if (existingTitle === proposedTitle) {
            conflicts.push({
              source: existing.source,
              title: existing.title,
              url: existing.url,
              keyword: existing.keyword,
              similarity: 1.0,
              conflictType: 'exact_title'
            });
            return;
          }

          // Check 2: Exact keyword match
          if (proposedKeyword && existingKeyword && proposedKeyword === existingKeyword) {
            conflicts.push({
              source: existing.source,
              title: existing.title,
              url: existing.url,
              keyword: existing.keyword,
              similarity: 1.0,
              conflictType: 'exact_keyword'
            });
            return;
          }

          // Check 3: High word overlap (similarity)
          const existingWords = new Set(existingTitle.split(/\s+/).filter(w => w.length > 3));
          const intersection = new Set([...proposedWords].filter(w => existingWords.has(w)));
          const union = new Set([...proposedWords, ...existingWords]);
          const similarity = union.size > 0 ? intersection.size / union.size : 0;

          if (similarity >= similarity_threshold) {
            conflicts.push({
              source: existing.source,
              title: existing.title,
              url: existing.url,
              keyword: existing.keyword,
              similarity: Math.round(similarity * 100) / 100,
              conflictType: 'high_similarity'
            });
            return;
          }

          // Check 4: Keyword overlap
          if (proposedKeyword && existingTitle.includes(proposedKeyword)) {
            conflicts.push({
              source: existing.source,
              title: existing.title,
              url: existing.url,
              keyword: existing.keyword,
              similarity: 0.5,
              conflictType: 'keyword_overlap'
            });
          }
        });

        // Sort conflicts by severity
        conflicts.sort((a, b) => b.similarity - a.similarity);

        // Determine status
        let status: 'safe' | 'warning' | 'conflict';
        let recommendation: string;

        if (conflicts.length === 0) {
          status = 'safe';
          recommendation = '✅ Topic is unique - safe to create';
        } else if (conflicts.some(c => c.conflictType === 'exact_title' || c.conflictType === 'exact_keyword')) {
          status = 'conflict';
          recommendation = '🚫 High conflict - topic already exists. Choose a different angle or keyword.';
        } else {
          status = 'warning';
          recommendation = '⚠️ Similar content exists - consider differentiating the angle or merging topics.';
        }

        return {
          proposedTopic: proposedTopic.title,
          proposedKeyword: proposedTopic.keyword,
          status,
          conflictCount: conflicts.length,
          conflicts: conflicts.slice(0, 5), // Top 5 conflicts
          recommendation
        };
      });

      // Calculate summary statistics
      const safeCount = results.filter(r => r.status === 'safe').length;
      const warningCount = results.filter(r => r.status === 'warning').length;
      const conflictCount = results.filter(r => r.status === 'conflict').length;

      return {
        success: true,
        results,
        summary: {
          total: proposed_topics.length,
          safe: safeCount,
          warnings: warningCount,
          conflicts: conflictCount,
          existingContentCount: existingContent.length,
          message: `Checked ${proposed_topics.length} topics against ${existingContent.length} existing pieces of content.`
        },
        recommendations: [
          safeCount > 0 ? `${safeCount} topic(s) are safe to create` : null,
          conflictCount > 0 ? `⚠️ ${conflictCount} topic(s) have high conflicts - avoid these or significantly differentiate` : null,
          warningCount > 0 ? `${warningCount} topic(s) have potential overlap - review and consider unique angles` : null
        ].filter(Boolean)
      };

    } catch (error: any) {
      console.error('[check_topic_duplication] Error:', error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }
});

