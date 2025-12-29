import { NextResponse } from 'next/server';
import { exchangeCodeForTokens, listGSCSites } from '@/lib/google-gsc';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.json({ error: `Google OAuth error: ${error}` }, { status: 400 });
    }

    if (!code || !state) {
      return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
    }

    // Decode state
    const { userId, conversationId } = JSON.parse(Buffer.from(state, 'base64').toString());

    if (!userId) {
      return NextResponse.json({ error: 'Invalid state: missing userId' }, { status: 400 });
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    const expiryDate = Date.now() + (tokens.expires_in * 1000);

    // Get authorized sites
    const sites = await listGSCSites(tokens.access_token);

    // Use Service Role client to bypass RLS when saving integration
    const { getServiceSupabase } = await import('@/lib/supabase');
    const serviceSupabase = getServiceSupabase();

    // Save to database
    const { error: dbError } = await serviceSupabase
      .from('gsc_integrations')
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token, // Only provided on first consent
        expiry_date: expiryDate,
        authorized_sites: sites,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (dbError) {
      console.error('[GSC Callback] Database error:', dbError);
      throw dbError;
    }

    // Redirect back to the app (chat page)
    const redirectUrl = new URL('/', req.url);
    if (conversationId) redirectUrl.searchParams.set('c', conversationId);
    redirectUrl.searchParams.set('gsc_success', 'true');

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('[GSC Callback] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to complete GSC authorization',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

