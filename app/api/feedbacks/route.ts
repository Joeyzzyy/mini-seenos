import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();

    // Get all feedbacks
    const { data: feedbacks, error: feedbackError } = await supabase
      .from('message_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (feedbackError) throw feedbackError;

    if (!feedbacks || feedbacks.length === 0) {
      return NextResponse.json({ feedbacks: [], conversations: {}, users: {} });
    }

    // Get conversation info
    const conversationIds = [...new Set(feedbacks.map(f => f.conversation_id))];
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id, title')
      .in('id', conversationIds);

    if (convError) throw convError;

    // Get user info from auth.users (requires service role)
    const userIds = [...new Set(feedbacks.map(f => f.user_id))];
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) throw userError;

    // Filter to only the users we need
    const relevantUsers = users.filter(u => userIds.includes(u.id));

    // Build maps
    const conversationMap: Record<string, { id: string; title: string }> = {};
    conversations?.forEach(conv => {
      conversationMap[conv.id] = conv;
    });

    const userMap: Record<string, { id: string; email: string }> = {};
    relevantUsers.forEach(u => {
      userMap[u.id] = { id: u.id, email: u.email || 'Unknown' };
    });

    return NextResponse.json({
      feedbacks,
      conversations: conversationMap,
      users: userMap,
    });
  } catch (error: any) {
    console.error('Failed to get feedbacks:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get feedbacks' },
      { status: 500 }
    );
  }
}

