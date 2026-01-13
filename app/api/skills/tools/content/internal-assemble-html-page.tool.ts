import { tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simple Markdown to HTML converter
function markdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Tables
  html = html.replace(/^\|(.+)\|$/gim, (match) => {
    const cells = match.split('|').filter(c => c.trim() !== '');
    if (match.includes('---')) {
      return ''; // Header separator line
    }
    const isHeader = !match.toLowerCase().includes('---') && match.includes('|'); // Simplified header detection
    const tag = 'td'; // Will be refined by container replace
    return `<tr>${cells.map(c => `<${tag} class="border border-gray-200 px-4 py-2">${c.trim()}</${tag}>`).join('')}</tr>`;
  });
  
  html = html.replace(/(<tr>.*<\/tr>\n?)+/g, (match) => {
    return `<div class="overflow-x-auto my-8 rounded-xl border border-gray-100 shadow-sm"><table class="min-w-full divide-y divide-gray-200 text-sm">` + match + `</table></div>`;
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-gray-900 mt-12 mb-6">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-extrabold text-gray-900 mt-16 mb-8">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-black text-gray-900 mb-10">$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // Images (must come before links to avoid conflicts)
  // Handle side-by-side images (two consecutive images)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)\s*!\[([^\]]*)\]\(([^)]+)\)/g, 
    '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8"><img src="$2" alt="$1" class="content-image" /><img src="$4" alt="$3" class="content-image" /></div>'
  );
  // Single images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="content-image" />');
  
  // CTA Buttons (links with action-oriented text like "Try", "Get Started", "Sign Up", etc.)
  const ctaPatterns = /\[(Try|Get Started|Sign Up|Start Free|See How|Learn More|Get It Now|Try Now|Start Now|Get Started Free|See Full|Compare Now|Try [^]]+ Now|Get [^]]+ Now)([^\]]*)\]\(([^)]+)\)/gi;
  html = html.replace(ctaPatterns, (match, action, rest, url) => {
    return `<a href="${url}" class="inline-block mt-6 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center">${action}${rest}</a>`;
  });
  
  // Regular Links (not CTAs)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 font-semibold hover:underline">$1</a>');
  
  // Unordered lists
  html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 mb-2">$1</li>');
  html = html.replace(/(<li class="ml-4 mb-2">.*<\/li>\n?)+/g, (match) => {
    return '<ul class="list-disc space-y-2 my-6">' + match + '</ul>';
  });
  
  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-2">$1</li>');
  html = html.replace(/(<li class="ml-4 mb-2">.*<\/li>\n?)+/g, (match) => {
    return '<ol class="list-decimal space-y-2 my-6">' + match + '</ol>';
  });
  
  // Paragraphs (lines that aren't already HTML tags)
  html = html.split('\n').map(line => {
    line = line.trim();
    if (!line) return '';
    if (line.startsWith('<')) return line;
    return `<p class="mb-6 leading-relaxed">${line}</p>`;
  }).filter(line => line).join('\n');
  
  return html;
}

