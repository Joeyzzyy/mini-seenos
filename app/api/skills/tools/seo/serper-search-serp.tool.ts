import { tool } from 'ai';
import { z } from 'zod';

export const search_serp = tool({
  description: 'Search Google SERP results using Serper API.',
  parameters: z.object({
    query: z.string().describe('The search query'),
    num: z.number().optional().default(10).describe('Number of results to return'),
  }),
    execute: async ({ query, num }) => {
    try {
      const apiKey = 'f946b544b7021701d8ccc5efa7df7e029cde4d0e';
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: query, num }),
      });
      if (!response.ok) throw new Error('Serper API request failed');
      const data = await response.json();
      return { 
        success: true, 
        organic: data.organic || [],
        peopleAlsoAsk: data.peopleAlsoAsk || [],
        answerBox: data.answerBox || null,
        relatedSearches: data.relatedSearches || []
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

(search_serp as any).metadata = {
  name: 'SERP Search',
  provider: 'Serper'
};

