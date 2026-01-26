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

export const delete_content_project = tool({
  description: 'Permanently delete a topic cluster (project). By default, this will also delete all items within the cluster.',
  parameters: z.object({
    id: z.string().uuid().describe('The UUID of the project/cluster to delete'),
    cascade: z.boolean().default(true).describe('Whether to delete all associated content items. Highly recommended.'),
  }),
  execute: async ({ id, cascade }) => {
    try {
      if (cascade) {
        // Delete items first
        await getSupabase().from('content_items').delete().eq('project_id', id);
      }
      
      const { error } = await getSupabase()
        .from('content_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, id, message: 'Project and its items deleted successfully' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});

