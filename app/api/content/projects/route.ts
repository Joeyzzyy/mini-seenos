import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/content/projects
 * Fetch content projects (Topic Clusters) for a user (using service role to bypass RLS)
 * 
 * Query params:
 * - user_id: string (required)
 * - project_id: string (optional) - filter by SEO project (conversation) ID
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const seoProjectId = searchParams.get('project_id'); // SEO project (conversation) ID
    
    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }
    
    // Use service role client to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    let query = supabase
      .from('content_projects')
      .select('*')
      .eq('user_id', userId);
    
    // Filter by SEO project ID if provided
    if (seoProjectId) {
      query = query.eq('seo_project_id', seoProjectId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('[API] Failed to fetch content projects:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ projects: data });
  } catch (error: any) {
    console.error('[API] Error in content projects route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
