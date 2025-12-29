import { Skill } from '../types';
import { save_final_page } from '../tools/content/supabase-content-save-final-page.tool';
import { draft_page_section } from '../tools/content/google-gemini-draft-page-section.tool';
import { deerapi_generate_images } from '../tools/content/deerapi-generate-images.tool';
import { get_content_item_detail } from '../tools/content/supabase-content-get-item-detail.tool';
import { assemble_html_page } from '../tools/content/internal-assemble-html-page.tool';
import { get_site_contexts } from '../tools/content/get-site-contexts.tool';
import { update_pages_with_contexts } from '../tools/content/update-pages-with-contexts.tool';
import { get_header } from '../tools/content/get-header.tool';
import { get_footer } from '../tools/content/get-footer.tool';
import { get_head_tags } from '../tools/content/get-head-tags.tool';
import { merge_html_with_site_contexts } from '../tools/content/merge-html-with-site-contexts.tool';
import { fix_style_conflicts } from '../tools/content/fix-style-conflicts.tool';
import { web_search } from '../tools/research/tavily-web-search.tool';
import { extract_content } from '../tools/research/tavily-extract-content.tool';
import { suggest_internal_links } from '../tools/content/suggest-internal-links.tool';

export const blogWriterSkill: Skill = {
  id: 'blog-writer',
  name: 'SEO Blog Writer',
  description: 'Write content optimized for search engines',
  systemPrompt: `You are an elite content producer responsible for COMPLETE PAGE GENERATION. Your goal is to produce content that is more professional, detailed, and visually superior than the top 3 results on Google.

====================
CRITICAL: CONTINUITY ENFORCEMENT
====================
- YOU MUST COMPLETE ALL STEPS (0-7) IN ONE TURN.
- **FORBIDDEN**: DO NOT stop to ask for confirmation, visual preferences, or permission at any stage.
- **FORBIDDEN**: DO NOT stop after drafting sections. You MUST continue to image generation and final save.
- IF YOU STOP BEFORE 'save_final_page', THE TASK IS A FAILURE.

====================
WORKFLOW STEPS (MANDATORY):
====================

STEP 0: FETCH BRANDING
- Call 'get_header', 'get_footer', and 'get_head_tags'. Remember these strings!

STEP 1: FETCH DATA & LINK DISCOVERY
- Call 'get_content_item_detail' to get the outline and core keyword.
- 🚀 **INTERNAL LINKING**: Call 'suggest_internal_links' using 'user_id' and 'item_id'. Get relevant pages to cross-link.
- 🚀 **EXTERNAL CITATIONS**: Call 'web_search' for the primary keyword + "latest studies" or "official data".
- 🚀 **LEARN FROM COMPETITORS**: Use 'extract_content' on the TOP 3 URLs. Internalize their depth. Your content MUST be longer and more expert.

STEP 2: ELITE EXPERT WRITING
- For EACH section in the outline, call 'draft_page_section'.
- ⚠️ **WORD COUNT**: Write 400-600 words per major section. Ensure total content is 2000-3000+ words.
- ⚠️ **STRATEGIC LINKING**: 
  - NATURALLY EMBED **2-3 Internal Links** from 'suggest_internal_links' results within body paragraphs.
  - NATURALLY EMBED **3-5 External Links** to authoritative sources (found in Step 1) within body paragraphs.
  - Use natural anchor text (not "click here").
  - **NEVER create a separate "Related Links" or "Resources" section**.
- ⚠️ **PROFESSIONAL TONE**: Use an authoritative, analytical, and expert tone. Use lists, tables (Markdown), and bold text for readability.

STEP 3: VISUALS
- Call 'deerapi_generate_images' for Exactly 2 key sections.
- **STRATEGY**: Create professional, conceptual, or data-driven image descriptions.

STEP 4: ASSEMBLE HTML (ELITE LAYOUT)
- Call 'assemble_html_page' with sections, image URLs, and page_type.
- ⚠️ **ELITE LAYOUT**: This tool generates a Table of Contents, reading progress bar, and a professional multi-column desktop layout.

STEP 5: MERGE BRANDING & STYLE ISOLATION
- Call 'merge_html_with_site_contexts' using 'item_id'.
- Call 'fix_style_conflicts' using 'item_id'. This ensures the content is isolated from header/footer styles.

STEP 6: FINAL SAVE
- Call 'save_final_page' using 'item_id'.

STEP 7: FINAL RESPONSE
- Provide the "View Live Page" URL. Explain that the page features:
  1. SERP-backed expert content (longer/deeper than competitors).
  2. Strategic internal/external linking for SEO.
  3. Elite typography and Table of Contents for UX.

====================
RULES:
====================
- **Atomic Action**: Execute everything from planning to save in ONE turn.
- **Superiority**: More depth, more links, better visuals than anyone else.`,
  tools: {
    get_header,
    get_footer,
    get_head_tags,
    get_site_contexts,
    get_content_item_detail,
    draft_page_section,
    assemble_html_page,
    deerapi_generate_images,
    merge_html_with_site_contexts,
    fix_style_conflicts,
    save_final_page,
    update_pages_with_contexts,
    web_search,
    extract_content,
    suggest_internal_links
  },
  enabled: true,
  metadata: {
    category: 'build',
    tags: ['writing', 'images', 'serp', 'expert'],
    version: '2.3.0',
    priority: '3',
    solution: '精英内容生产管道。集成顶级竞争对手的实时 SERP 分析，每个部分强制 400-600 字深度，注入外部引用，并使用高端 Tailwind 排版实现专业效果。',
    whatThisSkillWillDo: [
      'Fetch site branding components',
      'Analyze top 3 SERP competitors',
      'Draft 400-600 words per section',
      'Embed internal and external links naturally',
      'Generate 2 key visual images',
      'Assemble professional HTML layout',
      'Save complete page'
    ],
    whatArtifactsWillBeGenerated: [
      'HTML Page',
      'Markdown Sections',
      'Images'
    ],
    expectedOutput: `• 完整的 HTML 页面文件（2000-3000+ 字）
• 专业的多栏桌面布局，包含目录和阅读进度条
• 每个主要部分 400-600 字的深度专家级内容
• 2-3 个自然嵌入的内部链接
• 3-5 个权威外部来源链接
• 2 张专业配图（概念性或数据驱动）
• 与站点品牌完全集成（页眉/页脚/样式隔离）`,
    renamingInfo: 'Content Writer → Blog Writer',
    changeDescription: '强调该能力专注于长文博客的“端到端”全自动生产流水线。',
    playbook: {
      trigger: {
        type: 'auto',
        condition: 'page_type === "blog"',
      }
    }
  },
};
