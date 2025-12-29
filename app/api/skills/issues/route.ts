import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET - Fetch all skill issues
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('skill_issues')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Convert array to object keyed by skill_id for easier frontend access
    const issuesMap: Record<string, any[]> = {};
    data?.forEach((item: any) => {
      if (!issuesMap[item.skill_id]) {
        issuesMap[item.skill_id] = [];
      }
      issuesMap[item.skill_id].push({
        id: item.id,
        text: item.issue_text,
        images: item.image_urls || [],
        isResolved: item.is_resolved || false,
        updatedAt: item.updated_at
      });
    });

    return NextResponse.json({ success: true, issues: issuesMap });
  } catch (error: any) {
    console.error('[GET /api/skills/issues] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, skill_id, issue_text, image_urls, is_resolved } = body;

    if (!skill_id && !id) {
      return NextResponse.json(
        { success: false, error: 'skill_id or id is required' },
        { status: 400 }
      );
    }

    const payload: any = {
      issue_text: issue_text || '',
      image_urls: image_urls || [],
      is_resolved: is_resolved ?? false,
      updated_at: new Date().toISOString(),
    };

    if (id) payload.id = id;
    if (skill_id) payload.skill_id = skill_id;

    // Upsert: insert if not exists, update if exists
    const { data, error } = await supabase
      .from('skill_issues')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[POST /api/skills/issues] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove a skill issue
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('skill_issues')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/skills/issues] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

