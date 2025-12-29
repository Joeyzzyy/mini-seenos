import { getServiceSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const supabase = getServiceSupabase();

  try {
    const { data: item, error } = await supabase
      .from('content_items')
      .select('generated_content, title')
      .eq('id', id)
      .single();

    if (error || !item) {
      return new Response('Page not found', { status: 404 });
    }

    if (!item.generated_content) {
      return new Response('Page content not yet generated', { status: 400 });
    }

    // Return the raw HTML content with the correct content-type
    return new Response(item.generated_content, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // Add some basic security headers but allow rendering
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('Preview error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

