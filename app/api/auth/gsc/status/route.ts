import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getGSCAuthUrl } from '@/lib/google-gsc';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('conversationId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const { data: integration, error } = await supabase
      .from('gsc_integrations')
      .select('authorized_sites')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!integration) {
      const state = Buffer.from(JSON.stringify({ userId, conversationId })).toString('base64');
      const authUrl = getGSCAuthUrl(state);
      return NextResponse.json({ 
        isAuthorized: false, 
        authUrl 
      });
    }

    return NextResponse.json({
      isAuthorized: true,
      sites: integration.authorized_sites || [],
    });
  } catch (error) {
    console.error('[GSC Status] Error:', error);
    return NextResponse.json({ error: 'Failed to check GSC status' }, { status: 500 });
  }
}

