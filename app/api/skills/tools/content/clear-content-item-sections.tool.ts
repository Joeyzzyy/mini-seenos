import { tool } from 'ai';
import { z } from 'zod';
import { clearSections } from '@/lib/section-storage';

/**
 * Clear all saved sections for a content item.
 * 
 * Use this at the START of a regeneration to ensure a clean slate.
 * This prevents old sections from being mixed with new ones.
 */
export const clear_content_item_sections = tool({
  description: `Clear all previously saved sections for a content item.

⚠️ IMPORTANT: Call this tool at the START of any REGENERATION workflow!

This tool:
1. Deletes all saved sections (hero, comparison, faq, cta, product cards, etc.)
2. Deletes all product research data
3. Ensures a completely fresh start for page generation

When to use:
- ALWAYS at the start of a REGENERATE request
- Before generating new sections when you want to start fresh
- To clean up failed/partial generations

After calling this, proceed with the full page generation workflow.`,
  parameters: z.object({
    content_item_id: z.string().describe('The content item ID to clear sections for'),
  }),
  execute: async ({ content_item_id }) => {
    console.log(`[clear_content_item_sections] Clearing all sections for content item: ${content_item_id}`);
    
    const result = await clearSections(content_item_id);
    
    if (!result.success) {
      return {
        success: false,
        error: 'Failed to clear sections',
        content_item_id,
      };
    }
    
    return {
      success: true,
      content_item_id,
      sections_deleted: result.deleted,
      message: `Cleared ${result.deleted} sections. Ready for fresh page generation.`,
    };
  },
});
