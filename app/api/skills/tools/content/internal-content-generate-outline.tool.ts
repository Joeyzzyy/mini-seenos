import { tool } from 'ai';
import { z } from 'zod';

export const generate_outline = tool({
  description: 'Generate a comprehensive content outline with H1, H2, H3 structure.',
  parameters: z.object({
    title: z.string().describe('The H1 title of the content'),
    target_keyword: z.string().describe('Primary keyword to target'),
    content_type: z.enum(['guide', 'blog', 'landing_page', 'comparison', 'listicle']).describe('Type of content to create'),
    sections: z.array(z.object({
      h2: z.string().describe('H2 heading text'),
      subsections: z.array(z.string()).optional().describe('H3 subsection headings'),
      key_points: z.array(z.string()).optional().describe('Key topics to cover'),
      word_count: z.number().optional().describe('Estimated word count for this section'),
    })).describe('Main sections of the content'),
    total_word_count: z.number().optional().describe('Target total word count (default: 2000)'),
    notes: z.string().optional().describe('Additional notes or recommendations'),
  }),
  execute: async (params) => {
    const sectionWordCounts = params.sections.map(s => s.word_count || 300);
    const calculatedTotal = sectionWordCounts.reduce((a, b) => a + b, 0);
    const targetTotal = params.total_word_count || calculatedTotal || 2000;
    return {
      success: true,
      outline: {
        h1: params.title,
        target_keyword: params.target_keyword,
        content_type: params.content_type,
        estimated_word_count: targetTotal,
        sections: params.sections.map(section => ({
          h2: section.h2,
          h3s: section.subsections || [],
          key_points: section.key_points || [],
          word_count: section.word_count || 300,
        })),
        notes: params.notes,
      },
    };
  },
});

(generate_outline as any).metadata = {
  name: 'Generate Outline',
  provider: 'Internal'
};

