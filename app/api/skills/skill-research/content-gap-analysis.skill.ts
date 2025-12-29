import { Skill } from '../types';
import { domain_gap_analysis } from '../tools/seo/semrush-domain-gap.tool';
import { web_search } from '../tools/research/tavily-web-search.tool';
import { extract_content } from '../tools/research/tavily-extract-content.tool';

export const contentGapAnalysisSkill: Skill = {
  id: 'content-gap-analysis',
  name: 'Content Gap Analysis',
  description: 'Identify high-value keywords your competitors rank for but you don\'t, using automated competitor discovery.',
  systemPrompt: `REMINDER: Before performing Content Gap Analysis, you MUST call 'create_plan' first!

You are an Elite SEO Growth Strategist. Your mission is to find the "blind spots" in a site's content strategy and deliver a $5,000-value Strategic Growth Blueprint.

# YOUR AUTONOMOUS WORKFLOW (NO PERMISSION NEEDED)

1. UNDERSTAND THE PRODUCT (extract_content): 
   - Visit the user's domain. Identify their core business, target audience, and primary service/product.
2. COMPETITOR DISCOVERY (web_search): 
   - If the user hasn't provided competitors, call 'web_search' to find the TOP 3 direct business rivals. Search for "[Business Category] alternatives" or "top [Product Type] software".
3. THE DEEP GAP AUDIT (domain_gap_analysis): 
   - Call 'domain_gap_analysis' comparing the user's site against the top competitors found.
   - PRO TIP: If the first call returns no gaps, TRY AGAIN with lower 'min_volume' (e.g., 50) and higher 'max_difficulty' (e.g., 85) to find niche opportunities.
   - Use 'nq_desc' (Volume) sorting to ensure we see the biggest opportunities first.
4. INTELLIGENCE SYNTHESIS: 
   - Analyze the returned keywords. Filter for "True Gaps" (Competitors in top 10, You not in top 100).
   - Evaluate "Search Intent": Are these keywords actually profitable?

# THE STRATEGIC GROWTH BLUEPRINT (FINAL REPORT)
Your final response must be a professional report structured as follows:

## 1. Competitive Landscape
- **Your Positioning**: Brief summary of what you found on the user's site.
- **Rivals Analyzed**: List the 2-3 competitors identified and why they are dangerous.

## 2. The Content Gap Matrix
- Present a detailed Markdown table: | Keyword | Comp A Pos | Comp B Pos | Your Status | Volume | Difficulty | Business Value |
- If no gaps are found, EXPLAIN WHY (e.g., "The site is very new" or "The niche is extremely competitive") and provide a "Lateral Growth Strategy" instead.
- Highlight the top 10-15 "Gold Mine" keywords.

## 3. The 90-Day Execution Plan
For the top 5 gap keywords (or lateral topics), provide:
- **Target Page Type**: (e.g., "Comparison Page", "Deep-dive Guide", "Feature Landing Page").
- **Winning Angle**: A specific content strategy to steal this traffic from the rivals (e.g., "Create a 'Top 10 Alternatives' list where you emphasize your [Unique Feature]").

# LANGUAGE & STYLE
- If the target site is in English, the analysis MUST be in English.
- Use a confident, expert, and data-driven tone.
- Do not say "I found these competitors, do you want to analyze them?" — JUST DO IT.`,
  tools: {
    domain_gap_analysis,
    web_search,
    extract_content,
  },
  enabled: true,
  metadata: {
    category: 'research',
    tags: ['gap-analysis', 'keywords', 'competitors', 'semrush'],
    version: '2.0.0',
    status: 'active',
    solution: '自主增长引擎。首先爬取你的网站以了解你的利基市场，通过实时网络搜索自动发现你的顶级搜索竞争对手，然后执行深度 Semrush 差距分析以揭示你遗漏的高流量关键词。最终提供具体的执行路线图来夺回失去的市场份额。',
    whatThisSkillWillDo: [
      'Crawl your site to understand niche',
      'Auto-discover top competitors via web search',
      'Execute Semrush gap analysis',
      'Identify missing high-volume keywords',
      'Generate execution roadmap'
    ],
    whatArtifactsWillBeGenerated: [
      'Word Document'
    ],
    expectedOutput: `• 你的网站利基市场分析（基于网站爬取）
• 自动发现的竞争对手列表（3-5 个直接竞品）
• 关键词差距表格：竞争对手排名但你缺失的关键词（按搜索量排序）
• 快速赢得机会：低难度、高流量的关键词列表
• 具体执行路线图：按优先级排序的内容创作建议`,
    playbook: {
      trigger: {
        type: 'form',
        fields: [
          {
            id: 'my_domain',
            label: 'Your Website URL',
            type: 'text',
            placeholder: 'example.com',
            required: true
          },
          {
            id: 'competitor_domains',
            label: 'Specific Competitors (Optional)',
            type: 'text',
            placeholder: 'Leave blank to let AI discover them automatically',
            required: false
          },
          {
            id: 'database',
            label: 'Target Market',
            type: 'select',
            options: [
              { label: 'United States (US)', value: 'us' },
              { label: 'United Kingdom (UK)', value: 'uk' },
              { label: 'Canada (CA)', value: 'ca' },
              { label: 'Australia (AU)', value: 'au' }
            ],
            defaultValue: 'us',
            required: true
          }
        ],
        initialMessage: 'I need an autonomous Content Gap Analysis for {my_domain} in the {database} market. \n\nPlease: \n1. Crawl my site to understand my business. \n2. Find my top 2-3 search competitors [including {competitor_domains}]. \n3. Run a deep gap audit and provide a 90-day growth blueprint.'
      }
    }
  },
};
