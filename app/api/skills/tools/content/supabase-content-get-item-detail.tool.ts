import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const get_content_item_detail = tool({
  description: 'Fetch the full details of a planned content item, including its outline and SEO data.',
  parameters: z.object({
    item_id: z.string().describe('The ID of the content item'),
  }),
  execute: async ({ item_id }) => {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', item_id)
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

