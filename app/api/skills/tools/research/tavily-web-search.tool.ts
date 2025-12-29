import { tool } from 'ai';
import { z } from 'zod';

export const web_search = tool({
  description: 'Search the real-time web for current information using Tavily API.',
  parameters: z.object({
    query: z.string().describe('The search query'),
    search_depth: z.enum(['basic', 'advanced']).optional().default('basic'),
    include_domains: z.array(z.string()).optional(),
    exclude_domains: z.array(z.string()).optional(),
  }),
  execute: async ({ query, search_depth, include_domains, exclude_domains }) => {
    try {
      const apiKey = process.env.TAVILY_API_KEY;
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth,
          include_domains,
          exclude_domains,
          max_results: 5,
        }),
      });
      if (!response.ok) throw new Error('Tavily API error');
      const data = await response.json();
      return { success: true, results: data.results };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

(web_search as any).metadata = {
  name: 'Web Search',
  provider: 'Tavily'
};

