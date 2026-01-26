import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedServerClient, createServerSupabaseAdmin } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAuthenticatedServerClient(request.headers.get('Authorization'));
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // Return default credits for unauthenticated users
      return NextResponse.json({
        credits: 0,
        subscription_tier: 'free',
        subscription_status: 'inactive',
      });
    }

    // Try to get user profile with credits
    const supabaseAdmin = createServerSupabaseAdmin();
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('credits, subscription_tier, subscription_status')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // Profile doesn't exist yet, return default
      console.log('Profile not found, returning default credits:', profileError.message);
      return NextResponse.json({
        credits: 0,
        subscription_tier: 'free',
        subscription_status: 'inactive',
        user_id: user.id,
        email: user.email,
      });
    }

    return NextResponse.json({
      credits: profile.credits ?? 0,
      subscription_tier: profile.subscription_tier ?? 'free',
      subscription_status: profile.subscription_status ?? 'inactive',
      user_id: user.id,
      email: user.email,
    });

  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}
