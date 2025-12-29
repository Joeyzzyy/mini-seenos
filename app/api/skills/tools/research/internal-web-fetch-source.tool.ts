import { tool } from 'ai';
import { z } from 'zod';

/**
 * Internal Web Fetch Source Tool
 * Specifically for retrieving raw HTML source code to analyze CSS, structure, and scripts.
 */

export const fetch_raw_source = tool({
  description: 'Fetch the raw HTML source code of a webpage for deep technical analysis (CSS, JS, DOM structure).',
  parameters: z.object({
    url: z.string().url().describe('The full URL of the webpage to fetch source from'),
    max_length: z.number().optional().default(50000).describe('Max characters to return to prevent context overflow'),
  }),
  execute: async ({ url, max_length }) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,webp,image/apng,*/*;q=0.8',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      let html = await response.text();
      
      const originalLength = html.length;
      if (html.length > max_length) {
        // Keep the head and the first part of the body
        const headMatch = html.match(/<head[^>]*>[\s\S]*?<\/head>/i);
        const headContent = headMatch ? headMatch[0] : '';
        const remainingLength = max_length - headContent.length;
        
        if (remainingLength > 0) {
          html = headContent + "\n\n<!-- Content truncated ... -->\n\n" + html.slice(html.indexOf('</head>') + 7, html.indexOf('</head>') + 7 + remainingLength);
        } else {
          html = headContent + "\n\n<!-- Content truncated ... -->";
        }
      }

      return {
        success: true,
        url,
        contentLength: originalLength,
        returnedLength: html.length,
        isTruncated: originalLength > max_length,
        html: html,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.name === 'AbortError' ? 'Request timed out' : error.message,
      };
    }
  },
});

