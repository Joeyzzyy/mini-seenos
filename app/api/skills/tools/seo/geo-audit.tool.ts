import { tool } from 'ai';
import { z } from 'zod';

export const geo_audit = tool({
  description: 'Perform a Generative Engine Optimization (GEO) audit based on page content. This tool analyzes how AI search engines (like SearchGPT, Perplexity) perceive and cite the content.',
  parameters: z.object({
    url: z.string().describe('The URL of the page being audited'),
    content: z.string().describe('The main content of the page to analyze'),
    page_type: z.enum(['blog', 'product', 'landing']).describe('The type of the page'),
    geo_core_checks: z.array(z.object({
      dimension: z.enum(['context', 'organization', 'reliability', 'exclusivity']),
      checkId: z.string().describe('Check ID (e.g., C01, O02, R03, E04)'),
      checkName: z.string().describe('Short name of the check'),
      status: z.enum(['pass', 'partial', 'fail']),
      message: z.string().describe('Brief explanation of the status'),
      suggestion: z.string().describe('Actionable suggestion for improvement'),
      priority: z.enum(['high', 'medium', 'low'])
    })).describe('Array of 16 GEO CORE check items as defined in the rules'),
    scores: z.object({
      context: z.number().min(0).max(100),
      organization: z.number().min(0).max(100),
      reliability: z.number().min(0).max(100),
      exclusivity: z.number().min(0).max(100),
    }).describe('Scores for each GEO dimension (0-100)')
  }),
  execute: async ({ url, content, page_type, geo_core_checks, scores }) => {
    try {
      // Calculate overall GEO score
      const overall_score = Math.round((scores.context + scores.organization + scores.reliability + scores.exclusivity) / 4);
      
      return {
        success: true,
        url,
        page_type,
        overall_score,
        scores,
        geo_core_checks,
        report_summary: `GEO CORE Audit completed for ${url}. Overall Score: ${overall_score}/100.`
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

(geo_audit as any).metadata = {
  name: 'GEO CORE Auditor',
  provider: 'Internal'
};

