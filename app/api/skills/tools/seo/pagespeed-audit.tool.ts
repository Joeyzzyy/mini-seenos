import { tool } from 'ai';
import { z } from 'zod';

export const pagespeed_audit = tool({
  description: 'Get real-world performance metrics (Core Web Vitals) and Lab Data from Google PageSpeed Insights.',
  parameters: z.object({
    url: z.string().url().describe('The URL to audit for speed'),
    strategy: z.enum(['mobile', 'desktop']).optional().default('mobile').describe('Device strategy to use'),
  }),
  execute: async ({ url, strategy }) => {
    try {
      const apiKey = process.env.GOOGLE_CLIENT_ID ? '' : ''; // Use key if available, else public
      const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;
      
      const response = await fetch(psiUrl);
      if (!response.ok) throw new Error(`PageSpeed API Error: ${response.status}`);
      
      const data = await response.json();
      const audit = data.lighthouseResult.audits;
      
      return {
        success: true,
        url,
        strategy,
        metrics: {
          performance_score: data.lighthouseResult.categories.performance.score * 100,
          lcp: audit['largest-contentful-paint'].displayValue,
          cls: audit['cumulative-layout-shift'].displayValue,
          fcp: audit['first-contentful-paint'].displayValue,
          speed_index: audit['speed-index'].displayValue,
          interactive: audit['interactive'].displayValue,
        },
        recommendations: Object.values(audit)
          .filter((a: any) => a.score !== null && a.score < 0.9 && a.details?.type === 'opportunity')
          .slice(0, 5)
          .map((a: any) => ({
            title: a.title,
            description: a.description,
            savings: a.details?.overallSavingsMs || a.details?.overallSavingsBytes,
          })),
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

(pagespeed_audit as any).metadata = {
  name: 'PageSpeed Auditor',
  provider: 'Google'
};

