import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = getServiceSupabase();

    // Update comparison pages
    const { data: comparisonData, error: comparisonError } = await supabase
      .from('content_items')
      .update({ page_type: 'comparison' })
      .or('title.ilike.%comparison%,title.ilike.%vs%,title.ilike.%versus%,title.ilike.%compare%,title.ilike.%alternatives%')
      .eq('page_type', 'blog')
      .select('id, title');

    if (comparisonError) throw comparisonError;

    // Update listicle pages
    const { data: listicleData, error: listicleError } = await supabase
      .from('content_items')
      .update({ page_type: 'listicle' })
      .or('title.ilike.top %,title.ilike.best %,title.ilike.% best %')
      .eq('page_type', 'blog')
      .select('id, title');

    if (listicleError) throw listicleError;

    // Update guide pages
    const { data: guideData, error: guideError } = await supabase
      .from('content_items')
      .update({ page_type: 'guide' })
      .or('title.ilike.%how to%,title.ilike.%guide%,title.ilike.%tutorial%,title.ilike.%step by step%')
      .eq('page_type', 'blog')
      .select('id, title');

    if (guideError) throw guideError;

    // Update landing pages
    const { data: landingData, error: landingError } = await supabase
      .from('content_items')
      .update({ page_type: 'landing_page' })
      .or('title.ilike.%services%,title.ilike.%solutions%,title.ilike.%pricing%,title.ilike.%features%,title.ilike.%product%')
      .eq('page_type', 'blog')
      .select('id, title');

    if (landingError) throw landingError;

    // Get final distribution
    const { data: distribution, error: distError } = await supabase
      .from('content_items')
      .select('page_type')
      .then((result) => {
        if (result.error) throw result.error;
        const counts: Record<string, number> = {};
        result.data.forEach((item: any) => {
          counts[item.page_type || 'unknown'] = (counts[item.page_type || 'unknown'] || 0) + 1;
        });
        return { data: counts, error: null };
      });

    return NextResponse.json({
      success: true,
      updated: {
        comparison: comparisonData?.length || 0,
        listicle: listicleData?.length || 0,
        guide: guideData?.length || 0,
        landing_page: landingData?.length || 0,
      },
      distribution,
      updatedItems: {
        comparison: comparisonData || [],
        listicle: listicleData || [],
        guide: guideData || [],
        landing_page: landingData || [],
      }
    });

  } catch (error: any) {
    console.error('[fix-page-types] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

