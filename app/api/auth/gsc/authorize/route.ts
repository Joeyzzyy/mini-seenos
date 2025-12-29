import { NextResponse } from 'next/server';
import { getGSCAuthUrl } from '@/lib/google-gsc';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('conversationId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Check if client_id is configured
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = Buffer.from(JSON.stringify({ userId, conversationId })).toString('base64'); // Temporary placeholder logic check
    
    // We need to import getGSCAuthUrl or similar to get the URI, 
    // but better to just call it and log the result URL's params
    const state = Buffer.from(JSON.stringify({ userId, conversationId })).toString('base64');
    const authUrl = getGSCAuthUrl(state);
    const finalUrl = new URL(authUrl);
    const usedRedirectUri = finalUrl.searchParams.get('redirect_uri');

    console.log('[GSC Authorize] Diagnostic:', { 
      hasClientId: !!clientId, 
      clientIdPrefix: clientId ? `${clientId.substring(0, 10)}...` : 'none',
      redirectUri: usedRedirectUri
    });

    if (!clientId || clientId.trim() === '') {
      return NextResponse.json({ 
        error: 'GOOGLE_CLIENT_ID is not configured in .env.local or is empty',
        instruction: 'Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env.local file and RESTART the server.'
      }, { status: 500 });
    }

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('[GSC Authorize] Error:', error);
    return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 });
  }
}

