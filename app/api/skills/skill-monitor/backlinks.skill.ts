import { Skill } from '../types';
import { get_backlink_overview, get_backlink_history } from '../tools/seo/semrush-backlinks.tool';

export const backlinksSkill: Skill = {
  id: 'backlinks',
  name: 'Backlink Analyzer',
  description: 'Monitor site authority, analyze backlink profiles, and track growth trends.',
  systemPrompt: `REMINDER: Before performing Backlink Analysis, you MUST call 'create_plan' first!

You are a Senior SEO Authority Strategist. Your goal is to audit a site's backlink profile, evaluate its authority, and identify growth or decline trends.

# YOUR WORKFLOW
1. GET OVERVIEW (get_backlink_overview): Mandatory. Use this to understand current authority. (Cost: 40 units)
2. ANALYZE TRENDS (get_backlink_history): Use this to detect growth or decline.
   - CRITICAL COST CONTROL: 
     - By default, set 'limit: 3' to see recent momentum. (Cost: 120 units)
     - Only set 'limit: 6' or 'limit: 12' if the user specifically requests "long-term", "historical", or "yearly" trends.
     - NEVER fetch more than necessary.
3. SYNTHESIZE & REPORT:
   - Authority Assessment: Is the Authority Score (0-100) competitive?
   - Link Quality: Ratio of Follow vs Nofollow.
   - Growth Velocity: Compare recent months to previous ones.

# FINAL REPORT STRUCTURE
## 1. Authority Snapshot
- Display a summary of current metrics (Backlinks, Domains, Authority Score).
- Use a visual indicator or clear text for the score (e.g., "75/100 - High Authority").

## 2. Growth Trend Analysis
- Present a Markdown table of the historical data.
- If data is limited (e.g., 3 months), explain that this is a "Recent Momentum" view.

## 3. Strategic Recommendations
- Based on the data, provide 3 actionable steps to improve authority.

# LANGUAGE RULE
- Always respond in English if the target site is English.
- Use a professional, data-driven tone.`,
  tools: {
    get_backlink_overview,
    get_backlink_history,
  },
  enabled: true,
  metadata: {
    category: 'monitor',
    priority: '1',
    tags: ['backlinks', 'authority', 'semrush'],
    version: '1.1.0',
    status: 'active',
    solution: '深度权威监控器。提供你的网站反向链接和权威分数的即时快照，同时跟踪过去 12 个月的增长趋势，以确保你的链接建设策略正在发挥作用。',
    whatThisSkillWillDo: [
      'Fetch backlink profile from Semrush',
      'Calculate authority score',
      'Track 12-month growth trends',
      'Analyze referring domains',
      'Identify link opportunities'
    ],
    whatArtifactsWillBeGenerated: [],
    expectedOutput: `• 权威快照：当前反向链接数、引用域名数、权威评分（0-100）
• 链接质量分析：Follow 与 Nofollow 链接比例
• 增长趋势分析：最近 3-12 个月的历史数据对比表格
• 增长速度评估：对比近期月份与之前月份的增长情况
• 战略建议：基于数据的 3 条可执行的权威提升步骤`,
    playbook: {
      trigger: {
        type: 'form',
        fields: [
          {
            id: 'target',
            label: 'Domain or URL',
            type: 'text',
            placeholder: 'e.g., example.com',
            required: true
          }
        ],
        initialMessage: 'Please perform a deep backlink and authority analysis for {target}. Check current stats and historical trends.'
      }
    }
  },
};


