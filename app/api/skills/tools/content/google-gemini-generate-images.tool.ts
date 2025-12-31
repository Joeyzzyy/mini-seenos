import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

/**
 * Google Gemini Image Generation Tool (v2.1 Precision)
 * Fixed aspect ratio control and instruction weighting.
 */

export const generate_images = tool({
  description: `Generate professional images using Google Gemini Image model for content pages. 

MANDATORY STEP - DO NOT SKIP:
- This tool MUST be called after drafting sections with draft_page_section
- Check EVERY draft_page_section response for the image_placeholders array
- If image_placeholders has any items, you MUST call this tool
- This is a REQUIRED step, not optional - assemble_html_page will fail if placeholders exist without images

HOW TO USE:
1. After ALL sections are drafted, review each draft_page_section response
2. Collect all sections that have image_placeholders array with items
3. For each section with placeholders, call this tool with:
   - prompt: Use the image_description from that draft_page_section call
   - placeholder_id: Use the exact placeholder_id from the image_placeholders array
   - aspect_ratio: Choose appropriate ratio (16:9 for hero images, square for diagrams, portrait for tall illustrations)
4. You can generate multiple images in one call by passing an array of prompts
5. Store the returned public_urls - you'll need them for assemble_html_page

IMPORTANT:
- Images will be automatically uploaded and you'll receive public_urls
- You MUST pass these public_urls to assemble_html_page in the images array
- The images array format: [{placeholder_id: "section_xxx", public_url: "https://...", alt_text: "..."}]
- DO NOT call assemble_html_page until all images are generated
- Supports advanced controls like aspect ratio, quality, transparency, and reference images`,
  parameters: z.object({
    user_id: z.string().describe('The current user ID from system context'),
    conversation_id: z.string().optional().describe('The current conversation ID from system context'),
    prompts: z.array(z.object({
      prompt: z.string().describe('Precise visual description. Use same language as user query.'),
      title: z.string().optional().describe('Short title for the image asset'),
      aspect_ratio: z.enum(['square', 'portrait', 'landscape', '21:9', '4:3', '3:4', '16:9', '9:16']).optional().default('16:9').describe('Physical dimensions of the output'),
      quality: z.enum(['medium', 'high']).optional().default('medium').describe('High uses professional rendering mode for better details'),
      background: z.enum(['auto', 'transparent', 'opaque']).optional().default('auto').describe('Use transparent for assets like icons or product shots'),
      source_image_urls: z.array(z.string().url()).optional().describe('Reference images for style or content consistency'),
      placeholder_id: z.string().describe('A unique ID like "hero_image"')
    })).describe('List of image configurations to generate'),
  }),
  execute: async ({ user_id, conversation_id, prompts }) => {
    try {
      console.log('[generate_images] Received prompts:', JSON.stringify(prompts, null, 2));
      console.log('[generate_images] User ID:', user_id, 'Conversation ID:', conversation_id);
      
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.AZURE_OPENAI_API_KEY;
      
      // Initialize Supabase client for uploading
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Check if API key is configured
      if (!apiKey) {
        const errorMsg = 'GOOGLE_GENERATIVE_AI_API_KEY is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your .env.local file.';
        console.error('[generate_images]', errorMsg);
        return {
          success: false,
          error: errorMsg,
          images: prompts.map(p => ({
            placeholderId: p.placeholder_id,
            status: 'error',
            error: errorMsg
          }))
        };
      }
      
      const results = await Promise.all(prompts.map(async (p) => {
        try {
          // Map enum to standard ratio strings
          const ratioMap: Record<string, string> = {
            'square': '1:1',
            'portrait': '3:4',
            'landscape': '4:3',
            '16:9': '16:9',
            '9:16': '9:16',
            '21:9': '21:9',
            '4:3': '4:3',
            '3:4': '3:4'
          };
          const targetRatio = ratioMap[p.aspect_ratio || '16:9'] || '16:9';

          // Construct a more command-oriented prompt
          const commandPrompt = `Generate a high-quality ${targetRatio} image. 
Subject: ${p.prompt}
Style: ${p.quality === 'high' ? 'High-end professional photography, 8k, extremely detailed' : 'Professional digital art'}
${p.background === 'transparent' ? 'RENDER WITH TRANSPARENT BACKGROUND (ALPHA CHANNEL).' : ''}
${p.source_image_urls && p.source_image_urls.length > 0 ? `Reference visual style from: ${p.source_image_urls.join(', ')}` : ''}`.trim();

          // Validate API key format (should not be undefined or empty)
          if (!apiKey || apiKey.trim() === '') {
            throw new Error('API key is missing or empty. Please configure GOOGLE_GENERATIVE_AI_API_KEY in .env.local');
          }
          
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;
          console.log('[generate_images] Calling Google Gemini API for placeholder:', p.placeholder_id);
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: commandPrompt }]
              }]
              // Note: We don't use response_mime_type here as it caused 400 errors previously
            })
          }).catch((fetchError: any) => {
            // Catch network errors (like ECONNREFUSED, ENOTFOUND, etc.)
            console.error('[generate_images] Fetch error details:', {
              message: fetchError.message,
              code: fetchError.code,
              errno: fetchError.errno,
              syscall: fetchError.syscall
            });
            throw new Error(`Network error when calling Google Gemini API: ${fetchError.message}. Please check your internet connection and API key.`);
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google API error (${response.status}): ${errorText}`);
          }

          const data = await response.json();
          const imagePart = data.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData || part.inline_data);
          
          if (!imagePart) {
            console.error('[generate_images] No image data found. Full response:', JSON.stringify(data));
            throw new Error('Model did not return image data.');
          }

          const inlineData = imagePart.inlineData || imagePart.inline_data;
          const base64Content = inlineData.data;
          const sizeInBytes = Math.floor((base64Content.length * 3) / 4);
          const filename = `generated-${p.placeholder_id}-${Date.now()}.png`;
          const mimeType = inlineData.mimeType || inlineData.mime_type || 'image/png';

          console.log('[generate_images] Image generated successfully for placeholder:', p.placeholder_id);

          // Upload to Supabase immediately to get public URL
          const buffer = Buffer.from(base64Content, 'base64');
          const storagePath = `system/${filename}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('files')
            .upload(storagePath, buffer, {
              contentType: mimeType,
              upsert: false,
            });
          
          if (uploadError) {
            console.error('[generate_images] Upload error:', uploadError);
            throw new Error(`Failed to upload image: ${uploadError.message}`);
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('files')
            .getPublicUrl(storagePath);
          
          console.log('[generate_images] Image uploaded to:', publicUrl);

          // Save file record to database
          const { data: fileRecord, error: dbError } = await supabase
            .from('files')
            .insert({
              user_id: user_id,
              conversation_id: conversation_id || null,
              filename: filename,
              original_filename: filename,
              file_type: 'image',
              mime_type: mimeType,
              file_size: sizeInBytes,
              storage_path: storagePath,
              public_url: publicUrl,
              metadata: {
                placeholderId: p.placeholder_id,
                title: p.title,
                aspect_ratio: targetRatio,
                quality: p.quality,
                background: p.background,
                provider: 'google-gemini',
                isGenerated: true,
                generatedAt: new Date().toISOString()
              }
            })
            .select()
            .single();

          if (dbError) {
            console.error('[generate_images] Database error (image still uploaded):', dbError);
          } else {
            console.log('[generate_images] File record saved with ID:', fileRecord.id);
          }

          // Return ONLY metadata (no base64!) to prevent token overflow
          return {
            filename: filename,
            placeholderId: p.placeholder_id,
            mimeType: mimeType,
            publicUrl: publicUrl,
            public_url: publicUrl,
            needsUpload: false,
            size: sizeInBytes,
            style: p.quality === 'high' ? 'professional' : 'standard',
            status: 'success',
            metadata: {
              title: p.title,
              aspect_ratio: targetRatio,
              quality: p.quality,
              background: p.background,
              provider: 'google-gemini',
              storagePath: storagePath
            }
          };
        } catch (innerError: any) {
          console.error('[generate_images] Inner error for placeholder', p.placeholder_id, ':', innerError.message);
          console.error('[generate_images] Error stack:', innerError.stack);
          
          // Provide more detailed error message
          let errorMessage = innerError.message;
          if (innerError.message?.includes('fetch failed') || innerError.message?.includes('ECONNREFUSED')) {
            errorMessage = `Network error: Unable to connect to Google Gemini API. Please check your internet connection and API key configuration. Original error: ${innerError.message}`;
          } else if (innerError.message?.includes('401') || innerError.message?.includes('403')) {
            errorMessage = `Authentication error: Invalid API key. Please check your GOOGLE_GENERATIVE_AI_API_KEY in .env.local. Original error: ${innerError.message}`;
          } else if (innerError.message?.includes('429')) {
            errorMessage = `Rate limit error: Too many requests. Please wait and try again. Original error: ${innerError.message}`;
          }
          
          return { 
            placeholderId: p.placeholder_id, 
            status: 'error', 
            error: errorMessage,
            prompt: p.prompt // Include prompt for debugging
          };
        }
      }));

      const successfulImages = results.filter(r => r.status === 'success');
      const failedImages = results.filter(r => r.status === 'error');
      
      // Build comprehensive error message if all failed
      let errorMessage: string | undefined;
      if (successfulImages.length === 0 && failedImages.length > 0) {
        const errors = failedImages.map(f => `Placeholder "${f.placeholderId}": ${f.error}`).join('; ');
        errorMessage = `All image generation failed. ${errors}`;
      } else if (failedImages.length > 0) {
        const errors = failedImages.map(f => `Placeholder "${f.placeholderId}": ${f.error}`).join('; ');
        errorMessage = `Some images failed to generate. ${errors}`;
      }
      
      return { 
        success: successfulImages.length > 0, 
        images: results,
        successful_count: successfulImages.length,
        failed_count: failedImages.length,
        error: errorMessage
      };
    } catch (error: any) { 
      return { success: false, error: error.message }; 
    }
  },
});
