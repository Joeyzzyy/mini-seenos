import { Skill } from '../types';
import { gsc_check_status } from '../tools/seo/gsc-check-status.tool';
import { gsc_get_performance } from '../tools/seo/gsc-get-performance.tool';

export const rankTrackerSkill: Skill = {
  id: 'rank-tracker',
  name: 'Monitor: Rank Tracker',
  description: 'Track keyword rankings and search performance over time using Google Search Console.',
  systemPrompt: `You are an expert Rank Tracking specialist. Your goal is to provide precise ranking data for keywords and track their movement over time using Google Search Console (GSC) data.

# Time-Aware Analysis
- ALWAYS use the 'Current Time' provided in the system context to calculate date ranges.
- Default to "Last 28 Days" if the user asks for "recent" or "latest" data.
- Ensure the 'endDate' is the most recent available date (usually yesterday or today) and 'startDate' is calculated accordingly.

# Rank Tracking Workflow
1. **Check Authorization**: ALWAYS start by calling 'gsc_check_status' to see if GSC is connected for the current user.
2. **Handle Unauthorized**: 
   - If not authorized, display the provided 'authUrl' clearly to the user and explain that they need to click it to connect their Google account.
   - Stop and wait for the user to complete the authorization.
3. **Fetch Data**: 
   - Once authorized, identify the correct site URL from the list of 'authorized_sites'.
   - Use 'gsc_get_performance' to fetch data for the requested keywords, pages, or general performance.
   - Suggest a default date range (e.g., last 28 days) if the user doesn't specify one.
4. **Analyze & Report**:
   - Present the data in a clear, professional table.
   - Highlight significant ranking changes, high-impression/low-click opportunities, and average position trends.

# Mandatory Logic
- If no sites are authorized, you cannot track rankings.
- Always use the 'userId' and 'conversationId' from the context for GSC tools.`,
  tools: {
    gsc_check_status,
    gsc_get_performance,
  },
  enabled: true,
  metadata: {
    category: 'monitor',
    tags: ['ranking', 'seo', 'tracking', 'gsc'],
    version: '1.0.0',
    solution: '与 Google Search Console 集成的专业排名跟踪。验证 GSC 授权，发现授权站点，并获取实时搜索性能数据（点击、展示、位置）以提供可操作的排名洞察。',
    whatThisSkillWillDo: [
      'Verify GSC authorization',
      'Discover authorized sites',
      'Fetch search performance data',
      'Analyze clicks and impressions',
      'Track keyword positions'
    ],
    whatArtifactsWillBeGenerated: [],
    expectedOutput: `• GSC 授权状态：确认 Google Search Console 连接状态
• 授权站点列表：当前用户已授权的所有站点
• 关键词排名数据：目标关键词的搜索表现（点击、展示、平均排名）
• 排名变动趋势：突出显示重要的排名变化和位置趋势
• 高展示低点击机会：识别有可见性但点击率低的关键词
• 专业数据表格：清晰展示所有性能指标的表格化呈现`,
    changeDescription: '集成 Google Search Console，支持自动授权、多站点管理及实时关键词排名与流量获取。',
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
            id: 'keywords',
            label: 'Target Keywords (Optional)',
            type: 'text',
            placeholder: 'e.g., your product, your service',
            required: false
          }
        ],
        initialMessage: 'I want to check the search performance for {siteUrl}. [Focus on these keywords: {keywords}.]'
      }
    }
  },
};

