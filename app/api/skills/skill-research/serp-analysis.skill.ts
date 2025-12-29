import { Skill } from '../types';
import { search_serp } from '../tools/seo/serper-search-serp.tool';
import { analyze_serp_structure } from '../tools/seo/serper-analyze-serp-structure.tool';
import { extract_content } from '../tools/research/tavily-extract-content.tool';
import { keyword_overview } from '../tools/seo/semrush-keyword-overview.tool';

export const serpAnalysisSkill: Skill = {
  id: 'serp-analysis',
  name: 'SERP Analysis',
  description: 'Analyze search results and AI answer patterns',
  systemPrompt: `REMINDER: Before performing SERP analysis, you MUST call 'create_plan' first!

You are a Senior SERP Content Strategist. Your goal is to provide a comprehensive analysis of the top-ranking pages and search intent for a given keyword.

WORKFLOW:
1. KEYWORD VALIDATION (OPTIONAL but RECOMMENDED): If you need to confirm the keyword's potential, call 'keyword_overview' to get Volume and Difficulty.
2. SERP DISCOVERY: Call 'search_serp' to identify the top 10 organic results, and check for SERP features like 'People Also Ask' and 'Answer Box'. Present this landscape to the user.
3. SELECT REPRESENTATIVES: Choose the top 3-5 most relevant results for deep analysis.
4. CONTENT EXTRACTION: For each selected result, call 'extract_content' to get the full body text and main message.
5. STRUCTURE ANALYSIS: Call 'analyze_serp_structure' to map out the heading hierarchy (H1-H3) and logical flow.
6. EVALUATION & SCORING: For each page, evaluate and provide:
   - Content Quality Score (1-10)
   - Search Intent Alignment (Informational, Commercial, etc.)
   - Key Topics covered vs. missing (Reference 'People Also Ask' for missing intent)
   - Differentiators (What makes this page unique?)
7. STRATEGIC RECOMMENDATION: Synthesize all findings into a "Content Gap Report" and suggest a specific strategy to outrank these competitors.

NOTE: Be objective and data-driven. Use the exact headers and content found by the tools. Leverage 'People Also Ask' questions to suggest new sections.`,
  tools: {
    search_serp,
    analyze_serp_structure,
    extract_content,
    keyword_overview,
  },
  enabled: true,
  metadata: {
    category: 'research',
    priority: '2',
    tags: ['serp', 'google', 'seo'],
    version: '1.0.0',
    solution: '通过实时 SERP 分析了解你的竞争对手。爬取 Google 前 10 名结果以分析标题结构、核心主题和内容密度，为内容创作提供高价值的差异化参考。',
    demoUrl: '',
    whatThisSkillWillDo: [
      'Crawl Google top 10 results',
      'Extract H1-H6 heading structures',
      'Analyze core topics and themes',
      'Calculate content density metrics'
    ],
    whatArtifactsWillBeGenerated: [
      'Word Document'
    ],
    expectedOutput: `• Google Top 10 页面列表（标题、URL、域名权威）
• H1-H3 标题结构对比表格（所有页面的标题层次）
• 核心主题提取：前 10 名页面共同覆盖的主题
• 内容密度分析：平均字数、段落数、图片数
• 差异化建议：你的内容如何脱颖而出的具体角度`,
    renamingInfo: 'SERP Analyst → SERP Analysis',
    changeDescription: '深度分析搜索结果大纲结构与内容密度。',
    playbook: {
      trigger: {
        type: 'form',
        fields: [
          {
            id: 'keyword',
            label: 'Target Keyword',
            type: 'text',
            placeholder: 'e.g. best running shoes',
            required: true
          },
          {
            id: 'results_count',
            label: 'Results to Analyze',
            type: 'select',
            options: [
              { label: 'Top 3 (Fast)', value: '3' },
              { label: 'Top 5 (Detailed)', value: '5' },
              { label: 'Top 10 (Deep)', value: '10' }
            ],
            defaultValue: '3',
            required: true
          }
        ],
        initialMessage: '1. Call "search_serp" to show me the organic search results for "{keyword}".\n2. Call "analyze_serp_structure" for the top {results_count} results.\n3. Provide a thorough analysis identifying content patterns, heading structures, and gaps I can exploit.'
      }
    }
  },
};
