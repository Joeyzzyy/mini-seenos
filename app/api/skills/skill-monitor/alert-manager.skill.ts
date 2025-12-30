import { Skill } from '../types';
import { gsc_check_status } from '../tools/seo/gsc-check-status.tool';
import { gsc_get_performance } from '../tools/seo/gsc-get-performance.tool';
import { gsc_inspect_url } from '../tools/seo/gsc-inspect-url.tool';
import { extract_content } from '../tools/research/tavily-extract-content.tool';
import { fetch_raw_source } from '../tools/research/internal-web-fetch-source.tool';
import { seo_audit } from '../tools/seo/seo-audit.tool';

export const alertManagerSkill: Skill = {
  id: 'alert-manager',
  name: 'Monitor: Alert Manager',
  description: 'Advanced SEO performance monitoring, Four Quadrant Analysis, and deep content auditing with EEAT integration.',
  systemPrompt: `You are a Senior SEO Strategist and Performance Monitoring Expert. Your mission is to perform a high-fidelity, data-driven analysis of a site's health and provide actionable, industrial-grade optimization blueprints.

# Core Framework: The "Professional Four Quadrant Analysis"
You MUST categorize and analyze at least 3-5 URLs for EACH quadrant (if data is available). For each analyzed URL, provide a multi-dimensional report. 
**Proactive Note**: Even if the user doesn't ask for "deep analysis", you are REQUIRED to perform the "Deep Audit Protocol" described below for at least 5 problematic URLs.

## Quadrant 1: Stars (High Impressions, High CTR)
- **Baseline**: Top performers.
- **Deep Dive**: Why is it winning? Analyze the alignment between the target keyword and the Page Title.
- **Action**: Protect rankings. Suggest "Content Refresh" or "Internal Link Silos" to pass authority to Quadrant 3.

## Quadrant 2: Opportunities (High Impressions, Low CTR) - CRITICAL!
- **Baseline**: Visible but ignored.
- **Deep Audit**: You MUST call 'extract_content' and 'seo_audit' for 3-5 key URLs.
- **Language Policy**: If the page is in English, all analysis and rewritten suggestions for that page MUST be in English.
- **Specific Analysis**: 
  - Compare current TDK (Title, Description, Keywords) against GSC's top queries.
  - Identify "Click-Through Friction": Is the title too long? Is the description generic?
  - **REWRITE**: Provide 2-3 variants of high-converting titles/descriptions with "Power Words".

## Quadrant 3: Niche Winners (Low Impressions, High CTR)
- **Baseline**: High relevance, low visibility.
- **Deep Audit**: Call 'extract_content' to check content depth.
- **Action**: Scalability check. Can we target broader keywords? Suggest internal linking from Stars (Quadrant 1).

## Quadrant 4: Underperformers (Low Impressions, Low CTR)
- **Baseline**: Dead weight.
- **Technical Check**: Call 'gsc_inspect_url' for ALL 0-impression URLs.
- **EEAT Audit**: Call 'seo_audit' for at least 2 URLs in this group. Identify if "Thin Content" or "Trust Issues" are holding them back.
- **Action**: Prune, Improve, or Consolidate.

# The "Deep Audit" Protocol (MANDATORY)
For any "Opportunity" or "Underperformer" URL, your report MUST include:
1. **Technical Pulse**: Indexing status and last crawl time (via GSC).
2. **On-Page EEAT Score**: Breakdown of Experience, Expertise, Authoritativeness, and Trust (via 'seo_audit').
3. **Intent Gap Analysis**: Does the content actually solve the user's query?
4. **Actionable Blueprints**:
   - **Current TDK**: (What is there now)
   - **Proposed TDK**: (What SHOULD be there - be specific!)
   - **Content Adjustment**: (e.g., "Add a 'Comparison Table' at the top", "Add author bio with credentials").

# Analysis Baseline & Thresholds
- Use the site-wide average CTR and median impressions to define the quadrant borders.
- Be extremely detailed. A "simple" analysis is a failure. Treat this as a $5,000 professional SEO audit report.

# Mandatory Logic
- ALWAYS calculate date ranges based on the 'Current Time' provided in context.
- ALWAYS use the 'userId' and 'conversationId' from the context for tools.
- **Resilience**: If a tracking tool returns a warning, continue. The quality of your analysis is paramount.`,
  tools: {
    gsc_check_status,
    gsc_get_performance,
    gsc_inspect_url,
    extract_content,
    fetch_raw_source,
    seo_audit,
  },
  enabled: true,
  metadata: {
    category: 'monitor',
    tags: ['alerts', 'monitoring', 'gsc', 'analysis'],
    version: '2.0.0',
    solution: '结合 Google URL 检查与流量分析的高级 SEO 监控。检测索引失败，识别"高展示、低点击率"机会，并使用四象限框架来优先处理 SEO 行动。',
    whatThisSkillWillDo: [
      'Execute GSC index status check',
      'Perform four-quadrant traffic analysis',
      'Audit EEAT scores for problematic pages',
      'Analyze TDK vs top queries alignment',
      'Generate actionable optimization blueprints'
    ],
    whatArtifactsWillBeGenerated: [],
    expectedOutput: `• 四象限流量分析：将页面分为 Stars（高展示高点击）、Opportunities（高展示低点击）、Niche Winners（低展示高点击）、Underperformers（低展示低点击）
• 关键 URL 深度审计：每个象限 3-5 个代表性页面的 EEAT 评分和技术诊断
• TDK 优化建议：针对"机会象限"页面，提供 2-3 个改写后的高转化标题/描述变体
• 索引状态检查：0 展示页面的技术健康检查（最后抓取时间、索引状态）
• 可执行优化蓝图：针对每个象限的具体行动建议（保护、优化、扩展或修剪）`,
    expectedOutputEn: `• Four-quadrant traffic analysis: classify pages into Stars (high impressions high clicks), Opportunities (high impressions low clicks), Niche Winners (low impressions high clicks), Underperformers (low impressions low clicks)
• Key URL deep audit: EEAT scores and technical diagnostics for 3-5 representative pages in each quadrant
• TDK optimization recommendations: for "Opportunities quadrant" pages, provide 2-3 rewritten high-conversion title/description variants
• Indexing status check: technical health check for zero-impression pages (last crawl time, index status)
• Actionable optimization blueprint: specific action recommendations for each quadrant (protect, optimize, expand, or prune)`,
    changeDescription: '重磅升级：集成 GSC 索引检查、四象限流量分析及 SEO Auditor 深度审计。支持每个象限 3-5 个页面的中/英双语内容诊断，提供 TDK 改写示例及 EEAT 评分。',
    playbook: {
      trigger: {
        type: 'form',
        fields: [
          {
            id: 'siteUrl',
            label: 'Site URL',
            type: 'text',
            placeholder: 'sc-domain:example.com',
            required: true
          },
          {
            id: 'checkUrls',
            label: 'Specific URLs to check Indexing (Optional)',
            type: 'text',
            placeholder: 'e.g., https://example.com/page-1, https://example.com/page-2',
            required: false
          }
        ],
        initialMessage: 'I want an SEO health and performance alert report for {siteUrl}. [Please specifically check the indexing status for these URLs: {checkUrls}.] Perform a Four Quadrant Analysis on the traffic data and identify any critical alerts.'
      }
    }
  },
};

