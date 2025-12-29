import { tool } from 'ai';
import { z } from 'zod';

export const check_http_status = tool({
  description: 'Check the HTTP status codes and redirect chains for a list of URLs to identify broken links (404) or redirect issues.',
  parameters: z.object({
    urls: z.array(z.string().url()).describe('The list of URLs to check status for'),
  }),
  execute: async ({ urls }) => {
    const results = await Promise.all(urls.slice(0, 15).map(async (url) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout per link

        const response = await fetch(url, {
          method: 'HEAD',
          redirect: 'follow',
          signal: controller.signal,
        });
        clearTimeout(timeout);

        return {
          url,
          status: response.status,
          ok: response.ok,
          redirected: response.redirected,
        };
      } catch (error: any) {
        return {
          url,
          status: 0,
          ok: false,
          error: error.message
        };
      }
    }));

    return {
      success: true,
      results,
      summary: {
        total: results.length,
        broken: results.filter(r => !r.ok).length,
        redirects: results.filter(r => r.redirected).length,
      }
    };
  },
});

(check_http_status as any).metadata = {
  name: 'HTTP Status Checker',
  provider: 'System'
};

