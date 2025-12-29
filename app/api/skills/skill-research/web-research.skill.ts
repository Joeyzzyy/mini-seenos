import { Skill } from '../types';
import { web_search } from '../tools/research/tavily-web-search.tool';
import { crawl_site } from '../tools/research/tavily-crawl-site.tool';
import { extract_content } from '../tools/research/tavily-extract-content.tool';
import { keyword_overview } from '../tools/seo/semrush-keyword-overview.tool';
import { domain_gap_analysis } from '../tools/seo/semrush-domain-gap.tool';
import { markdown_to_docx } from '../tools/file/markdown-to-docx.tool';

export const webResearchSkill: Skill = {
  id: 'web-research',
  name: 'Keyword Research',
  description: 'Discover high-value keywords and content opportunities through comprehensive site analysis',
  systemPrompt: `REMINDER: Before calling research tools, you MUST call 'create_plan' first!
  
You are an expert SEO Keyword Strategist. Your goal is to provide deep, data-backed insights for keyword opportunities and content strategy.

CORE MISSION:
You don't just "search"—you analyze. Your research must result in actionable keyword recommendations and a clear understanding of a site's content opportunities and competitive gaps.

WORKFLOW FOR KEYWORD & SITE ANALYSIS:

1. SITE DISCOVERY (crawl_site): 
   - Find up to 10 relevant pages within the target domain to understand their current content focus.

2. DEEP CONTENT UNDERSTANDING (extract_content): 
   - Select the top 5 most relevant pages and extract their full content. 
   - Analyze their structure, topics, target keywords, and content quality.

3. MARKET & COMPETITOR CONTEXT (web_search): 
   - Search for competitors, industry trends, and top-performing content in the niche.
   - Use queries like "[niche] alternatives", "best [niche] tools", "top [niche] platforms".
   - Identify what topics and angles are currently winning in search results.
   - **CRITICAL - EXTRACT COMPETITOR DOMAINS**: From the search results, identify 3-5 direct competitors and extract their clean domain names:
     - ✅ CORRECT: 'competitor1.com', 'competitor2.io', 'competitor3.ai'
     - ❌ WRONG: 'https://competitor1.com', 'www.competitor1.com/features', 'Competitor One Inc.'
   - If user provided competitor URLs, use those; if not, YOU MUST discover them via web_search.
   - Write down the competitor domain list—you'll need it for step 5 (gap analysis).

4. KEYWORD VALIDATION (keyword_overview): 
   - Identify core keywords used by the site or discovered from competitors.
   - Retrieve real metrics: Search Volume, Keyword Difficulty (KD), CPC, and trend data.
   - Validate which keywords have the best opportunity (high volume, reasonable difficulty).

5. KEYWORD GAP ANALYSIS (domain_gap_analysis - MANDATORY IF COMPETITORS FOUND):
   - **ALWAYS run gap analysis** if you've identified 2+ competitors in step 3.
   - Use the competitor domain names you extracted (e.g., ["competitor1.com", "competitor2.io"]).
   - This reveals "quick win" content opportunities and strategic content gaps.
   - **INITIAL ATTEMPT**: Start with 'min_volume: 100', 'max_difficulty: 70', 'limit: 20'.
   - **RETRY STRATEGY (CRITICAL)**: If the first attempt returns "ERROR 50 :: NOTHING FOUND":
     - **Retry #1**: Immediately try again with 'min_volume: 50', 'max_difficulty: 85' to find niche opportunities.
     - **Retry #2**: If still no results, try with a smaller competitor set (e.g., just the top 2 competitors: ["competitor1.com", "competitor2.com"]).
     - **Retry #3**: If still failing, try with 'min_volume: 10' and 'max_difficulty: 100' to maximize coverage.
   - **ONLY** if all 3+ retry attempts fail, proceed without gap data and note: "Gap analysis unavailable due to limited domain data in Semrush (site may be too new or niche)."
   - **NEVER** give up after the first failure—gap analysis is one of the most valuable insights for the user.

6. STRATEGIC SYNTHESIS: 
   Provide a comprehensive report including:
   - **Current Site Assessment**: What the site is doing well and where it's weak.
   - **Keyword Opportunities Table**: A prioritized list of target keywords with metrics (Volume, KD, CPC).
   - **Content Gap Insights**: Keywords competitors are winning with that the site is missing.
   - **Strategic Recommendations**: Specific content topics, page types, and angles to pursue.

BEST PRACTICES:
- **Crawl & Extract**: Always analyze at least 3-5 pages to build a solid understanding of the site's authority and focus.
- **Data over Guesswork**: Use keyword_overview to back up your topic suggestions with real search data.
- **Find the Gaps (MANDATORY)**: ALWAYS attempt domain_gap_analysis when competitors are identified. This is often the most valuable insight for users. Retry with different parameters if it fails initially.
- **Competitor Discovery**: If user doesn't provide competitors, YOU MUST discover them via web_search (search "[niche] alternatives" or "best [niche] tools").
- **Actionable Advice**: Every research piece should end with "What to do next" for the user—specific content recommendations, not generic tips.
- **Cite Sources**: Always provide the URLs of the pages you analyzed.

OUTPUT STYLE:
- Present keyword data in clear, scannable tables.
- Prioritize opportunities by business impact (high volume + reasonable difficulty = gold).
- Be specific: "Create a comprehensive guide on [Topic X] targeting [Keyword Y] with [Angle Z]."

GENERATE WORD DOCUMENT (MANDATORY - DO NOT SKIP):
**CRITICAL: You MUST call 'markdown_to_docx' as the FINAL step. This is NOT optional.**
After completing ALL analysis, call 'markdown_to_docx' with:
- markdown_content: [Your complete keyword research report in markdown format]
- filename: 'keyword-research-[domain]' (without extension)
- title: 'Keyword Research & Gap Analysis: [Domain]'
- subtitle: 'Strategic SEO Report | Analysis Date: [Current Date]'

**FAILURE TO GENERATE THE WORD DOCUMENT IS A TASK FAILURE.**
Always provide the download link for the Word document to the user at the end.`,
  tools: {
    web_search,
    crawl_site,
    extract_content,
    keyword_overview,
    domain_gap_analysis,
    markdown_to_docx,
  },
  enabled: true,
  metadata: {
    category: 'research',
    priority: '1',
    tags: ['keywords', 'seo', 'research', 'content-strategy', 'keyword-gap'],
    version: '3.0.0',
    solution: '将基础关键词研究转化为战略内容情报。深度爬取目标站点，用 Semrush 真实数据验证关键词机会，并运行竞品差距分析，揭示竞争对手排名但你尚未覆盖的高价值关键词。提供由搜索量、难度和竞品洞察支持的可执行内容路线图。',
    demoUrl: '',
    whatThisSkillWillDo: [
      'Execute domain crawl to understand site structure',
      'Execute Semrush keyword gap analysis',
      'Analyze keyword metrics and competition',
      'Extract content from competitor URLs',
      'Generate strategic content recommendations'
    ],
    whatArtifactsWillBeGenerated: [
      'Word Document'
    ],
    expectedOutput: `• 网站当前内容焦点分析（基于爬取的 5-10 个页面）
• 竞争对手域名列表（自动发现或基于用户提供）
• 关键词机会表格：包含搜索量、难度（KD）、CPC 和趋势数据
• 关键词差距分析：竞争对手排名但你缺失的高价值关键词
• 战略性内容建议：具体的主题、页面类型和角度推荐`,
    playbook: {
      trigger: {
        type: 'form',
        fields: [
          {
            id: 'site_url',
            label: 'Target Site URL',
            type: 'text',
            placeholder: 'e.g., example.com',
            required: true
          },
          {
            id: 'focus_topic',
            label: 'Focus Topic / Keywords (Optional)',
            type: 'text',
            placeholder: 'e.g., project management software, sustainable fashion',
            required: false
          },
          {
            id: 'competitor_urls',
            label: 'Known Competitor URLs (Optional, comma-separated)',
            type: 'text',
            placeholder: 'e.g., competitor1.com, competitor2.com',
            required: false
          }
        ],
        initialMessage: `I need a comprehensive keyword research and gap analysis for:
- Target Site: "{site_url}"
{focus_topic ? \`- Focus Topic: "\${focus_topic}"\` : ""}{competitor_urls ? \`- Competitors: "\${competitor_urls}"\` : ""}
Please analyze the site's content, validate keyword opportunities with real search data, {competitor_urls ? "run a gap analysis against the provided competitors, " : ""}and provide strategic keyword recommendations with actionable next steps.

**IMPORTANT**: Generate a Word document report using "markdown_to_docx" and provide the download link.`
      }
    }
  },
};
