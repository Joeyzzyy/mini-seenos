import { NextResponse } from 'next/server';
import { createServerSupabaseAdmin } from '@/lib/supabase-server';

/**
 * PATCH /api/content/items
 * Update a content item's generated_content (for theme color changes, etc.)
 * 
 * Body:
 * - item_id: string (required)
 * - generated_content: string (required)
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { item_id, generated_content } = body;
    
    if (!item_id || !generated_content) {
      return NextResponse.json({ error: 'item_id and generated_content are required' }, { status: 400 });
    }
    
    const supabase = createServerSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('content_items')
      .update({ 
        generated_content,
        updated_at: new Date().toISOString()
      })
      .eq('id', item_id)
      .select('id, updated_at')
      .single();
    
    if (error) {
      console.error('[API] Failed to update content item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, item: data });
  } catch (error: any) {
    console.error('[API] Error in content items PATCH:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/content/items
 * Fetch content items for a user (using service role to bypass RLS)
 * 
 * Query params:
 * - user_id: string (required)
 * - project_id: string (optional) - SEO project ID (domain) to filter by
 * - content_project_id: string (optional) - Topic Cluster (content_project) ID to filter by
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const seoProjectId = searchParams.get('project_id'); // SEO project (domain)
    const contentProjectId = searchParams.get('content_project_id'); // Topic Cluster
    
    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }
    
    // Use service role client to bypass RLS
    const supabase = createServerSupabaseAdmin();
    
    let query = supabase
      .from('content_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    // Filter by SEO project (seo_project_id)
    if (seoProjectId) {
      query = query.eq('seo_project_id', seoProjectId);
    }
    
    // Filter by Topic Cluster (content_project.id)
    if (contentProjectId) {
      query = query.eq('project_id', contentProjectId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('[API] Failed to fetch content items:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ items: data });
  } catch (error: any) {
    console.error('[API] Error in content items route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
