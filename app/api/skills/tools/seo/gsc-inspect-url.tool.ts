import { tool } from 'ai';
import { z } from 'zod';
import { getValidGSCToken, inspectGSCUrl } from '@/lib/google-gsc';

export const gsc_inspect_url = tool({
  description: 'Inspect a specific URL to get its current indexing status on Google Search (e.g., if it is indexed, has errors, or is mobile-friendly).',
  parameters: z.object({
    userId: z.string().describe('The ID of the current user'),
    siteUrl: z.string().describe('The property URL as defined in GSC (e.g., "sc-domain:example.com" or "https://example.com/")'),
    inspectionUrl: z.string().describe('The full URL to inspect (must be part of the siteUrl property)'),
  }),
  execute: async ({ userId, siteUrl, inspectionUrl }) => {
    try {
      const accessToken = await getValidGSCToken(userId);
      const data = await inspectGSCUrl(accessToken, siteUrl, inspectionUrl);

      return {
        success: true,
        inspectionUrl,
        inspectionResult: data.inspectionResult || {},
        message: `Successfully inspected ${inspectionUrl}.`
      };
    } catch (error: any) {
      console.error('[gsc_inspect_url] Error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },
});

(gsc_inspect_url as any).metadata = {
  name: 'GSC URL Inspector',
  provider: 'Google'
};