export const assemble_html_page = tool({
  description: `Convert drafted sections into a high-end HTML5 document with advanced Tailwind CSS styling. 

  FEATURES:
  - Professional typography (Plus Jakarta Sans)
  - Layout optimizations for Blogs, Landing Pages, etc.
  - Automatic citation styling for external links
  - Responsive and modern design`,
  parameters: z.object({
    item_id: z.string().describe('The ID of the content item'),
    page_title: z.string().describe('The main H1 title of the page'),
    page_type: z.enum(['blog', 'landing_page', 'comparison', 'guide', 'listicle']).optional().default('blog').describe('Type of content to apply specific styling'),
    seo_title: z.string().optional().describe('SEO title for meta tag'),
    seo_description: z.string().optional().describe('SEO description for meta tag'),
    seo_keywords: z.string().optional().describe('SEO keywords for meta tag (comma-separated)'),
    og_image: z.string().optional().describe('Open Graph image URL for social sharing'),
    site_url: z.string().optional().describe('Main site URL for canonical and OG tags'),
    sections: z.preprocess(
      (val) => Array.isArray(val) ? val.filter(i => i !== null && typeof i === 'object') : val,
      z.array(z.object({
        section_title: z.string().describe('Section H2 title'),
        markdown_content: z.string().describe('Markdown content for this section')
      }))
    ).describe('All drafted sections'),
    images: z.preprocess(
      (val) => Array.isArray(val) ? val.filter(i => i !== null && typeof i === 'object') : val,
      z.array(z.object({
        placeholder_id: z.string().describe('The placeholder ID'),
        public_url: z.string().describe('The COMPLETE public URL'),
        alt_text: z.string().optional().describe('Alt text'),
        publicUrl: z.string().optional(),
        filename: z.string().optional()
      }))
    ).optional().describe('Mapping of image placeholder IDs to URLs'),
  }),
  execute: async ({ item_id, page_title, page_type, seo_title, seo_description, seo_keywords, og_image, site_url, sections, images = [] }) => {
    // Normalize images
    const normalizedImages = await Promise.all(images.map(async (img) => {
      let publicUrl = img.public_url || img.publicUrl || '';
      if (publicUrl && !publicUrl.startsWith('http://') && !publicUrl.startsWith('https://')) {
        const filename = publicUrl || img.filename;
        if (filename) {
          try {
            const { data: fileRecords } = await supabase
              .from('files')
              .select('public_url')
              .eq('filename', filename)
              .order('created_at', { ascending: false })
              .limit(1);
            if (fileRecords && fileRecords.length > 0 && fileRecords[0].public_url) {
              publicUrl = fileRecords[0].public_url;
            }
          } catch (e) {}
        }
      }
      return { placeholder_id: img.placeholder_id, public_url: publicUrl, alt_text: img.alt_text };
    }));
    
    const imageMap = new Map(normalizedImages.map(img => [img.placeholder_id, img]));
    
    // Check for missing images
    const missingImages: string[] = [];
    sections.forEach(section => {
      const placeholders = section.markdown_content.match(/!\[IMAGE_PLACEHOLDER:([^\]]+)\]/g) || [];
      placeholders.forEach(placeholder => {
        const placeholderId = placeholder.match(/IMAGE_PLACEHOLDER:([^\]]+)/)?.[1];
        if (placeholderId && !imageMap.has(placeholderId)) {
          missingImages.push(`${placeholderId} (in section "${section.section_title}")`);
        }
      });
    });
    
    if (missingImages.length > 0) {
      return { success: false, error: `MISSING IMAGES: ${missingImages.join(', ')}`, item_id };
    }
    
    // Convert Markdown to HTML
    const sectionsHtml = sections.map((section, index) => {
      let markdown = section.markdown_content;
      
      // Robust title cleaning
      const sectionTitle = section.section_title.trim();
      const escapedTitle = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const redundantPatterns = [
        new RegExp(`^\\s*#{1,3}\\s*${escapedTitle}\\s*(\\n|$)`, 'i'), 
        new RegExp(`^\\s*\\*\\*\\s*${escapedTitle}\\s*\\*\\*\\s*(\\n|$)`, 'i'), 
        new RegExp(`^\\s*${escapedTitle}\\s*(\\n|$)`, 'i'), 
      ];
      redundantPatterns.forEach(pattern => { markdown = markdown.replace(pattern, ''); });

      // Replace images
      markdown = markdown.replace(/!\[IMAGE_PLACEHOLDER:([^\]]+)\]/g, (match, placeholderId) => {
        const imageInfo = imageMap.get(placeholderId);
        if (imageInfo && imageInfo.public_url) {
          const altText = imageInfo.alt_text || section.section_title || 'Section image';
          return `![${altText}](${imageInfo.public_url})`;
        }
        return '';
      });
      
      const html = markdownToHtml(markdown);
      
      // High-end styling
      const sectionId = `section-${index}`;
      const sectionClass = "py-12 border-b border-gray-100 last:border-0";
      const titleClass = "text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight";

      return `    <section id="${sectionId}" class="${sectionClass}">
      <h2 class="${titleClass}">${escapeHtml(section.section_title)}</h2>
      <div class="prose prose-indigo prose-lg max-w-none text-gray-600 leading-relaxed space-y-6 citation-enhanced">
${html.split('\n').map(line => '        ' + line).join('\n')}
      </div>
    </section>`;
    }).join('\n\n');
    
    const tocHtml = sections.map((s, i) => `
      <li>
        <a href="#section-${i}" class="text-gray-500 hover:text-indigo-600 transition-colors py-1 block border-l-2 border-transparent hover:border-indigo-600 pl-4">
          ${escapeHtml(s.section_title)}
        </a>
      </li>`).join('');

    const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    :root {
      --primary: #4f46e5;
      --primary-dark: #4338ca;
    }

    body { 
      font-family: 'Plus Jakarta Sans', sans-serif; 
      background-color: #ffffff;
      scroll-behavior: smooth;
    }

    .page-content-scope .prose a { 
      color: var(--primary); 
      text-decoration: none;
      border-bottom: 2px solid rgba(79, 70, 229, 0.1);
      font-weight: 600; 
      transition: all 0.2s; 
    }
    
    .page-content-scope .prose a:hover { 
      color: var(--primary-dark); 
      border-bottom-color: var(--primary-dark);
      background-color: rgba(79, 70, 229, 0.05); 
    }

    .page-content-scope .prose h3 { 
      font-size: 1.75rem; 
      font-weight: 800; 
      color: #111827; 
      margin-top: 4rem; 
      margin-bottom: 1.5rem;
      letter-spacing: -0.02em;
    }

    .page-content-scope .prose p { 
      margin-bottom: 1.75rem; 
      font-size: 1.125rem;
      line-height: 1.8;
    }

    .page-content-scope .prose ul, .page-content-scope .prose ol { 
      margin: 2rem 0; 
      padding-left: 1.5rem; 
    }

    .page-content-scope .prose li { 
      margin-bottom: 1rem; 
      padding-left: 0.5rem;
    }

    .page-content-scope .content-image { 
      width: 100%; 
      border-radius: 2rem; 
      box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.15); 
      margin: 5rem 0; 
      transition: transform 0.3s ease;
    }
    
    .page-content-scope .content-image:hover {
      transform: scale(1.01);
    }

    .hero-gradient { 
      background: radial-gradient(circle at top right, rgba(79, 70, 229, 0.05), transparent),
                  radial-gradient(circle at bottom left, rgba(245, 158, 11, 0.05), transparent);
    }

    .citation-enhanced a[href^="http"]::after { 
      content: '↗'; 
      font-size: 0.7em; 
      margin-left: 4px; 
      vertical-align: super; 
      opacity: 0.4; 
    }

    .sticky-toc {
      position: sticky;
      top: 100px;
      max-height: calc(100vh - 150px);
      overflow-y: auto;
    }

    .reading-progress {
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 4px;
      background: linear-gradient(to right, #4f46e5, #ec4899);
      z-index: 100;
    }

    @media (max-width: 1024px) {
      .toc-sidebar { display: none; }
    }
    `;

    // Generate different layouts based on page_type
    let bodyContent = '';
    
    if (page_type === 'blog') {
      // BLOG: Sidebar TOC + Article Content
      bodyContent = `
  <div class="reading-progress" id="progress-bar"></div>
  
  <header class="hero-gradient border-b border-gray-100 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 py-24 md:py-40">
      <div class="max-w-3xl">
        <nav class="flex items-center gap-2 mb-8">
          <span class="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">${page_type}</span>
          <span class="text-gray-300">•</span>
          <span class="text-gray-500 text-xs font-medium">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </nav>
        <h1 class="text-5xl md:text-7xl font-[900] text-gray-900 tracking-tight leading-[1.05] mb-10">
          ${escapeHtml(page_title)}
        </h1>
        ${seo_description ? `<p class="text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed font-medium">${escapeHtml(seo_description)}</p>` : ''}
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-6 py-20">
    <div class="flex flex-col lg:flex-row gap-16">
      <!-- Sidebar TOC -->
      <aside class="lg:w-1/4 toc-sidebar">
        <div class="sticky-toc">
          <h4 class="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Table of Contents</h4>
          <ul class="space-y-4 text-sm font-bold">
            ${tocHtml}
          </ul>
          
          <div class="mt-12 p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <h5 class="text-sm font-bold text-gray-900 mb-2">Expert Guide</h5>
            <p class="text-xs text-gray-500 leading-relaxed">This content was meticulously crafted using real-time data and expert analysis.</p>
          </div>
        </div>
      </aside>

      <!-- Article Content -->
      <article class="lg:w-3/4 max-w-3xl">
        ${sectionsHtml}
      </article>
    </div>
  </main>

  <script>
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById('progress-bar').style.width = scrolled + '%';
    });
  </script>`;
    } else if (page_type === 'landing_page') {
      // LANDING PAGE: Full-width, conversion-focused, no TOC
      bodyContent = `
  <header class="hero-gradient border-b border-gray-100 relative overflow-hidden">
    <div class="max-w-6xl mx-auto px-6 py-20 md:py-32 text-center">
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-[900] text-gray-900 tracking-tight leading-[1.05] mb-8">
        ${escapeHtml(page_title)}
      </h1>
      ${seo_description ? `<p class="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium mb-10">${escapeHtml(seo_description)}</p>` : ''}
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-6">
    ${sectionsHtml}
  </main>`;
    } else if (page_type === 'comparison') {
      // COMPARISON: Full-width, table-optimized, no TOC
      bodyContent = `
  <header class="bg-gradient-to-br from-orange-50 via-white to-amber-50 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-6 py-20 md:py-32">
      <div class="max-w-4xl mx-auto text-center">
        <span class="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-bold uppercase tracking-wider mb-6">Comparison</span>
        <h1 class="text-4xl md:text-6xl font-[900] text-gray-900 tracking-tight leading-[1.1] mb-8">
          ${escapeHtml(page_title)}
        </h1>
        ${seo_description ? `<p class="text-xl text-gray-600 leading-relaxed font-medium">${escapeHtml(seo_description)}</p>` : ''}
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-6">
    ${sectionsHtml}
  </main>`;
    } else if (page_type === 'guide') {
      // GUIDE: Full-width, step-focused, no TOC
      bodyContent = `
  <header class="bg-gradient-to-br from-green-50 via-white to-emerald-50 border-b border-gray-100">
    <div class="max-w-5xl mx-auto px-6 py-20 md:py-32">
      <span class="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-bold uppercase tracking-wider mb-6">Step-by-Step Guide</span>
      <h1 class="text-4xl md:text-6xl font-[900] text-gray-900 tracking-tight leading-[1.1] mb-8">
        ${escapeHtml(page_title)}
      </h1>
      ${seo_description ? `<p class="text-xl text-gray-600 max-w-3xl leading-relaxed font-medium">${escapeHtml(seo_description)}</p>` : ''}
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-6">
    ${sectionsHtml}
  </main>`;
    } else if (page_type === 'listicle') {
      // LISTICLE: Full-width, numbered items prominent, no TOC
      bodyContent = `
  <header class="bg-gradient-to-br from-pink-50 via-white to-rose-50 border-b border-gray-100">
    <div class="max-w-5xl mx-auto px-6 py-20 md:py-32">
      <span class="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-bold uppercase tracking-wider mb-6">Curated List</span>
      <h1 class="text-4xl md:text-6xl font-[900] text-gray-900 tracking-tight leading-[1.1] mb-8">
        ${escapeHtml(page_title)}
      </h1>
      ${seo_description ? `<p class="text-xl text-gray-600 max-w-3xl leading-relaxed font-medium">${escapeHtml(seo_description)}</p>` : ''}
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-6">
    ${sectionsHtml}
  </main>`;
    } else {
      // DEFAULT: Use blog layout as fallback
      bodyContent = `
  <div class="reading-progress" id="progress-bar"></div>
  
  <header class="hero-gradient border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-6 py-24 md:py-40">
      <div class="max-w-3xl">
        <h1 class="text-5xl md:text-7xl font-[900] text-gray-900 tracking-tight leading-[1.05] mb-10">
          ${escapeHtml(page_title)}
        </h1>
        ${seo_description ? `<p class="text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed font-medium">${escapeHtml(seo_description)}</p>` : ''}
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-6 py-20">
    ${sectionsHtml}
  </main>`;
    }

    // Build meta tags
    const metaTags = [
      `<meta charset="UTF-8">`,
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
      `<title>${escapeHtml(seo_title || page_title)}</title>`,
      seo_description ? `<meta name="description" content="${escapeHtml(seo_description)}">` : '',
      seo_keywords ? `<meta name="keywords" content="${escapeHtml(seo_keywords)}">` : '',
      // Open Graph tags
      `<meta property="og:title" content="${escapeHtml(seo_title || page_title)}">`,
      seo_description ? `<meta property="og:description" content="${escapeHtml(seo_description)}">` : '',
      `<meta property="og:type" content="website">`,
      og_image ? `<meta property="og:image" content="${escapeHtml(og_image)}">` : '',
      site_url ? `<meta property="og:url" content="${escapeHtml(site_url)}">` : '',
      // Twitter Card tags
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${escapeHtml(seo_title || page_title)}">`,
      seo_description ? `<meta name="twitter:description" content="${escapeHtml(seo_description)}">` : '',
      og_image ? `<meta name="twitter:image" content="${escapeHtml(og_image)}">` : '',
      site_url ? `<link rel="canonical" href="${escapeHtml(site_url)}">` : '',
    ].filter(Boolean).join('\n  ');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${metaTags}
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${customStyles}</style>
</head>
<body class="antialiased text-gray-900 bg-white page-content-scope">
${bodyContent}
</body>
</html>`;

    console.log(`[assemble_html_page] Saving intermediate HTML to database for item: ${item_id}`);
    await supabase.from('content_items').update({ generated_content: html, status: 'in_production', updated_at: new Date().toISOString() }).eq('id', item_id);

    return {
      success: true,
      item_id,
      html_content: html.length > 5000 ? html.substring(0, 5000) + '... (truncated)' : html,
      message: `Base HTML page assembled with high-end ${page_type} styling. Saved to database.

CONTINUITY REMINDER: This is ONLY the base HTML. You MUST immediately continue with these steps IN THIS EXACT ORDER:
1. Call 'merge_html_with_site_contexts' with item_id: "${item_id}" to add site header/footer
2. Call 'fix_style_conflicts' with item_id: "${item_id}" to isolate styles
3. Call 'save_final_page' with item_id: "${item_id}" to finalize and save
DO NOT STOP until 'save_final_page' returns success.`,
      filename: `page-${item_id}.html`,
      mimeType: 'text/html',
      size: html.length,
      needsUpload: true,
      metadata: { item_id, page_title, page_type, createdAt: new Date().toISOString() }
    };
  },
});

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
