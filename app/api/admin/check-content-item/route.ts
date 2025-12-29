import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');

    const supabase = getServiceSupabase();

    if (title) {
      // Search by title
      const { data, error } = await supabase
        .from('content_items')
        .select('id, title, page_type, target_keyword, status, created_at')
        .ilike('title', `%${title}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return NextResponse.json({
        success: true,
        count: data?.length || 0,
        items: data || []
      });
    }

    // Get all items with their page_type
    const { data, error } = await supabase
      .from('content_items')
      .select('id, title, page_type, target_keyword, status, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      items: data || []
    });

  } catch (error: any) {
    console.error('[check-content-item] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

