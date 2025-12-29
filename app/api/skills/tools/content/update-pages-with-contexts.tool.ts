import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Extract head content from complete HTML
 */
function extractHeadContent(html: string): string {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return headMatch ? headMatch[1] : '';
}

/**
 * Extract body content from complete HTML (everything between <body> and </body>)
 */
function extractBodyContent(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : html;
}

/**
 * Check if HTML already has header/footer/custom head tags
 */
function hasCustomComponents(html: string): { hasHeader: boolean; hasFooter: boolean; hasCustomHead: boolean } {
  const bodyContent = extractBodyContent(html);
  const headContent = extractHeadContent(html);
  
  return {
    hasHeader: /<header[\s>]/i.test(bodyContent) || bodyContent.includes('<main>'),
    hasFooter: /<footer[\s>]/i.test(bodyContent),
    hasCustomHead: headContent.includes('theme-color') || headContent.includes('og:') || headContent.includes('twitter:') || headContent.includes('Google Analytics')
  };
}

/**
 * Merge custom head content with existing head
 */
function mergeHeadContent(existingHead: string, customHeadContent: string): string {
  if (!customHeadContent) return existingHead;
  
  // Extract inner content from custom head if it's wrapped in <head> tags
  const headMatch = customHeadContent.match(/<head[^>]*>([\s\S]*)<\/head>/i);
  const customInner = headMatch ? headMatch[1] : customHeadContent;
  
  // Check what's already in existing head
  const hasTitle = /<title>/i.test(existingHead);
  const hasDescription = /<meta[^>]+name=["']description["']/i.test(existingHead);
  
  let merged = existingHead;
  
  // Ensure Tailwind is present
  if (!/<script[^>]+src=["']https:\/\/cdn\.tailwindcss\.com["'][^>]*>/i.test(existingHead)) {
    merged = merged + '\n  <script src="https://cdn.tailwindcss.com"></script>';
  }
  
  // Add custom content at the end of existing head
  // But skip title and description if they already exist
  let customToAdd = customInner;
  if (hasTitle) {
    customToAdd = customToAdd.replace(/<title>[\s\S]*?<\/title>/gi, '');
  }
  if (hasDescription) {
    customToAdd = customToAdd.replace(/<meta[^>]+name=["']description["'][^>]*>/gi, '');
  }
  
  merged = merged + '\n' + customToAdd;
  
  return merged;
}

/**
 * Rebuild HTML with site contexts
 */
function rebuildHtmlWithContexts(
  originalHtml: string,
  siteHeader: string,
  siteFooter: string,
  customHeadContent: string
): string {
  const headContent = extractHeadContent(originalHtml);
  const bodyContent = extractBodyContent(originalHtml);
  
  // Merge head content
  const mergedHead = mergeHeadContent(headContent, customHeadContent);
  
  // Rebuild body with header and footer
  let newBodyContent = bodyContent;
  
  // If body already has <main>, insert header before it and footer after it
  if (bodyContent.includes('<main>')) {
    if (siteHeader) {
      newBodyContent = newBodyContent.replace('<main>', `${siteHeader}\n  <main>`);
    }
    if (siteFooter) {
      newBodyContent = newBodyContent.replace('</main>', `</main>\n${siteFooter}`);
    }
  } else {
    // Wrap existing content in <main> and add header/footer
    newBodyContent = `${siteHeader ? siteHeader + '\n' : ''}  <main>\n${bodyContent}\n  </main>\n${siteFooter || ''}`;
  }
  
  // Rebuild complete HTML
  return `<!DOCTYPE html>
<html lang="en">
<head>
${mergedHead}
</head>
<body>
${newBodyContent}
</body>
</html>`;
}

export const update_pages_with_contexts = tool({
  description: `Update existing generated pages to include site-wide contexts (header, footer, head tags).
  
This tool is useful for:
- Adding header/footer to pages generated before the site contexts feature existed
- Updating old pages to use the latest site branding
- Batch updating multiple pages at once

The tool will:
1. Fetch the user's current site contexts
2. For each specified page, check if it already has custom components
3. If not, rebuild the HTML with the site contexts integrated
4. Update the page in the database

IMPORTANT: This will overwrite the generated_content. The tool is smart enough to:
- Skip pages that already have header/footer (to avoid duplication)
- Merge custom head tags without duplicating existing meta tags
- Preserve the original page content and structure`,
  parameters: z.object({
    user_id: z.string().describe('The user ID whose pages to update'),
    item_ids: z.array(z.string()).optional().describe('Specific page IDs to update. If not provided, will update ALL generated pages for the user.'),
    force: z.boolean().optional().default(false).describe('If true, update pages even if they already have header/footer. Use with caution.')
  }),
  execute: async ({ user_id, item_ids, force = false }) => {
    try {
      // 1. Fetch site contexts
      const { data: contexts, error: contextsError } = await supabase
        .from('site_contexts')
        .select('*')
        .eq('user_id', user_id);
      
      if (contextsError) {
        return {
          success: false,
          error: `Failed to fetch site contexts: ${contextsError.message}`
        };
      }
      
      let siteHeader = '';
      let siteFooter = '';
      let customHeadContent = '';
      
      contexts?.forEach((context: any) => {
        if (context.type === 'header' && context.content) {
          siteHeader = context.content;
        } else if (context.type === 'footer' && context.content) {
          siteFooter = context.content;
        } else if (context.type === 'meta' && context.content) {
          customHeadContent = context.content;
        }
      });
      
      if (!siteHeader && !siteFooter && !customHeadContent) {
        return {
          success: false,
          error: 'No site contexts found for this user. Please set up header, footer, or meta tags first.'
        };
      }
      
      // 2. Fetch pages to update
      let query = supabase
        .from('content_items')
        .select('id, title, generated_content')
        .eq('user_id', user_id)
        .eq('status', 'generated')
        .not('generated_content', 'is', null);
      
      if (item_ids && item_ids.length > 0) {
        query = query.in('id', item_ids);
      }
      
      const { data: pages, error: pagesError } = await query;
      
      if (pagesError) {
        return {
          success: false,
          error: `Failed to fetch pages: ${pagesError.message}`
        };
      }
      
      if (!pages || pages.length === 0) {
        return {
          success: false,
          error: 'No pages found to update.'
        };
      }
      
      // 3. Process each page
      const updates: Array<{ id: string; title: string; status: string; reason?: string }> = [];
      
      for (const page of pages) {
        const check = hasCustomComponents(page.generated_content);
        
        // Skip if already has components (unless force is true)
        if (!force && (check.hasHeader || check.hasFooter)) {
          updates.push({
            id: page.id,
            title: page.title,
            status: 'skipped',
            reason: 'Already has header/footer'
          });
          continue;
        }
        
        try {
          // Rebuild HTML with contexts
          const updatedHtml = rebuildHtmlWithContexts(
            page.generated_content,
            siteHeader,
            siteFooter,
            customHeadContent
          );
          
          // Update in database
          const { error: updateError } = await supabase
            .from('content_items')
            .update({
              generated_content: updatedHtml,
              updated_at: new Date().toISOString()
            })
            .eq('id', page.id);
          
          if (updateError) {
            updates.push({
              id: page.id,
              title: page.title,
              status: 'failed',
              reason: updateError.message
            });
          } else {
            updates.push({
              id: page.id,
              title: page.title,
              status: 'updated'
            });
          }
        } catch (error: any) {
          updates.push({
            id: page.id,
            title: page.title,
            status: 'failed',
            reason: error.message
          });
        }
      }
      
      // 4. Summary
      const updatedCount = updates.filter(u => u.status === 'updated').length;
      const skippedCount = updates.filter(u => u.status === 'skipped').length;
      const failedCount = updates.filter(u => u.status === 'failed').length;
      
      return {
        success: true,
        total: pages.length,
        updated: updatedCount,
        skipped: skippedCount,
        failed: failedCount,
        details: updates,
        message: `Updated ${updatedCount} page(s), skipped ${skippedCount}, failed ${failedCount}.`,
        site_contexts: {
          has_header: !!siteHeader,
          has_footer: !!siteFooter,
          has_custom_head: !!customHeadContent
        }
      };
      
    } catch (error: any) {
      console.error('[update_pages_with_contexts] Error:', error);
      return {
        success: false,
        error: `Unexpected error: ${error.message}`
      };
    }
  },
});

