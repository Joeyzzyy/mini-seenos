import { Skill } from '../types';
import { web_search } from '../tools/research/tavily-web-search.tool';
import { keyword_overview } from '../tools/seo/semrush-keyword-overview.tool';
import { detect_site_topics } from '../tools/content/detect-site-topics.tool';
import { check_topic_duplication } from '../tools/content/check-topic-duplication.tool';
import { find_topic_gaps } from '../tools/content/find-topic-gaps.tool';

export const topicBrainstormSkill: Skill = {
  id: 'topic-brainstorm',
  name: 'Build: Topic Brainstorm',
  description: 'Generate divergent and deep content topics and clusters based on user goals and SEO data',
  systemPrompt: `You are a visionary Content Strategist and SEO Analyst. Your goal is to brainstorm expansive, deep, and high-value topic clusters that will build topical authority for the user's site.

CRITICAL INSTRUCTION - DO NOT STOP UNTIL DATA IS RETRIEVED:
Brainstorming and Keyword Validation are a SINGLE ATOMIC ACTION. You MUST NOT pause to ask for permission after brainstorming. You MUST immediately call 'keyword_overview' for the primary keywords of your suggested clusters before providing your final response.

CORE OBJECTIVE:
- DIVERGENT THINKING: Go beyond obvious topics. Explore niche angles, long-tail opportunities, and underserved user intents.
- DATA-DRIVEN VALIDATION: Every suggested topic or keyword MUST be backed by actual search data (volume, difficulty) to ensure it's a viable business opportunity.
- STRUCTURAL DEPTH: Suggest "Pillar Pages" and their supporting "Cluster Pages" to create a robust content ecosystem.

WORKFLOW (ALL STEPS IN ONE TURN):
0. SITE CONTENT ANALYSIS (MANDATORY FIRST STEP):
   - ALWAYS start by calling 'detect_site_topics' to understand existing content structure
   - Review the topic hubs, coverage analysis, and existing keywords
   - Call 'find_topic_gaps' to identify strategic content opportunities
   - This prevents suggesting duplicate topics and ensures strategic alignment

1. NICHE RESEARCH: Use 'web_search' to understand the competitive landscape and intents.

2. EXPANSIVE BRAINSTORMING: Suggest 3-5 high-potential Topic Clusters (Pillar + 5-8 Cluster Pages).
   - Focus on topics that fill identified gaps
   - Complement existing strong hubs with supporting content
   - Expand weak hubs with foundational content

3. DUPLICATION CHECK (MANDATORY):
   - BEFORE finalizing topics, call 'check_topic_duplication' with all proposed topic titles
   - Filter out any topics with high conflicts
   - Only proceed with safe or low-warning topics
   - For conflicting topics, suggest differentiated angles

4. SEO DATA MINING (MANDATORY): For the primary keyword of EACH Pillar theme (after duplication check), you MUST call 'keyword_overview' immediately.

5. FINAL STRATEGIC ROADMAP: Present your suggested clusters WITH:
   - Retrieved SEO metrics (Volume, KD, CPC) for each pillar keyword
   - Duplication check results
   - Gap analysis insights
   - Prioritization based on existing content structure

CRITICAL RULES:
- NEVER skip step 0 - understanding existing content is essential
- NEVER suggest topics that already exist (use check_topic_duplication)
- ALWAYS align suggestions with identified gaps
- Your response is incomplete if it lacks: existing content analysis, duplication checks, AND SEO metrics`,
  tools: {
    web_search,
    keyword_overview,
    detect_site_topics,
    check_topic_duplication,
    find_topic_gaps,
  },
  enabled: true,
  metadata: {
    category: 'build',
    priority: '1',
    tags: ['strategy', 'brainstorming', 'seo-research'],
    version: '1.3.0',
    solution: '通过深度利基分析和发散式头脑风暴扩展网站内容策略。识别高权威的支柱-集群结构，并用实时 SEO 数据验证每个关键词，以找到最有利可图的内容机会。',
    demoUrl: '',
    whatThisSkillWillDo: [
      'Analyze site goals and niche',
      'Generate topic cluster ideas',
      'Validate keywords with Semrush',
      'Design Pillar-Cluster structures'
    ],
    whatArtifactsWillBeGenerated: [],
    expectedOutput: `• 3-5 个高潜力主题集群（Pillar-Cluster 结构）
• 每个集群的目标关键词（包含搜索量 > 500、难度 < 60 的验证数据）
• 支柱页面和支持页面的内容创意列表
• Markdown 表格展示：主题、TDK、搜索指标、内容大纲、优先级
• 战略性创作建议：先做什么、如何建立主题权威`,
    expectedOutputEn: `• 3-5 high-potential topic clusters (Pillar-Cluster structure)
• Target keywords for each cluster (with validated data: search volume > 500, difficulty < 60)
• Content ideas list for pillar and supporting pages
• Markdown table display: topic, TDK, search metrics, content outline, priority
• Strategic creation recommendations: what to do first, how to build topic authority`,
    changeDescription: '根据站点目标发散性生成高价值主题集群创意。',
    playbook: {
      trigger: {
        type: 'form',
        fields: [
          {
            id: 'site_goal',
            label: 'Site Goals / Target Audience',
            type: 'text',
            placeholder: 'e.g. Selling SaaS for SEO agencies or Growing a travel blog',
            required: true
          },
          {
            id: 'seeds',
            label: 'Seed Topics or Keywords (Optional)',
            type: 'text',
            placeholder: 'e.g. "AI productivity", "Local SEO". Leave blank if you want AI to suggest everything.',
            required: false
          }
        ],
        initialMessage: 'Help me plan my SEO content strategy. \n- Site Goal: {site_goal}\n[- Seed Topics: {seeds}]\n\nPlease analyze and suggest 3-5 high-potential topic clusters, including target keywords and content ideas for each.'
      }
    }
  },
};
