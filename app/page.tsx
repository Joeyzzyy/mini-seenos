'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import PricingModal from '@/components/PricingModal';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'standard' | 'pro' | null>(null);
  const [userCredits, setUserCredits] = useState(1);
  const [subscriptionTier, setSubscriptionTier] = useState('free');

  // Fetch user credits
  const fetchUserCredits = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      
      const response = await fetch('/api/user/credits', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserCredits(data.credits ?? 1);
        setSubscriptionTier(data.subscription_tier ?? 'free');
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchUserCredits();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setError(null);
      if (session?.user) {
        fetchUserCredits();
        // Redirect to projects on successful sign in
        if (event === 'SIGNED_IN') {
          router.push('/projects');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Handle hash scrolling (e.g., /#pricing)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Please set up environment variables.');
      return;
    }

    try {
      setError(null);
      setSigningIn(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/projects`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('OAuth error:', error);
        setError(error.message || 'Failed to sign in with Google');
        setSigningIn(false);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'An unexpected error occurred');
      setSigningIn(false);
    }
  };

  // Handle buy plan click
  const handleBuyPlan = async (plan: 'starter' | 'standard' | 'pro') => {
    if (!user) {
      // Not logged in - trigger Google login first
      setSelectedPlan(plan);
      await handleGoogleLogin();
      return;
    }
    // Logged in - show pricing modal
    setSelectedPlan(plan);
    setShowPricingModal(true);
  };

  // Handle payment success
  const handlePaymentSuccess = (newCredits: number, newTier: string) => {
    setUserCredits(newCredits);
    setSubscriptionTier(newTier);
    setShowPricingModal(false);
    setSelectedPlan(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden overflow-y-auto relative" style={{ height: 'auto' }}>
      {/* Background texture - subtle grid pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/new-logo.png" alt="SEOPages" className="h-8 sm:h-10 w-auto" />
            <span className="text-white text-lg sm:text-xl font-medium tracking-tight">
              SEOPages<span className="text-gray-500">.</span>pro
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Comparisons Mega Dropdown */}
            <div className="hidden lg:block relative group">
              <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 py-2">
                50 Comparisons
                <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="fixed left-0 right-0 top-[56px] pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-[#111111] border-b border-white/10 shadow-2xl">
                  <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold">SEOPages.pro vs 54 Tools</h3>
                        <p className="text-gray-500 text-sm">1v1 comparison pages — all AI-generated</p>
                      </div>
                      <a href="/seopages-pro-alternatives" className="text-sm text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                        View All 50
                      </a>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        { name: 'Jasper AI', slug: 'jasper-ai' },
                        { name: 'Surfer SEO', slug: 'surfer-seo' },
                        { name: 'Ahrefs', slug: 'ahrefs' },
                        { name: 'SEMrush', slug: 'semrush' },
                        { name: 'Copy.ai', slug: 'copy-ai' },
                        { name: 'Frase', slug: 'frase' },
                        { name: 'Clearscope', slug: 'clearscope' },
                        { name: 'MarketMuse', slug: 'marketmuse' },
                        { name: 'Writesonic', slug: 'writesonic' },
                        { name: 'Rytr', slug: 'rytr' },
                        { name: 'Moz Pro', slug: 'moz-pro' },
                        { name: 'Unbounce', slug: 'unbounce' },
                        { name: 'Webflow', slug: 'webflow' },
                        { name: 'Rank Math', slug: 'rank-math' },
                        { name: 'Yoast SEO', slug: 'yoast-seo' },
                        { name: 'NeuronWriter', slug: 'neuronwriter' },
                        { name: 'Scalenut', slug: 'scalenut' },
                        { name: 'GrowthBar', slug: 'growthbar' },
                      ].map((item) => (
                        <a
                          key={item.slug}
                          href={`/seopages-pro-alternatives/${item.slug}`}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group/item"
                        >
                          <img 
                            src={`https://www.google.com/s2/favicons?domain=${item.slug.replace(/-/g, '')}.com&sz=32`}
                            alt={item.name}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-gray-400 group-hover/item:text-white truncate">{item.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Listicles Mega Dropdown */}
            <div className="hidden lg:block relative group">
              <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 py-2">
                63 Listicles
                <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="fixed left-0 right-0 top-[56px] pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-[#111111] border-b border-white/10 shadow-2xl">
                  <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold">Best Alternatives Guides</h3>
                        <p className="text-gray-500 text-sm">Ranked listicle pages — all AI-generated</p>
                      </div>
                      <a href="/best-alternatives" className="text-sm text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                        View All 63
                      </a>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { name: 'Jasper AI Alternatives', slug: 'jasper-ai' },
                        { name: 'Surfer SEO Alternatives', slug: 'surfer-seo' },
                        { name: 'Ahrefs Alternatives', slug: 'ahrefs' },
                        { name: 'SEMrush Alternatives', slug: 'semrush' },
                        { name: 'Best AI SEO Tools', slug: 'ai-seo-tools' },
                        { name: 'Best AI Writing Tools', slug: 'ai-writing-tools' },
                        { name: 'Keyword Research Tools', slug: 'keyword-research-tools' },
                        { name: 'Rank Tracking Tools', slug: 'rank-tracking-tools' },
                        { name: 'Content Optimization', slug: 'content-optimization-tools' },
                        { name: 'Local SEO Tools', slug: 'local-seo-tools' },
                        { name: 'SEO Chrome Extensions', slug: 'seo-chrome-extensions' },
                        { name: 'SEO for Agencies', slug: 'seo-tools-agencies' },
                        { name: 'SEO for E-commerce', slug: 'seo-tools-ecommerce' },
                        { name: 'AI Blog Writers', slug: 'ai-blog-writers' },
                        { name: 'Small Business SEO', slug: 'seo-tools-small-business' },
                      ].map((item) => (
                        <a
                          key={item.slug}
                          href={`/best-alternatives/${item.slug}`}
                          className="p-2 rounded-lg hover:bg-white/5 transition-colors group/item"
                        >
                          <span className="text-sm text-gray-400 group-hover/item:text-white">{item.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Guide Link */}
            <a href="/alternative-page-guide" className="hidden lg:block text-sm text-gray-400 hover:text-white transition-colors">Guide</a>
            <a href="#features" className="hidden lg:block text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hidden lg:block text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
            {user ? (
              <a
                href="/projects"
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#FFAF40] via-[#9A8FEA] to-[#65B4FF] text-white text-xs sm:text-sm font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-1 sm:gap-2"
              >
                <span className="hidden sm:inline">Go to</span> Workspace
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={signingIn}
                className="px-3 sm:px-4 py-2 bg-white text-black text-xs sm:text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                {signingIn ? 'Connecting...' : 'Get Started'}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        {/* Subtle background with radial gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
          <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-[radial-gradient(circle,_rgba(154,143,234,0.03)_0%,_transparent_70%)]" />
          <div className="absolute top-40 right-1/4 w-[250px] h-[250px] bg-[radial-gradient(circle,_rgba(101,180,255,0.02)_0%,_transparent_70%)]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge - more subtle */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/[0.03] border border-white/10 rounded-full mb-6 sm:mb-8">
            <span className="text-xs sm:text-sm text-gray-400">Comparison Pages + Listicles for SEO & AI Search</span>
          </div>

          {/* Main Headline - cleaner, more confident */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-[1.1]">
            Alternative Pages
            <br />
            <span className="text-gray-400">
              That Actually Rank
            </span>
          </h1>

          {/* Subheadline - more honest, less hype */}
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Generate &quot;YourProduct vs Competitor&quot; pages and &quot;Best Alternatives&quot; listicles. 
            Structured for Google <em>and</em> AI search engines.
          </p>

          {/* Pricing highlight - cleaner */}
          <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 px-5 py-3 bg-white/[0.03] border border-white/10 rounded-xl">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-white">$4.9</span>
              </div>
              <div className="text-left border-l border-white/10 pl-3">
                <div className="text-white text-sm font-medium">10 Pages</div>
                <div className="text-xs text-gray-500">Launch price</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={handleGoogleLogin}
              disabled={signingIn}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="sm:hidden">{signingIn ? 'Connecting...' : 'Get Started'}</span>
              <span className="hidden sm:inline">{signingIn ? 'Connecting...' : 'Start Generating Pages'}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <a href="#pricing" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 transition-all text-center text-sm sm:text-base">
              View Pricing
            </a>
          </div>

          {/* Two Page Types - cleaner presentation */}
          <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                <div className="text-xs text-gray-500 mb-2">Page Type 1</div>
                <div className="text-lg font-semibold text-white mb-2">Alternative Pages</div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  &quot;Your Product vs Competitor&quot; — direct 1v1 comparisons with feature tables, pricing, and honest pros/cons.
                </p>
              </div>
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                <div className="text-xs text-gray-500 mb-2">Page Type 2</div>
                <div className="text-lg font-semibold text-white mb-2">Best-Of Listicles</div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  &quot;Top 8 Best X Alternatives&quot; — ranked lists with ratings, reviews, and structured data for rich snippets.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Important Notes - Right after hero */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Why No Free Trial - Highlighted */}
          <div className="relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-2xl blur-sm" />
            <div className="relative p-6 sm:p-8 bg-[#0D0D0D] border border-amber-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Why No Free Trial?</h3>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-400 leading-relaxed">
                <p>
                  We&apos;re a small team. We know SEO, we built something useful, but we don&apos;t have VC money to burn.
                  Every page you generate costs us real money in AI compute.
                </p>
                <p>
                  So no, we can&apos;t give you unlimited free trials. But here&apos;s what we <span className="text-amber-400 font-medium">can</span> promise:
                </p>
                <ul className="space-y-3 pl-1">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 font-bold mt-0.5">→</span>
                    <span><span className="text-white font-medium">$4.9 for 10 pages.</span> That&apos;s less than $0.50 per page. Way cheaper than hiring any writer.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 font-bold mt-0.5">→</span>
                    <span><span className="text-white font-medium">Once you pay, you&apos;re the boss.</span> Not satisfied? Email me directly. I&apos;ll personally tweak the product or your pages until you&apos;re happy.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 font-bold mt-0.5">→</span>
                    <span><span className="text-white font-medium">This isn&apos;t a faceless SaaS.</span> There&apos;s a real person behind this who actually wants you to succeed.</span>
                  </li>
                </ul>
                <div className="pt-4 mt-4 border-t border-white/10">
                  <p className="text-gray-500">
                    Questions? Complaints? Feature requests? →{' '}
                    <a href="mailto:wps_zy@126.com" className="text-amber-400 hover:text-amber-300 font-medium">wps_zy@126.com</a>
                    <span className="text-gray-600"> — I read every email.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Irony - Highlighted */}
          <div className="relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-sm" />
            <div className="relative p-6 sm:p-8 bg-[#0D0D0D] border border-purple-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">The Irony</h3>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-400 leading-relaxed">
                <p>
                  We&apos;re an SEO product. To showcase our ability to generate comparison and listicle pages, 
                  we listed <span className="text-purple-400 font-medium">every single &quot;competitor&quot;</span> we could find — 50 comparison pages, 63 listicles.
                </p>
                <p>
                  Go ahead, check them out. Use them if you want. But here&apos;s the thing:
                </p>
                <p className="text-white font-medium bg-white/5 p-4 rounded-xl border border-white/10">
                  Only we let you pay a few bucks, download your pages, and be done with it. 
                  No subscription. No login required to use your files. Just... pages.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-500 text-sm mb-3">What goes into each page to make it unique &amp; high-quality:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Screenshot API', desc: 'Real product visuals' },
                      { label: 'Search APIs', desc: 'Current market data' },
                      { label: 'Perplexity', desc: 'Deep research' },
                      { label: 'SEMrush', desc: 'Keyword intelligence' },
                      { label: 'Claude', desc: 'Quality writing' },
                    ].map((item) => (
                      <div key={item.label} className="px-3 py-2 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                        <span className="text-purple-300 text-xs font-medium">{item.label}</span>
                        <span className="text-gray-600 text-xs ml-1.5">· {item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* === SHOWCASE: Our Generated Pages === */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header - simpler */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span className="text-sm text-gray-400">113 pages live on this site</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              Example Pages
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto mb-6">
              50 comparison pages and 63 listicles — all generated with this tool. 
              Browse them, inspect the quality, then build your own.
            </p>
            
          </div>

          {/* === 1v1 COMPARISON PAGES === */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Comparison Pages</h3>
                <p className="text-gray-600 text-sm">SEOPages.pro vs 54 tools</p>
              </div>
              <a
                href="/seopages-pro-alternatives"
                className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                View all →
              </a>
            </div>
            
            {/* Comparison Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { name: 'Jasper AI', slug: 'jasper-ai' },
                { name: 'Surfer SEO', slug: 'surfer-seo' },
                { name: 'Ahrefs', slug: 'ahrefs' },
                { name: 'SEMrush', slug: 'semrush' },
                { name: 'Copy.ai', slug: 'copy-ai' },
                { name: 'Frase', slug: 'frase' },
                { name: 'Clearscope', slug: 'clearscope' },
                { name: 'MarketMuse', slug: 'marketmuse' },
                { name: 'Writesonic', slug: 'writesonic' },
                { name: 'NeuronWriter', slug: 'neuronwriter' },
                { name: 'Webflow', slug: 'webflow' },
                { name: 'Rank Math', slug: 'rank-math' },
              ].map((item) => (
                <a
                  key={item.slug}
                  href={`/seopages-pro-alternatives/${item.slug}`}
                  className="group p-3 bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] rounded-lg hover:border-white/20 hover:from-white/[0.05] hover:to-white/[0.02] transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${item.slug.replace(/-/g, '')}.com&sz=64`}
                      alt={item.name}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-[10px] text-gray-600">vs</span>
                  </div>
                  <div className="text-white text-sm truncate group-hover:text-gray-300">{item.name}</div>
                </a>
              ))}
            </div>
            
            {/* Mobile View All */}
            <div className="sm:hidden text-center mt-4">
              <a href="/seopages-pro-alternatives" className="text-sm text-gray-400 hover:text-white">
                View all 50 →
              </a>
            </div>
          </div>

          {/* === BEST-OF LISTICLE PAGES === */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Listicle Pages</h3>
                <p className="text-gray-600 text-sm">64 &quot;Best Alternatives&quot; guides</p>
              </div>
              <a
                href="/best-alternatives"
                className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                View all →
              </a>
            </div>
            
            {/* Listicle Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {[
                { name: 'Jasper AI Alternatives', slug: 'jasper-ai', domain: 'jasper.ai' },
                { name: 'Surfer SEO Alternatives', slug: 'surfer-seo', domain: 'surferseo.com' },
                { name: 'Ahrefs Alternatives', slug: 'ahrefs', domain: 'ahrefs.com' },
                { name: 'AI SEO Tools', slug: 'ai-seo-tools', domain: 'seopages.pro' },
                { name: 'Keyword Research Tools', slug: 'keyword-research-tools', domain: 'semrush.com' },
                { name: 'Rank Tracking Tools', slug: 'rank-tracking-tools', domain: 'ahrefs.com' },
                { name: 'Local SEO Tools', slug: 'local-seo-tools', domain: 'brightlocal.com' },
                { name: 'Content Optimization', slug: 'content-optimization-tools', domain: 'clearscope.io' },
                { name: 'AI Writing Tools', slug: 'ai-writing-tools', domain: 'copy.ai' },
                { name: 'AI Blog Writers', slug: 'ai-blog-writers', domain: 'jasper.ai' },
              ].map((item) => (
                <a
                  key={item.slug}
                  href={`/best-alternatives/${item.slug}`}
                  className="group p-3 bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] rounded-lg hover:border-white/20 hover:from-white/[0.05] hover:to-white/[0.02] transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
                      alt={item.name}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-[10px] text-gray-600">best</span>
                  </div>
                  <div className="text-white text-sm truncate group-hover:text-gray-300">{item.name}</div>
                </a>
              ))}
            </div>
            
            {/* Mobile View All */}
            <div className="sm:hidden text-center mt-4">
              <a href="/best-alternatives" className="text-sm text-gray-400 hover:text-white">
                View all 63 →
              </a>
            </div>
          </div>

          {/* === CALL TO ACTION === */}
          <div className="mt-10 p-6 sm:p-8 bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                  Build pages like these for your product
                </h3>
                <p className="text-gray-500 text-sm">
                  Same quality. Same structure. <span className="text-[#FFAF40] font-semibold">Starting at $0.49/page.</span>
                </p>
              </div>
              <button
                onClick={handleGoogleLogin}
                disabled={signingIn}
                className="w-full sm:w-auto px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {signingIn ? 'Connecting...' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-2 text-white">Features</h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto px-2">
              Pages structured for both traditional search and AI assistants.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'AI-Parseable Structure',
                description: 'Schema.org markup, clear headings, comparison tables. AI can extract and cite your content directly.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Dual Page Types',
                description: '1v1 Alternative Pages for direct comparisons. Best-Of Listicles for category rankings. Both AI-optimized.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Deploy in 30 Seconds',
                description: 'Self-contained HTML files. No frameworks. Upload anywhere and go live instantly.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: '90% OFF Right Now',
                description: '$4.9 for 10 pages. Simple pricing. No hidden fees.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
                title: 'You Own the Code',
                description: 'Raw HTML files. No subscription. No lock-in. Download and it\'s yours forever.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'SEO + GEO Optimized',
                description: 'Rank on Google today. Get cited by AI tomorrow. Future-proof your competitive positioning.',
              },
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="p-5 sm:p-6 bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] rounded-xl hover:border-white/15 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
              >
                <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.05] flex items-center justify-center mb-3 sm:mb-4 text-gray-400">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold mb-1.5 sm:mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white">How It Works</h2>
            <p className="text-gray-500 text-sm sm:text-base">Three steps to deploy-ready pages.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Enter Your URL', desc: 'We analyze your product and identify your competitors automatically.' },
              { step: '2', title: 'Select Competitors', desc: 'Choose which competitors to compare against, or let us suggest them.' },
              { step: '3', title: 'Download & Deploy', desc: 'Get production-ready HTML files. Upload to your site or hosting.' },
            ].map((item, idx) => (
              <div key={idx} className="text-center sm:text-left">
                <div className="text-sm font-medium text-gray-600 mb-2">Step {item.step}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 relative">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent" />
        
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white">Pricing</h2>
            <p className="text-gray-500 text-sm sm:text-base">
              One-time payment. No subscription. Own your pages forever.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {/* Starter */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] rounded-xl flex flex-col h-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base font-semibold text-white mb-2">Starter</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">$4.9</span>
                  <span className="text-gray-600 text-sm">10 pages</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">$0.49 per page</p>
              </div>
              <ul className="space-y-2 flex-grow text-sm">
                <li className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI-powered content</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Production-ready HTML</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>SEO + Schema optimized</span>
                </li>
              </ul>
              <button
                onClick={() => handleBuyPlan('starter')}
                className="w-full py-2.5 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition-colors text-sm mt-6"
              >
                {user ? 'Buy Now' : 'Sign in to Buy'}
              </button>
            </div>

            {/* Standard - Featured */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/20 rounded-xl order-first sm:order-none flex flex-col h-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),_0_0_0_1px_rgba(255,255,255,0.05)]">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white text-black text-[10px] font-semibold rounded-full shadow-sm">
                Most Popular
              </div>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base font-semibold text-white mb-2">Standard</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">$9.9</span>
                  <span className="text-gray-600 text-sm">20 pages</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">$0.495 per page</p>
              </div>
              <ul className="space-y-2 flex-grow text-sm">
                <li className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Everything in Starter</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>
              <button
                onClick={() => handleBuyPlan('standard')}
                className="w-full py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm mt-6"
              >
                {user ? 'Buy Now' : 'Sign in to Buy'}
              </button>
            </div>

            {/* Pro */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] rounded-xl flex flex-col h-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base font-semibold text-white mb-2">Pro</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">$19.9</span>
                  <span className="text-gray-600 text-sm">50 pages</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">$0.40 per page</p>
              </div>
              <ul className="space-y-2 flex-grow text-sm">
                <li className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Everything in Standard</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Best for crowded markets</span>
                </li>
              </ul>
              <button
                onClick={() => handleBuyPlan('pro')}
                className="w-full py-2.5 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition-colors text-sm mt-6"
              >
                {user ? 'Buy Now' : 'Sign in to Buy'}
              </button>
            </div>
          </div>

          {/* Secure payment notice */}
          <div className="text-center mt-8">
            <p className="text-gray-600 text-xs flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure payment via PayPal
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mb-6">
            10 pages for $4.9. One-time payment.
          </p>
          <button
            onClick={handleGoogleLogin}
            disabled={signingIn}
            className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {signingIn ? 'Connecting...' : 'Get Started'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-6">
            <div className="flex items-center gap-2">
              <img src="/new-logo.png" alt="SEOPages" className="h-6 w-auto" />
              <span className="text-white text-sm font-medium">seopages.pro</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <a href="/alternative-page-guide" className="hover:text-white transition-colors">Guide</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            </nav>
          </div>
          
          {/* Legal & Contact Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
            <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-gray-600">
              <a href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
              <span className="text-gray-700">·</span>
              <a href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</a>
              <span className="text-gray-700">·</span>
              <a href="mailto:wps_zy@126.com" className="hover:text-gray-400 transition-colors">
                wps_zy@126.com
              </a>
            </nav>
            <p className="text-gray-600 text-xs text-center">
              © {new Date().getFullYear()} seopages.pro
            </p>
          </div>
        </div>
      </footer>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-6 right-6 px-6 py-4 bg-red-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl animate-in slide-in-from-bottom-4">
          {error}
        </div>
      )}

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => {
          setShowPricingModal(false);
          setSelectedPlan(null);
        }}
        currentCredits={userCredits}
        currentTier={subscriptionTier}
        onPaymentSuccess={handlePaymentSuccess}
        initialPlan={selectedPlan}
      />
    </div>
  );
}
