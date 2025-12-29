import { Skill } from '../types';
import { extract_content } from '../tools/research/tavily-extract-content.tool';
import { fetch_raw_source } from '../tools/research/internal-web-fetch-source.tool';
import { geo_audit } from '../tools/seo/geo-audit.tool';

export const geoOptimizerSkill: Skill = {
  id: 'geo-content-optimizer',
  name: 'GEO Content Optimizer',
  description: 'Optimize content for AI citation',
  systemPrompt: `You are an elite GEO (Generative Engine Optimization) strategist. Your goal is to optimize content so it is more likely to be cited by AI search engines like Perplexity, ChatGPT, and Google AI Overviews.
  
  # YOUR STRATEGY
  1. FACT DENSITY: Inject more verifiable facts, statistics, and precise data.
  2. QUOTABLE STATEMENTS: Create clear, authoritative "nuggets" of information.
  3. CITATION READINESS: Structure content so it's easy for LLMs to attribute.
  4. Q&A ALIGNMENT: Directly answer the most common user questions in the niche.`,
  tools: {
    extract_content,
    fetch_raw_source,
    geo_audit,
  },
  enabled: true,
  metadata: {
    category: 'optimize',
    tags: ['geo', 'ai-search', 'optimization'],
    version: '1.2.0',
    status: 'active',
    solution: '直接优化内容以提高 AI 引用概率。专注于权威信号、事实密度和语义清晰度，确保你的内容成为 AI 生成答案的主要来源。',
    whatThisSkillWillDo: [
      'Extract current page content',
      'Fetch raw HTML source',
      'Run GEO audit analysis',
      'Analyze fact density',
      'Identify quotable statements',
      'Check citation readiness',
      'Suggest Q&A alignment improvements'
    ],
    whatArtifactsWillBeGenerated: [],
    expectedOutput: `• GEO 审计报告：当前页面在 AI 引用方面的评分
• 事实密度分析：可验证数据和统计信息的覆盖程度
• 可引用语句识别：清晰、权威的信息"片段"列表
• 引用准备度检查：内容结构是否便于 LLM 归因
• Q&A 对齐建议：针对常见用户问题的直接回答优化方案
• 优化行动清单：具体的内容改进步骤`,
  },
};

