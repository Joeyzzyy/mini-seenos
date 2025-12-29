import { tool } from 'ai';
import { z } from 'zod';

export const extract_content = tool({
  description: 'Extract main content, headings, and metadata from a specific URL.',
  parameters: z.object({
    url: z.string().describe('The URL to extract content from'),
  }),
  execute: async ({ url }) => {
    try {
      const apiKey = process.env.TAVILY_API_KEY;
      const response = await fetch('https://api.tavily.com/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey, urls: [url] }),
      });
      if (!response.ok) throw new Error('Tavily Extract API error');
      const data = await response.json();
      return { success: true, content: data.results[0] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

(extract_content as any).metadata = {
  name: 'Extract Content',
  provider: 'Tavily'
};

