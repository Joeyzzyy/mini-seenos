import { Skill } from '../types';
import { gsc_check_status } from '../tools/seo/gsc-check-status.tool';
import { gsc_get_performance } from '../tools/seo/gsc-get-performance.tool';
import { markdown_to_docx } from '../tools/file/markdown-to-docx.tool';

export const performanceSkill: Skill = {
  id: 'performance',
  name: 'Monitor: Performance Reporter',
  description: 'Generate comprehensive SEO/GEO performance reports in Word format.',
  systemPrompt: `You are an elite SEO Performance Analyst. Your primary mission is to transform raw Google Search Console data into executive-level SEO performance reports (.docx).

# Reporting Framework
1. **Executive Summary**: High-level overview of total clicks, impressions, CTR, and average position.
2. **Top Performing Content**: Detailed analysis of pages driving the most traffic.
3. **Keyword Ranking Deep Dive**: Identification of top-ranking keywords and movement trends.
4. **Growth Opportunities**: Focus on "striking distance" keywords (ranking pos 11-20) with high impressions.
5. **Technical/SEO Issues**: Patterns in CTR or ranking drops that suggest optimizations are needed.

# Detailed Workflow
1. **Data Collection**: 
   - Check GSC status via 'gsc_check_status'.
   - Fetch last 28 days of data via 'gsc_get_performance' (get both 'page' and 'query' dimensions).
2. **Intelligence Analysis**: 
   - Compare data to identify high-value pages and keywords.
   - Calculate CTR benchmarks for the site.
3. **Report Generation & Conversion (MANDATORY)**:
   - Construct a professional Markdown report based on the Reporting Framework.
   - **CRITICAL**: You MUST ALWAYS call 'markdown_to_docx' immediately after your analysis to provide a downloadable file. A text-only response is considered a failure.
   - Set an appropriate title (e.g., "SEO Performance Report - [Site Domain] - [Date Range]").

# Time & Context Rules
- ALWAYS use the 'Current Time' from the system context to calculate report periods.
- Default to comparing the most recent 28 days.
- Ensure the user's ID is used for all tool calls.`,
  tools: {
    gsc_check_status,
    gsc_get_performance,
    markdown_to_docx,
  },
  enabled: true,
  metadata: {
    category: 'monitor',
    tags: ['monitoring', 'ranking', 'traffic', 'report', 'docx', 'gsc'],
    version: '1.1.0',
    solution: '自动创建专业的 SEO 性能报告。直接连接到 Google Search Console，分析流量和排名趋势，并生成准备提交给利益相关者的格式化 .docx 报告。',
    whatThisSkillWillDo: [
      'Connect to Google Search Console',
      'Analyze traffic and ranking trends',
      'Calculate period-over-period changes',
      'Generate formatted Word document',
      'Export professional report'
    ],
    whatArtifactsWillBeGenerated: [],
    expectedOutput: `• 执行摘要：总点击、展示、CTR 和平均排名的高层概览
• 顶级内容分析：驱动最多流量的页面详细分析
• 关键词排名深度挖掘：排名靠前的关键词及其变动趋势识别
• 增长机会：聚焦"临门一脚"关键词（排名 11-20 且高展示）
• 技术/SEO 问题：CTR 或排名下降的模式分析，建议优化方向
• 对比分析：最近 28 天与之前周期的数据对比`,
    changeDescription: '自动抓取 GSC 数据进行多维度分析，并全自动生成专业排版的 Word 版 SEO 绩效报告。',
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
            id: 'period',
            label: 'Report Period',
            type: 'select',
            options: [
              { label: 'Last 7 Days', value: 'last 7 days' },
              { label: 'Last 28 Days', value: 'last 28 days' },
              { label: 'Last 3 Months', value: 'last 3 months' }
            ],
            defaultValue: 'last 28 days',
            required: true
          }
        ],
        initialMessage: 'Please generate a comprehensive SEO performance report for {siteUrl} [covering the {period}]. Analyze clicks, impressions, and top rankings, and provide the final report as a Word document.'
      }
    }
  },
};

