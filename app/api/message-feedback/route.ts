import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messageId, userId, conversationId, feedbackType, reason, messageContent } = body;

    // Validate required fields
    if (!messageId || !userId || !conversationId || !feedbackType || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate feedbackType
    if (feedbackType !== 'like' && feedbackType !== 'dislike') {
      return NextResponse.json(
        { error: 'Invalid feedback type. Must be "like" or "dislike"' },
        { status: 400 }
      );
    }

    // Validate reason is not empty
    if (!reason.trim()) {
      return NextResponse.json(
        { error: 'Reason cannot be empty' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Check if feedback already exists for this user and message
    const { data: existingFeedback } = await supabase
      .from('message_feedback')
      .select('id')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .single();

    if (existingFeedback) {
      // If exists, update feedback
      const { data, error } = await supabase
        .from('message_feedback')
        .update({
          feedback_type: feedbackType,
          reason: reason.trim(),
          message_content: messageContent || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingFeedback.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, feedback: data });
    } else {
      // If not exists, create new feedback
      const { data, error } = await supabase
        .from('message_feedback')
        .insert({
          message_id: messageId,
          user_id: userId,
          conversation_id: conversationId,
          feedback_type: feedbackType,
          reason: reason.trim(),
          message_content: messageContent || null,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, feedback: data });
    }
  } catch (error: any) {
    console.error('Failed to save message feedback:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save feedback' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get('messageId');
    const userId = searchParams.get('userId');

    if (!messageId) {
      return NextResponse.json(
        { error: 'messageId is required' },
        { status: 400 }
      );
    }

    // Validate messageId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(messageId)) {
      // Return empty result for non-UUID messageIds (like "msg-xxx" or "error-xxx")
      return NextResponse.json({ feedback: null });
    }

    const supabase = getServiceSupabase();

    if (userId) {
      // Get specific user's feedback
      const { data, error } = await supabase
        .from('message_feedback')
        .select('*')
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return NextResponse.json({ feedback: data || null });
    } else {
      // Get all feedbacks (for admin analysis)
      const { data, error } = await supabase
        .from('message_feedback')
        .select('*')
        .eq('message_id', messageId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ feedbacks: data || [] });
    }
  } catch (error: any) {
    console.error('Failed to get message feedback:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get feedback' },
      { status: 500 }
    );
  }
}

