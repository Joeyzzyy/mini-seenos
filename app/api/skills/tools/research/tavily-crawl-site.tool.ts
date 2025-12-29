import { tool } from 'ai';
import { z } from 'zod';

export const crawl_site = tool({
  description: 'Crawl a website to find relevant pages for a specific topic.',
  parameters: z.object({
    url: z.string().describe('The base URL to crawl'),
    topic: z.string().describe('The topic to look for'),
  }),
  execute: async ({ url, topic }) => {
    try {
      const apiKey = process.env.TAVILY_API_KEY;
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          query: `${topic} site:${url}`,
          search_depth: 'advanced',
          max_results: 10,
        }),
      });
      if (!response.ok) throw new Error('Tavily Search API error during crawl');
      const data = await response.json();
      return { success: true, pages: data.results };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

(crawl_site as any).metadata = {
  name: 'Crawl Site',
  provider: 'Tavily'
};

