import { tool } from 'ai';
import { z } from 'zod';

export const tech_audit = tool({
  description: 'Perform a deep technical SEO infrastructure audit on a page (Robots, Sitemaps, Canonical, Redirects, and Speed signals).',
  parameters: z.object({
    url: z.string().describe('The URL to perform technical audit on'),
    html: z.string().describe('The raw HTML source of the page'),
  }),
  execute: async ({ url, html }) => {
    // This is a specialized tech auditor logic
    const results = {
      infrastructure: {
        has_robots: html.includes('robots.txt'),
        has_sitemap: html.includes('sitemap.xml'),
        canonical_tag: html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1] || 'Missing',
        is_https: url.startsWith('https'),
      },
      head_tags: {
        charset: html.includes('charset="UTF-8"') || html.includes('charset=utf-8'),
        viewport: html.includes('name="viewport"'),
      },
      performance_signals: {
        image_count: (html.match(/<img/g) || []).length,
        images_missing_alt: (html.match(/<img(?![^>]*alt=)[^>]*>/g) || []).length,
        script_count: (html.match(/<script/g) || []).length,
        inline_style_size: (html.match(/style="[^"]*"/g) || []).join('').length,
      },
      schema_org: {
        has_json_ld: html.includes('application/ld+json'),
        json_ld_count: (html.match(/application\/ld\+json/g) || []).length,
      }
    };

    return {
      success: true,
      url,
      audit: results,
      message: 'Technical infrastructure audit completed.'
    };
  },
});

(tech_audit as any).metadata = {
  name: 'Technical SEO Auditor',
  provider: 'System'
};

