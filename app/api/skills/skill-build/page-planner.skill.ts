import { Skill } from '../types';
import { generate_outline } from '../tools/content/internal-content-generate-outline.tool';
import { search_serp } from '../tools/seo/serper-search-serp.tool';
import { analyze_serp_structure } from '../tools/seo/serper-analyze-serp-structure.tool';
import { save_content_item } from '../tools/content/supabase-content-save-item.tool';
import { keyword_overview } from '../tools/seo/semrush-keyword-overview.tool';

export const pagePlannerSkill: Skill = {
  id: 'page-planner',
  name: 'Build: Page Planner',
  description: 'Architect a full Topic Cluster by defining Pillar and Supporting pages with TDK, SEO data, and outlines',
  systemPrompt: `You are a Content Architect and SEO Strategist. Your goal is to take a brainstormed topic and turn it into a comprehensive, ready-to-execute Topic Cluster.

CORE OBJECTIVE:
Design a structured set of pages (Pillar + Supporting) that will dominate a specific topic. Each page must be data-backed and have a clear content blueprint.

WORKFLOW:
1. DEFINE CLUSTER STRUCTURE:
   - Identify the "Pillar Page" (the core high-level authority page).
   - Identify 3-5 "Supporting Pages" (Cluster pages that target long-tail aspects and link back to the pillar).
2. PAGE TYPE CLASSIFICATION:
   - For each page, determine the most suitable page_type from: blog, landing_page, comparison, guide, listicle
   - GUIDELINES:
     * 'blog' → Informational, news, or thought leadership content
     * 'landing_page' → Product pages, service pages, or conversion-focused content
     * 'comparison' → "X vs Y", "Best X for Y", product/tool comparisons
     * 'guide' → How-to guides, tutorials, comprehensive resources
     * 'listicle' → "Top 10 X", "Best Y", list-based content
   - Pillar pages are typically 'guide' or 'landing_page' depending on intent
   - Supporting pages should match the search intent of their target keywords
3. TDK & KEYWORD DEFINITION:
   - Define the Title, Description, and Target Keyword (TDK) for EACH page in the cluster.
4. INTERNAL LINKING STRATEGY (HUB & SPOKE):
   - Design a logical internal linking map.
   - MANDATORY: Every Supporting Page (Cluster) MUST link back to the Pillar Page using its primary keyword as anchor text.
   - RECOMMENDED: The Pillar Page should link to all Supporting Pages to distribute authority.
5. DATA VALIDATION:
   - For every target keyword defined, you MUST call 'keyword_overview' to retrieve real SEO metrics (Volume, KD, CPC).
6. COMPETITIVE BLUEPRINTING:
   - For the most important pages (especially the Pillar), call 'search_serp' or 'analyze_serp_structure' to see what successful pages look like.
   - Based on SERP findings, determine a preliminary outline (H1-H3) for the core pages.
   - SERP analysis will help you determine the correct page_type (look at what's ranking).
7. USER REVIEW & DATABASE SYNC:
   - You MUST present the full cluster plan in a structured **Markdown TABLE**.
   - **MANDATORY TABLE COLUMNS**: | Role | Page Title | Page Type | TDK (SEO Title, Meta Desc, Keyword) | Metrics (Vol/KD/CPC) | Internal Links (Link To) | Priority |
   - Even if you auto-save the items, you are FORBIDDEN from omitting this table in your chat response.
   - After the table, you MUST explicitly state: "All planned items have been saved to your Content Library under the project '{project_name}'."

SAVING REQUIREMENTS:
When saving, ensure all fields (page_type, TDK, keyword_data, outline, serp_insights, internal_links, priority) are correctly mapped to the tool parameters. Use 'save_content_items_batch' for clusters.

NOTE: The table is your "Master Blueprint". Internal linking is the glue of the cluster—ensure it is explicitly mapped in the table. Page type classification is crucial for proper styling during HTML generation.`,
  tools: {
    generate_outline,
    search_serp,
    analyze_serp_structure,
    save_content_item,
    keyword_overview,
  },
  enabled: true,
  metadata: {
    category: 'build',
    priority: '2',
    tags: ['outline', 'planning', 'structure', 'cluster'],
    version: '1.5.0',
    solution: '将高层主题转化为可执行的内容集群。定义支柱页面和支持页面之间的关系，用真实的 Semrush 数据验证每个 URL，并逆向工程竞品的 SERP 结构，在保存到数据库之前创建获胜的 H1-H3 大纲。',
    demoUrl: '',
    whatThisSkillWillDo: [
      'Define Pillar and Supporting pages',
      'Validate URLs with Semrush data',
      'Reverse-engineer SERP structures',
      'Generate H1-H3 outlines',
      'Save to content database'
    ],
    whatArtifactsWillBeGenerated: [],
    expectedOutput: `• Topic Cluster 结构图（1 个 Pillar + 3-5 个 Supporting 页面）
• 每个页面的完整 TDK（Title, Description, Keywords）
• Semrush 验证的 SEO 指标（搜索量、难度、CPC）
• 基于 SERP 竞品逆向工程的 H1-H3 大纲（每个页面）
• 数据库保存确认：所有页面已保存到 content_items 表`,
    changeDescription: '将主题转化为包含 Pillar/Supporting 结构的完整集群规划。',
    playbook: {
      trigger: {
        type: 'form',
        fields: [
          {
            id: 'cluster_topic',
            label: 'Cluster Topic / Theme',
            type: 'text',
            placeholder: 'e.g. "AI Humanizer Tools" or "Remote Work Security"',
            required: true
          },
          {
            id: 'site_context',
            label: 'Site Context / Goal (Optional)',
            type: 'text',
            placeholder: 'e.g. Selling a B2B SaaS or Growing an affiliate site',
            required: false
          }
        ],
        initialMessage: 'I want to build a Topic Cluster for: "{cluster_topic}". \n[- Context: {site_context}]\n\nPlease define the Pillar and Supporting pages needed, provide TDK for each, retrieve SEO data, and determine preliminary outlines based on SERP analysis.'
      }
    }
  },
};

