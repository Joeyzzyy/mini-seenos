/**
 * 浏览器控制台脚本：为 SEOPages.pro 创建竞品对比页面
 * 
 * 使用方法：
 * 1. 登录你的 seopages.pro 项目页面
 * 2. 打开浏览器开发者工具 (F12 或 Cmd+Option+I)
 * 3. 切换到 Console 标签
 * 4. 复制粘贴整个脚本并回车执行
 */

(async function seedSEOPagesAltPages() {
  // 竞品列表 - 38个主流 SEO/AI 内容工具
  const COMPETITORS = [
    // AI 内容 & SEO 写作工具
    { name: 'Jasper AI', slug: 'jasper-ai', category: 'AI Writing' },
    { name: 'Copy.ai', slug: 'copy-ai', category: 'AI Writing' },
    { name: 'Writesonic', slug: 'writesonic', category: 'AI Writing' },
    { name: 'Surfer SEO', slug: 'surfer-seo', category: 'SEO Content' },
    { name: 'Frase', slug: 'frase', category: 'SEO Content' },
    { name: 'MarketMuse', slug: 'marketmuse', category: 'Content Strategy' },
    { name: 'Clearscope', slug: 'clearscope', category: 'Content Optimization' },
    { name: 'NeuronWriter', slug: 'neuronwriter', category: 'SEO Writing' },
    { name: 'GrowthBar', slug: 'growthbar', category: 'SEO Tools' },
    { name: 'Scalenut', slug: 'scalenut', category: 'AI Content' },
    { name: 'ContentShake AI', slug: 'contentshake-ai', category: 'AI Content' },
    { name: 'Koala AI', slug: 'koala-ai', category: 'AI Writing' },
    { name: 'Article Forge', slug: 'article-forge', category: 'AI Writing' },
    { name: 'Rytr', slug: 'rytr', category: 'AI Writing' },
    { name: 'Anyword', slug: 'anyword', category: 'AI Copywriting' },
    
    // 综合 SEO 平台
    { name: 'Ahrefs', slug: 'ahrefs', category: 'SEO Suite' },
    { name: 'SEMrush', slug: 'semrush', category: 'SEO Suite' },
    { name: 'Moz Pro', slug: 'moz-pro', category: 'SEO Suite' },
    { name: 'Ubersuggest', slug: 'ubersuggest', category: 'SEO Tools' },
    { name: 'Serpstat', slug: 'serpstat', category: 'SEO Platform' },
    { name: 'SE Ranking', slug: 'se-ranking', category: 'SEO Platform' },
    { name: 'SpyFu', slug: 'spyfu', category: 'Competitor Analysis' },
    { name: 'Mangools', slug: 'mangools', category: 'SEO Tools' },
    { name: 'Raven Tools', slug: 'raven-tools', category: 'SEO Reporting' },
    
    // Landing Page 构建器
    { name: 'Unbounce', slug: 'unbounce', category: 'Landing Pages' },
    { name: 'Instapage', slug: 'instapage', category: 'Landing Pages' },
    { name: 'Leadpages', slug: 'leadpages', category: 'Landing Pages' },
    { name: 'ClickFunnels', slug: 'clickfunnels', category: 'Sales Funnels' },
    { name: 'Carrd', slug: 'carrd', category: 'Simple Pages' },
    
    // WordPress SEO & 其他工具
    { name: 'Rank Math', slug: 'rank-math', category: 'WordPress SEO' },
    { name: 'Yoast SEO', slug: 'yoast-seo', category: 'WordPress SEO' },
    { name: 'All in One SEO', slug: 'all-in-one-seo', category: 'WordPress SEO' },
    { name: 'Screaming Frog', slug: 'screaming-frog', category: 'Technical SEO' },
    { name: 'Sitebulb', slug: 'sitebulb', category: 'Technical SEO' },
    { name: 'Page Optimizer Pro', slug: 'page-optimizer-pro', category: 'On-Page SEO' },
    { name: 'SurgeGraph', slug: 'surgegraph', category: 'AI Content' },
    { name: 'WordLift', slug: 'wordlift', category: 'AI SEO' },
    { name: 'Outranking', slug: 'outranking', category: 'AI SEO' },
  ];

  // 生成页面大纲
  function generateOutline(competitor) {
    return {
      h1: `SEOPages.pro vs ${competitor.name}: Best Alternative Page Generator in 2026`,
      sections: [
        {
          h2: `Why Choose SEOPages.pro Over ${competitor.name}?`,
          key_points: [
            'Specialized in alternative page generation - we do one thing and do it best',
            'AI-powered competitive analysis built-in',
            'More affordable pricing with transparent plans',
            'Better conversion-focused templates designed for comparison pages'
          ],
          word_count: 300
        },
        {
          h2: `${competitor.name} Overview`,
          h3s: [`What is ${competitor.name}?`, `${competitor.name} Key Features`, `${competitor.name} Pricing`],
          key_points: [
            `${competitor.category} tool overview`,
            'Their main features and capabilities',
            'Pricing structure comparison'
          ],
          word_count: 400
        },
        {
          h2: 'SEOPages.pro Overview',
          h3s: ['What is SEOPages.pro?', 'Our Key Features', 'Pricing Plans'],
          key_points: [
            'AI-powered alternative page generator',
            'Specialized for competitor comparison pages',
            'Affordable, transparent pricing',
            'High-converting templates'
          ],
          word_count: 400
        },
        {
          h2: `Feature Comparison: SEOPages.pro vs ${competitor.name}`,
          h3s: ['Alternative Page Generation', 'AI Content Quality', 'Ease of Use', 'Value for Money'],
          key_points: [
            'Direct feature-by-feature comparison',
            'Our strengths in altpage generation',
            'Specialized vs generalist approach'
          ],
          word_count: 500
        },
        {
          h2: `When to Choose SEOPages.pro Over ${competitor.name}`,
          key_points: [
            'You need high-quality alternative/comparison pages',
            'You want a specialized tool over a generalist platform',
            'Budget-conscious but quality-focused',
            'Fast turnaround needed'
          ],
          word_count: 300
        },
        {
          h2: `When ${competitor.name} Might Be Better`,
          key_points: [
            'Honest assessment of their strengths',
            'Use cases where they excel',
            'Building trust through transparency'
          ],
          word_count: 200
        },
        {
          h2: 'Verdict: SEOPages.pro is the Best Choice for Alternative Pages',
          key_points: [
            'Summary of key advantages',
            'Clear recommendation',
            'Call to action'
          ],
          word_count: 200
        },
        {
          h2: 'FAQ',
          h3s: [
            `Is SEOPages.pro really better than ${competitor.name}?`,
            'How much does SEOPages.pro cost?',
            `Can I migrate from ${competitor.name}?`,
            'Do you offer a free trial?'
          ],
          word_count: 300
        }
      ]
    };
  }

  console.log('🚀 SEOPages.pro 竞品对比页面生成器');
  console.log('================================\n');

  // 从 URL 获取 project ID
  const pathMatch = window.location.pathname.match(/\/project\/([^\/]+)/);
  if (!pathMatch) {
    console.error('❌ 请在 /project/[projectId] 页面运行此脚本');
    return;
  }
  const seoProjectId = pathMatch[1];
  console.log(`📌 SEO Project ID: ${seoProjectId}`);

  // 获取当前用户（从 Supabase session）
  const { data: { session } } = await window.supabase?.auth?.getSession?.() || { data: { session: null } };
  
  if (!session?.user?.id) {
    console.error('❌ 未登录或无法获取用户信息');
    return;
  }
  const userId = session.user.id;
  console.log(`👤 User ID: ${userId}`);

  // 构建请求数据
  const items = COMPETITORS.map(competitor => ({
    title: `SEOPages.pro vs ${competitor.name}: Best Alternative Page Generator in 2026`,
    target_keyword: `seopages.pro vs ${competitor.name}`.toLowerCase(),
    page_type: 'alternative',
    outline: generateOutline(competitor),
    seo_title: `SEOPages.pro vs ${competitor.name} (2026) - Best Alternative Page Generator`,
    seo_description: `Compare SEOPages.pro vs ${competitor.name}. See why SEOPages.pro is the best choice for generating high-converting alternative pages. Better AI, lower prices, specialized focus.`,
    keyword_data: { volume: null, kd: null, cpc: null, competition: null, category: competitor.category },
    priority: (competitor.category === 'AI Writing' || competitor.category === 'SEO Content') ? 1 : 2,
    estimated_word_count: 2600,
    notes: `Competitor: ${competitor.name} (${competitor.category})`,
  }));

  console.log(`\n📝 准备创建 ${items.length} 个竞品对比页面...`);
  console.log('   Topic Cluster: SEOPages.pro vs SEO Tools\n');

  // 使用 skill API 创建
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Please use the save_content_items_batch tool to save the following content items. 
          
User ID: ${userId}
SEO Project ID: ${seoProjectId}
Project Name: SEOPages.pro vs SEO Tools

Items to save:
${JSON.stringify(items, null, 2)}`
        }],
        projectId: seoProjectId
      })
    });

    if (response.ok) {
      console.log('✅ 请求已发送！检查 AI 响应...');
      console.log('\n🎉 刷新页面后，你应该能看到新的 Topic Cluster "SEOPages.pro vs SEO Tools"');
      console.log('   里面包含了 ' + items.length + ' 个竞品对比页面！');
    } else {
      console.error('❌ 请求失败:', response.status);
    }
  } catch (error) {
    console.error('❌ 错误:', error);
  }

  // 打印竞品列表供参考
  console.log('\n📋 竞品列表:');
  COMPETITORS.forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.name} (${c.category})`);
  });
})();
