import { tool } from 'ai';
import { z } from 'zod';

export const analyze_serp_structure = tool({
  description: 'Analyze HTML structure of top SERP results to extract headings.',
  parameters: z.object({
    query: z.string().describe('The search query to analyze'),
    top_n: z.number().optional().default(3).describe('Number of top results to analyze'),
  }),
  execute: async ({ query, top_n }) => {
    try {
      const serperApiKey = process.env.SERPER_API_KEY;
      if (!serperApiKey) {
        return { success: false, error: 'SERPER_API_KEY not configured' };
      }
      const serpRes = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': serperApiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: query, num: top_n }),
      });
      if (!serpRes.ok) throw new Error('Serper API failed');
      const serpData = await serpRes.json();
      const organicResults = serpData.organic || [];
      const results = await Promise.all(organicResults.slice(0, top_n).map(async (res: any) => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);
          const fetchRes = await fetch(res.link, { signal: controller.signal });
          clearTimeout(timeout);
          const html = await fetchRes.text();
          const h1Regex = /<h1[^>]*>(.*?)<\/h1>/gis;
          const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gis;
          const h1s: string[] = [];
          const h2s: string[] = [];
          let match;
          while ((match = h1Regex.exec(html)) !== null) h1s.push(match[1].replace(/<[^>]*>/g, '').trim());
          while ((match = h2Regex.exec(html)) !== null) h2s.push(match[1].replace(/<[^>]*>/g, '').trim());
          return { title: res.title, link: res.link, headings: { h1: h1s, h2: h2s } };
        } catch (e) { return { title: res.title, link: res.link, error: 'Failed to fetch content' }; }
      }));
      return { success: true, query, results };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

(analyze_serp_structure as any).metadata = {
  name: 'SERP Analyzer',
  provider: 'Serper'
};

