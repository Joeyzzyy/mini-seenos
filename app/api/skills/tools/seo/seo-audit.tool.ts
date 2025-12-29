import { tool } from 'ai';
import { z } from 'zod';

export const seo_audit = tool({
  description: 'Perform a professional SEO EEAT (Experience, Expertise, Authoritativeness, Trustworthiness) audit based on page content. This tool should be used to generate a detailed SEO report with 20+ specific check items.',
  parameters: z.object({
    url: z.string().describe('The URL of the page being audited'),
    content: z.string().describe('The main content of the page to analyze'),
    page_type: z.enum(['blog', 'landing', 'product', 'news', 'other']).describe('The type of the page'),
    content_type: z.enum(['product-review', 'guide', 'tutorial', 'comparison', 'news', 'listicle', 'other']).describe('The specific content type'),
    eeat_checks: z.array(z.object({
      dimension: z.enum(['experience', 'expertise', 'authority', 'trust']),
      checkId: z.string().describe('Check ID (e.g., E01, A02, T03)'),
      checkName: z.string().describe('Short name of the check'),
      status: z.enum(['pass', 'partial', 'fail']),
      message: z.string().describe('Brief explanation of the status'),
      suggestion: z.string().describe('Actionable suggestion for improvement'),
      priority: z.enum(['high', 'medium', 'low'])
    })).describe('Array of 20 EEAT check items as defined in the rules'),
    scores: z.object({
      experience: z.number().min(0).max(100),
      expertise: z.number().min(0).max(100),
      authority: z.number().min(0).max(100),
      trust: z.number().min(0).max(100),
    }).describe('Scores for each EEAT dimension (0-100)')
  }),
  execute: async ({ url, content, page_type, content_type, eeat_checks, scores }) => {
    try {
      // Calculate overall score
      const overall_score = Math.round((scores.experience + scores.expertise + scores.authority + scores.trust) / 4);
      
      return {
        success: true,
        url,
        page_type,
        content_type,
        overall_score,
        scores,
        eeat_checks,
        report_summary: `SEO EEAT Audit completed for ${url}. Overall Score: ${overall_score}/100.`
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

(seo_audit as any).metadata = {
  name: 'SEO EEAT Auditor',
  provider: 'Internal'
};

