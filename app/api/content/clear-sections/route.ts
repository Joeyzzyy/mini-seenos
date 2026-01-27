import { NextRequest, NextResponse } from 'next/server';
import { clearSections } from '@/lib/section-storage';

/**
 * API endpoint to clear all sections for a content item.
 * Called before regeneration to ensure a fresh start.
 */
export async function POST(request: NextRequest) {
  try {
    const { content_item_id } = await request.json();
    
    if (!content_item_id) {
      return NextResponse.json(
        { error: 'content_item_id is required' },
        { status: 400 }
      );
    }
    
    console.log(`[clear-sections] Clearing sections for content item: ${content_item_id}`);
    
    const result = await clearSections(content_item_id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to clear sections' },
        { status: 500 }
      );
    }
    
    console.log(`[clear-sections] Cleared ${result.deleted} sections`);
    
    return NextResponse.json({
      success: true,
      deleted: result.deleted,
      message: `Cleared ${result.deleted} sections for content item ${content_item_id}`,
    });
    
  } catch (error) {
    console.error('[clear-sections] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
