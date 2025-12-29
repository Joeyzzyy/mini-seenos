import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Use a private service role client for backend tools to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Supabase Site Context Save Tool
 * Saves or updates site-wide context (like sitemap, logo, header, footer) in the database.
 */
export const save_site_context = tool({
  description: 'Save or update site-wide context (sitemap, header, footer, meta) in the database.',
  parameters: z.object({
    userId: z.string().describe('The ID of the user (pass your Current User ID here)'),
    type: z.enum(['logo', 'header', 'footer', 'meta', 'sitemap']).describe('Type of context being saved'),
    content: z.string().optional().describe('Text content (e.g., sitemap URLs as JSON string, or code snippets)'),
    fileUrl: z.string().optional().describe('URL to a file (e.g., logo image URL)'),
  }),
  execute: async ({ userId, type, content, fileUrl }) => {
    try {
      console.log(`[save_site_context] Saving ${type} for user ${userId}`);
      
      // First try to get existing record
      const { data: existing, error: fetchError } = await supabase
        .from('site_contexts')
        .select('id')
        .eq('user_id', userId)
        .eq('type', type)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let result;
      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('site_contexts')
          .update({
            content: content || null,
            file_url: fileUrl || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('site_contexts')
          .insert({
            user_id: userId,
            type,
            content: content || null,
            file_url: fileUrl || null,
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      return {
        success: true,
        message: `Successfully saved ${type} context.`,
        contextId: result.id
      };
    } catch (error: any) {
      console.error('[save_site_context] Error:', error);
      return { 
        success: false, 
        error: error.message,
        details: 'If you see a constraint error, please ensure the database update script has been run.'
      };
    }
  },
});

