import { tool } from 'ai';
import { z } from 'zod';
import { createServerSupabaseAdmin } from '@/lib/supabase-server';

// Lazy-initialize Supabase client to ensure proxy is configured
let _supabase: ReturnType<typeof createServerSupabaseAdmin> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createServerSupabaseAdmin();
  }
  return _supabase;
}

export const delete_content_item = tool({
  description: 'Permanently delete a content item from the library. REQUIRES USER CONFIRMATION.',
  parameters: z.object({
    id: z.string().uuid().describe('The UUID of the content item to delete'),
  }),
  execute: async ({ id }) => {
    try {
      const { error } = await getSupabase()
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

