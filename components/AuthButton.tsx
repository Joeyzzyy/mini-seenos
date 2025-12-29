'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setError(null); // Clear error on auth change
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('OAuth error:', error);
        setError(error.message || 'Failed to sign in with Google');
        setLoading(false);
        return;
      }

      // OAuth will redirect, so we don't set loading to false here
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="px-3 py-2 text-sm text-[#6B7280]">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {user.user_metadata.avatar_url ? (
            <div className="relative w-7 h-7 flex-shrink-0">
              {/* Using standard img tag to avoid Next.js Image optimization issues and handle referrer policy */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name || 'User'}
                width={28}
                height={28}
                className="rounded-full border border-[#E5E5E5] object-cover w-7 h-7"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div 
              className="w-7 h-7 flex-shrink-0 rounded-full border border-[#E5E5E5] flex items-center justify-center text-white text-xs font-medium"
              style={{
                background: 'linear-gradient(80deg, rgb(255, 175, 64) -21.49%, rgb(209, 148, 236) 18.44%, rgb(154, 143, 234) 61.08%, rgb(101, 180, 255) 107.78%)',
              }}
            >
              {(user.user_metadata.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </div>
          )}
          <div className="text-xs min-w-0 flex-1">
            <div className="font-medium text-[#111827] truncate">
              {user.user_metadata.full_name || user.email}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-white border-2 
                 rounded-lg transition-all text-sm font-medium text-[#374151]
                 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        style={{
          borderImage: 'linear-gradient(80deg, rgb(255, 175, 64) -21.49%, rgb(209, 148, 236) 18.44%, rgb(154, 143, 234) 61.08%, rgb(101, 180, 255) 107.78%) 1',
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.borderImage = 'linear-gradient(80deg, rgb(255, 175, 64) -21.49%, rgb(209, 148, 236) 18.44%, rgb(154, 143, 234) 61.08%, rgb(101, 180, 255) 107.78%) 1';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.borderColor = '#E5E5E5';
          }
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign in with Google</span>
          </>
        )}
      </button>
      
      {error && (
        <div className="px-4 py-2 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-sm text-[#DC2626] max-w-md text-center">
          {error}
        </div>
      )}
    </div>
  );
}

