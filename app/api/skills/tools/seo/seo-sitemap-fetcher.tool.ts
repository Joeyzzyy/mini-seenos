import { tool } from 'ai';
import { z } from 'zod';

/**
 * SEO Sitemap Fetcher Tool
 * Fetches and parses a website's sitemap.xml to extract URLs using Regex to avoid dependencies.
 */
export const fetch_sitemap_urls = tool({
  description: 'Fetch and parse a website sitemap.xml to extract URLs for site architecture analysis.',
  parameters: z.object({
    url: z.string().describe('The website root URL or direct sitemap URL (e.g., https://example.com/sitemap.xml)'),
    max_urls: z.number().optional().default(500).describe('Maximum number of URLs to extract to prevent context overflow.'),
  }),
  execute: async ({ url, max_urls }) => {
    try {
      let sitemapUrl = url;
      if (!url.toLowerCase().endsWith('.xml')) {
        // Try common sitemap location if only domain is provided
        const base = url.replace(/\/$/, '');
        sitemapUrl = `${base}/sitemap.xml`;
      }

      const response = await fetch(sitemapUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch sitemap from ${sitemapUrl}. Status: ${response.status}. Please check if the URL is correct or try providing the direct XML path.`);
      }

      const xmlData = await response.text();
      
      // Simple Regex to extract <loc> contents
      const locRegex = /<loc>(.*?)<\/loc>/g;
      let match;
      const urls: string[] = [];
      
      while ((match = locRegex.exec(xmlData)) !== null) {
        const loc = match[1].trim();
        // Skip sitemap index files if they appear inside
        if (!loc.toLowerCase().endsWith('.xml')) {
          urls.push(loc);
        } else if (urls.length === 0 && loc.toLowerCase().includes('sitemap')) {
           // If we found XMLs but no regular URLs yet, it might be a sitemap index
           // We'll collect them just in case
           urls.push(loc);
        }
      }

      if (urls.length === 0) {
        return { success: false, error: 'No URLs found in the sitemap content. It might be empty or using an unsupported format.' };
      }

      // Check if it's a sitemap index
      const isIndex = urls.every(u => u.toLowerCase().endsWith('.xml'));
      if (isIndex) {
        return {
          success: false,
          error: 'This is a sitemap index containing multiple sub-sitemaps. Please provide a direct link to a specific sitemap.xml (e.g., sitemap-posts.xml).',
          sitemap_index_urls: urls
        };
      }

      const totalFound = urls.length;
      if (totalFound > max_urls) {
        return {
          success: false,
          error: `Sitemap contains ${totalFound} URLs, which exceeds the safety limit of ${max_urls}. Please manually provide a smaller subset or a more specific sitemap.`,
          total_found: totalFound
        };
      }

      // Simple categorization based on URL path
      const categorized = urls.reduce((acc: any, urlStr: string) => {
        try {
          const path = new URL(urlStr).pathname;
          const segments = path.split('/').filter(Boolean);
          const category = segments.length > 0 ? segments[0] : 'root';
          if (!acc[category]) acc[category] = [];
          acc[category].push(urlStr);
        } catch (e) {
          if (!acc['others']) acc['others'] = [];
          acc['others'].push(urlStr);
        }
        return acc;
      }, {});

      return {
        success: true,
        url: sitemapUrl,
        total_urls: urls.length,
        categories: Object.keys(categorized).map(cat => ({
          name: cat,
          count: categorized[cat].length,
          urls: categorized[cat].slice(0, 5) // Sample
        })),
        all_urls: urls
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});
