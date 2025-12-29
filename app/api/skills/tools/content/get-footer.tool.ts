import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const get_footer = tool({
  description: `Retrieve the user's saved site footer HTML.
  
This tool fetches the custom footer HTML that should be inserted at the bottom of generated pages.

Returns:
- success: boolean
- footer: string (the HTML content) or null if not set
- message: status message

Use this tool BEFORE merging the final HTML to get the footer component.`,
  parameters: z.object({
    user_id: z.string().describe('The user ID to fetch footer for'),
  }),
  execute: async ({ user_id }) => {
    try {
      const { data, error } = await supabase
        .from('site_contexts')
        .select('content')
        .eq('user_id', user_id)
        .eq('type', 'footer')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return {
            success: true,
            footer: null,
            message: 'No footer configured for this user'
          };
        }
        throw error;
      }

      return {
        success: true,
        footer: data?.content || null,
        message: data?.content ? 'Footer found' : 'Footer is empty'
      };
    } catch (error: any) {
      console.error('[get_footer] Error:', error);
      return {
        success: false,
        footer: null,
        error: error.message
      };
    }
  },
});

