import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const draft_page_section = tool({
  description: `Generate high-quality, professional Markdown content for a specific page section. 

  REQUIREMENTS:
  - WRITING DEPTH: Write at least 400-600 words per major section. Be professional, detailed, and expert-level.
  - STRATEGIC LINKING: 
    - INTERNAL: Embed 1-2 internal links to other relevant pages in the library using [Anchor Text](URL) provided by 'suggest_internal_links'.
    - EXTERNAL: Embed 2-3 external links to authoritative sources (studies, news, gov sites) found via 'web_search'. 
    - NEVER use generic text like "click here". Use natural, keyword-rich anchor text.
  - PROFESSIONAL LAYOUT: Use Markdown tables for data, bulleted lists for features, and bold text for emphasis.
  - NO TITLES: Do not include the section title (H2) in the content; it will be added by the assembly tool.
  - H3 STRUCTURE: Use ### for sub-sections to create a tight, hierarchy.
  - IMAGES: Use ![IMAGE_PLACEHOLDER:placeholder_id] for visuals (max 2 per page total).`,
  parameters: z.object({
    section_title: z.string().describe('The H2 title of the section being drafted'),
    section_content: z.string().describe('The complete Markdown content. PARAGRAPHS ONLY. Embed external links on keywords. Use expert terminology.'),
    h3_subsections: z.array(z.object({
      title: z.string().describe('H3 subsection title'),
      content: z.string().describe('Markdown content for this subsection. Embed external links.')
    })).optional().describe('Optional H3 subsections'),
    needs_image: z.boolean().optional().describe('Whether this section needs an image'),
    image_description: z.string().optional().describe('Detailed description for AI image generation (min 20 words). Only if needs_image is true.'),
  }),
  execute: async ({ section_title, section_content, h3_subsections, needs_image, image_description }) => {
    // Build the complete section in Markdown
    let markdown = "";
    
    // Only add image if explicitly requested
    const shouldHaveImage = needs_image === true;
    
    // Generate default image description if not provided but section should have image
    let finalImageDescription = image_description;
    if (shouldHaveImage && !image_description) {
      finalImageDescription = `A professional visual illustration or hero image for ${section_title}`;
    }
    
    // If image is needed and not already in content, add placeholder
    if (shouldHaveImage && finalImageDescription && !section_content.includes('IMAGE_PLACEHOLDER')) {
      const placeholderId = `section_${section_title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
      markdown += `![IMAGE_PLACEHOLDER:${placeholderId}]\n\n`;
    }
    
    // Always add the main section content if provided
    if (section_content && section_content.trim()) {
      markdown += `${section_content.trim()}\n\n`;
    }
    
    // Add subsections if provided
    if (h3_subsections && h3_subsections.length > 0) {
      h3_subsections.forEach(subsection => {
        // Clean redundant H3 titles from subsection content
        const cleanContent = subsection.content.replace(new RegExp(`^\\s*#{1,4}\\s*${subsection.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n?`, 'i'), '');
        markdown += `### ${subsection.title}\n\n${cleanContent}\n\n`;
      });
    }
    
    // Extract image placeholder IDs from the markdown
    const imagePlaceholders = markdown.match(/!\[IMAGE_PLACEHOLDER:([^\]]+)\]/g) || [];
    const placeholderIds = imagePlaceholders.map(p => p.match(/IMAGE_PLACEHOLDER:([^\]]+)/)?.[1]).filter(Boolean);
    
    // Build a more explicit message when images are needed
    let message = `Section "${section_title}" drafted successfully.`;
    if (placeholderIds.length > 0) {
      const descToUse = finalImageDescription || image_description;
      message += `\n\nCONTINUITY REMINDER: This section has ${placeholderIds.length} image placeholder(s): ${placeholderIds.join(', ')}. PROCEED IMMEDIATELY to call 'deerapi_generate_images' with these placeholder_ids and the image_description "${descToUse}". DO NOT STOP.`;
    } else {
      message += ` No image placeholders in this section. Continue to next section or next step.`;
    }
    
    // Upload markdown file immediately to avoid sending large content in response
    const filename = `section-${section_title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const storagePath = `system/${timestamp}-${randomId}-${filename}`;
    
    console.log('[draft_page_section] Uploading section file:', filename);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(storagePath, markdown, {
        contentType: 'text/markdown',
        upsert: true,
      });

    let publicUrl = '';
    if (uploadError) {
      console.error('[draft_page_section] Upload error:', uploadError);
      // Don't fail, just return without publicUrl
    } else {
      const { data: urlData } = supabase.storage
        .from('files')
        .getPublicUrl(storagePath);
      publicUrl = urlData.publicUrl;
      console.log('[draft_page_section] Section file uploaded:', publicUrl);
    }
    
    return { 
      success: true, 
      section_title,
      markdown_content: markdown,
      image_placeholders: placeholderIds,
      image_description: shouldHaveImage && finalImageDescription ? finalImageDescription : (needs_image ? image_description : undefined),
      message,
      // File info for display
      filename,
      publicUrl,
      public_url: publicUrl,
      mimeType: 'text/markdown',
      size: markdown.length,
      metadata: {
        section_title,
        has_images: placeholderIds.length > 0,
        image_placeholders: placeholderIds,
        createdAt: new Date().toISOString(),
        storagePath
      },
      // Add storage path for potential retrieval
      storagePath
    };
  },
});

