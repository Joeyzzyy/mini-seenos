import { tool } from 'ai';
import { z } from 'zod';
import { getValidGSCToken, getGSCPerformance } from '@/lib/google-gsc';

export const gsc_get_performance = tool({
  description: 'Fetch ranking and performance data (clicks, impressions, CTR, position) from Google Search Console for a specific site.',
  parameters: z.object({
    userId: z.string().describe('The ID of the current user'),
    siteUrl: z.string().describe('The URL of the site to fetch data for (e.g., "https://example.com/")'),
    startDate: z.string().describe('Start date for data (YYYY-MM-DD)'),
    endDate: z.string().describe('End date for data (YYYY-MM-DD)'),
    dimensions: z.array(z.enum(['query', 'page', 'country', 'device', 'date']))
      .optional()
      .default(['query', 'page'])
      .describe('Dimensions to group data by'),
  }),
  execute: async ({ userId, siteUrl, startDate, endDate, dimensions }) => {
    try {
      const accessToken = await getValidGSCToken(userId);
      const performanceData = await getGSCPerformance(accessToken, siteUrl, startDate, endDate, dimensions);

      return {
        success: true,
        siteUrl,
        startDate,
        endDate,
        rows: performanceData.rows || [],
        message: performanceData.rows?.length 
          ? `Successfully fetched ${performanceData.rows.length} rows of performance data.`
          : 'No data found for the specified period and site.'
      };
    } catch (error: any) {
      console.error('[gsc_get_performance] Error:', error);
      return { 
        success: false, 
        error: error.message,
        instructions: 'If error says integration not found, call gsc_check_status first.'
      };
    }
  },
});

(gsc_get_performance as any).metadata = {
  name: 'GSC Performance Fetcher',
  provider: 'Google'
};

