import { tool } from 'ai';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

export const delete_content_item = tool({
  description: 'Permanently delete a content item from the library. REQUIRES USER CONFIRMATION.',
  parameters: z.object({
    id: z.string().uuid().describe('The UUID of the content item to delete'),
  }),
  execute: async ({ id }) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, id, message: 'Content item deleted successfully' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

