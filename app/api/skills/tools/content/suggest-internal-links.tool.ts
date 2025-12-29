import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const suggest_internal_links = tool({
  description: 'Search the content library for existing pages that are relevant to the current topic for internal linking.',
  parameters: z.object({
    user_id: z.string().describe('The ID of the user'),
    item_id: z.string().describe('The ID of the current page being written (formerly current_item_id)'),
    keywords: z.array(z.string()).describe('Keywords from the current content to find relevant matches'),
  }),
  execute: async ({ user_id, item_id, keywords }) => {
    const current_item_id = item_id;
    try {
      // 1. Get existing content items from library
      let dbQuery = supabase
        .from('content_items')
        .select('id, title, slug, target_keyword, page_type')
        .eq('user_id', user_id)
        .in('status', ['generated', 'published', 'ready']);

      // Only add neq if current_item_id is a valid UUID to avoid Postgres error
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(current_item_id);
      if (isUuid) {
        dbQuery = dbQuery.neq('id', current_item_id);
      }

      const { data: items, error } = await dbQuery;
      if (error) throw error;

      // 2. Get sitemap context from site_contexts table
      const { data: sitemapContext } = await supabase
        .from('site_contexts')
        .select('content')
        .eq('user_id', user_id)
        .eq('type', 'sitemap')
        .maybeSingle();

      let sitemapUrls: string[] = [];
      if (sitemapContext?.content) {
        try {
          const parsed = JSON.parse(sitemapContext.content);
          // Handle both old array format and new structured object format
          sitemapUrls = Array.isArray(parsed) ? parsed : (parsed.urls || []);
        } catch (e) {
          console.error('Failed to parse sitemap JSON context', e);
        }
      }

      // Filter out the current URL if it's in the sitemap list
      const filteredSitemapUrls = sitemapUrls.filter(url => url !== current_item_id);

      // Combine and score
      const candidates = [
        ...(items || []).map(item => ({
          title: item.title,
          url: `/${item.slug}`,
          keyword: item.target_keyword,
          id: item.id,
          type: 'library'
        })),
        ...filteredSitemapUrls.map(url => {
          // Extract a potential title from the URL slug
          let title = 'Page';
          try {
            const urlObj = new URL(url);
            const path = urlObj.pathname;
            const slug = path.split('/').filter(Boolean).pop() || 'Home';
            title = slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          } catch (e) {}
          
          return {
            title,
            url,
            keyword: title, // Fallback keyword
            id: url,
            type: 'sitemap'
          };
        })
      ];

      // Simple keyword matching for relevance
      const relevantLinks = candidates
        .map(item => {
          let score = 0;
          const contentStr = `${item.title} ${item.keyword}`.toLowerCase();
          keywords.forEach(kw => {
            if (contentStr.includes(kw.toLowerCase())) score++;
          });
          return { ...item, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      return {
        success: true,
        links: relevantLinks.map(l => ({
          title: l.title,
          url: l.url,
          keyword: l.keyword,
          source: l.type,
          item_id: l.type === 'library' ? l.id : null
        })),
        message: relevantLinks.length > 0 
          ? `Found ${relevantLinks.length} relevant internal link candidates (from library and sitemap).` 
          : "No relevant internal links found."
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

