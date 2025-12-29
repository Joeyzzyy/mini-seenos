import { Skill } from '../types';
import { web_search } from '../tools/research/tavily-web-search.tool';
import { keyword_overview } from '../tools/seo/semrush-keyword-overview.tool';

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
1. NICHE RESEARCH: Use 'web_search' to understand the competitive landscape and intents.
2. EXPANSIVE BRAINSTORMING: Suggest 3-5 high-potential Topic Clusters (Pillar + 5-8 Cluster Pages).
3. SEO DATA MINING (MANDATORY): For the primary keyword of EACH Pillar theme, you MUST call 'keyword_overview' immediately.
4. FINAL STRATEGIC ROADMAP: Present your suggested clusters WITH the retrieved SEO metrics (Volume, KD, CPC) for each pillar keyword.

NOTE: Your response is incomplete and a failure of this skill if it does not contain real SEO metrics from 'keyword_overview'.`,
  tools: {
    web_search,
    keyword_overview,
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
