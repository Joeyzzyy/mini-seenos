import { tool } from 'ai';
import { z } from 'zod';
import { fetch as undiciFetch, ProxyAgent } from 'undici';

// Create proxy agent if configured
function getProxyAgent(): ProxyAgent | undefined {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (proxyUrl) {
    return new ProxyAgent(proxyUrl);
  }
  return undefined;
}

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
      
      if (!apiKey) {
        return { 
          success: false, 
          error: 'TAVILY_API_KEY not configured in environment variables' 
        };
      }
      
      // Use undici fetch with proxy support
      const proxyAgent = getProxyAgent();
      if (proxyAgent) {
        console.log(`[tavily_search] Using proxy`);
      }
      
      const fetchOptions: any = {
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
      };
      
      // Add proxy dispatcher if available
      if (proxyAgent) {
        fetchOptions.dispatcher = proxyAgent;
      }
      
      // Set timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      fetchOptions.signal = controller.signal;
      
      const response = await undiciFetch('https://api.tavily.com/search', fetchOptions);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[tavily_search] API error: ${response.status} - ${errorText}`);
        throw new Error(`Tavily API error: ${response.status}`);
      }
      
      const data = await response.json() as { results?: unknown[] };
      return { success: true, results: data.results };
    } catch (error: any) {
      console.error('[tavily_search] Error:', error.message);
      return { success: false, error: error.message };
    }
  },
});

(web_search as any).metadata = {
  name: 'Web Search',
  provider: 'Tavily'
};

