import { supabase } from './supabase';

export interface GSCAuthStatus {
  isAuthorized: boolean;
  sites: string[];
  authUrl?: string;
}

/**
 * Gets a redirect URI for GSC OAuth
 */
function getRedirectUri(): string {
  return process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gsc/callback` 
    : 'http://localhost:3000/api/auth/gsc/callback';
}

/**
 * Generates the Google OAuth authorization URL
 */
export function getGSCAuthUrl(state: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = getRedirectUri();

  const scopes = [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/webmasters'
  ];

  const params = new URLSearchParams({
    client_id: clientId || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state: state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchanges OAuth code for tokens
 */
export async function exchangeCodeForTokens(code: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = getRedirectUri();

  console.log('[GSC exchangeCodeForTokens] Starting exchange...', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    redirectUri
  });

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing during token exchange');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[GSC exchangeCodeForTokens] Error from Google:', data);
    throw new Error(`Google Token Exchange Failed: ${data.error} - ${data.error_description || 'No description'}`);
  }

  return data;
}

/**
 * Refreshes an expired access token
 */
export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to refresh token: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Gets a valid access token for a user, refreshing if necessary
 */
export async function getValidGSCToken(userId: string) {
  const { data: integration, error } = await supabase
    .from('gsc_integrations')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !integration) {
    throw new Error('GSC integration not found for user');
  }

  // Check if token is expired (with 5 min buffer)
  const isExpired = Date.now() > (integration.expiry_date - 300000);

  if (isExpired && integration.refresh_token) {
    console.log('[GSC] Token expired, refreshing...');
    const tokens = await refreshAccessToken(integration.refresh_token);
    
    const expiryDate = Date.now() + (tokens.expires_in * 1000);
    
    // Update tokens in DB
    await supabase
      .from('gsc_integrations')
      .update({
        access_token: tokens.access_token,
        expiry_date: expiryDate,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    return tokens.access_token;
  }

  return integration.access_token;
}

/**
 * Fetches the list of sites from GSC
 */
export async function listGSCSites(accessToken: string): Promise<string[]> {
  const response = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[GSC listGSCSites] Error:', errorData);
    throw new Error(`Google API Error (listGSCSites): ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return (data.siteEntry || []).map((site: any) => site.siteUrl);
}

/**
 * Fetches performance data for a site
 */
export async function getGSCPerformance(
  accessToken: string,
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimensions: string[] = ['query', 'page']
) {
  const encodedSiteUrl = encodeURIComponent(siteUrl);
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions,
        rowLimit: 100,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to fetch GSC performance: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Inspects a specific URL to get indexing status from GSC
 */
export async function inspectGSCUrl(
  accessToken: string,
  siteUrl: string,
  inspectionUrl: string
) {
  const response = await fetch(
    `https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inspectionUrl,
        siteUrl,
        languageCode: 'en-US'
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to inspect URL: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

