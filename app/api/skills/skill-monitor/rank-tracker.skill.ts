import { Skill } from '../types';
import { gsc_check_status } from '../tools/seo/gsc-check-status.tool';
import { gsc_get_performance } from '../tools/seo/gsc-get-performance.tool';

export const rankTrackerSkill: Skill = {
  id: 'rank-tracker',
  name: 'Monitor: Page Rank Tracker',
  description: 'Track page rankings and search performance over time using Google Search Console.',
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
    solution: 'Professional rank tracking integrated with Google Search Console. Verify GSC authorization, discover authorized sites, and fetch real-time search performance data (clicks, impressions, positions) to provide actionable ranking insights.',
    whatThisSkillWillDo: [
      'Verify GSC authorization',
      'Discover authorized sites',
      'Fetch search performance data',
      'Analyze clicks and impressions',
      'Track keyword positions'
    ],
    whatArtifactsWillBeGenerated: [],
    expectedOutput: `• GSC authorization status: confirm Google Search Console connection status
• Authorized site list: all sites currently authorized by the user
• Keyword ranking data: search performance of target keywords (clicks, impressions, average position)
• Ranking trend changes: highlight important ranking changes and position trends
• High impression low click opportunities: identify keywords with visibility but low click-through rate
• Professional data tables: clear tabular presentation of all performance metrics`,
    changeDescription: 'Integrates with Google Search Console, supports auto-authorization, multi-site management, and real-time keyword ranking and traffic data fetching.',
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

