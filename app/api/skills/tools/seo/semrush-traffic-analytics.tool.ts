import { tool } from 'ai';
import { z } from 'zod';

/**
 * Semrush Traffic Analytics API (Trends API) - Traffic Summary
 * 获取域名的流量概览：访问量、用户数、页面停留时间等
 * 
 * 文档: https://developer.semrush.com/api/basics/api-tutorials/trends-api/
 * 端点: https://api.semrush.com/analytics/ta/api/v3/summary
 * 
 * 消耗: 1 API unit per line (每个域名 1 unit)
 */
export const get_traffic_summary = tool({
  description: 'Get traffic overview for one or more domains: visits, users, bounce rate, pages per visit, time on site. Use this for high-level traffic comparison.',
  parameters: z.object({
    targets: z.array(z.string()).describe('List of domains to analyze (e.g., ["example.com", "competitor.com"])'),
    display_date: z.string().optional().describe('Date in YYYY-MM-01 format. Defaults to last month if not specified.'),
    country: z.string().optional().describe('Country code (e.g., us, uk, de). If not set, returns global data.'),
  }),
  execute: async ({ targets, display_date, country }) => {
    console.log(`[get_traffic_summary] Starting analysis for domains: ${targets.join(', ')}`);
    
    try {
      const apiKey = process.env.SEMRUSH_API_KEY;
      if (!apiKey) {
        console.error('[get_traffic_summary] ERROR: SEMRUSH_API_KEY is not configured');
        throw new Error('SEMRUSH_API_KEY is not configured');
      }

      // 构建 API URL
      // 文档: https://api.semrush.com/analytics/ta/api/v3/summary?targets=domain1,domain2&export_columns=...&key=API_KEY
      const url = new URL('https://api.semrush.com/analytics/ta/api/v3/summary');
      url.searchParams.append('targets', targets.join(','));
      url.searchParams.append('export_columns', 'target,visits,users,time_on_site,pages_per_visit,bounce_rate');
      url.searchParams.append('key', apiKey);
      
      if (display_date) {
        url.searchParams.append('display_date', display_date);
      }
      if (country) {
        url.searchParams.append('country', country);
      }

      console.log(`[get_traffic_summary] Calling Semrush Trends API: ${url.toString().replace(apiKey, 'KEY_HIDDEN')}`);

      const response = await fetch(url.toString());
      console.log(`[get_traffic_summary] Response status: ${response.status} ${response.statusText}`);

      const text = await response.text();
      console.log(`[get_traffic_summary] Raw response:`, text.substring(0, 500));

      if (!response.ok || text.startsWith('ERROR')) {
        console.error(`[get_traffic_summary] API error:`, text);
        throw new Error(`Semrush Trends API error: ${text}`);
      }

      // 解析 CSV 响应
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        return {
          success: true,
          no_data: true,
          message: 'No traffic data found for the specified domains.',
          targets
        };
      }

      const header = lines[0].split(';');
      const results = lines.slice(1).map(line => {
        const values = line.split(';');
        return {
          target: values[0],
          visits: parseInt(values[1]) || 0,
          users: parseInt(values[2]) || 0,
          time_on_site: parseFloat(values[3]) || 0,
          pages_per_visit: parseFloat(values[4]) || 0,
          bounce_rate: parseFloat(values[5]) || 0,
        };
      });

      console.log(`[get_traffic_summary] Successfully retrieved data for ${results.length} domains`);

      return {
        success: true,
        display_date: display_date || 'last month',
        country: country || 'global',
        results
      };
    } catch (error: any) {
      console.error(`[get_traffic_summary] ERROR:`, error.message);
      return {
        success: false,
        error: error.message,
        targets
      };
    }
  },
});

(get_traffic_summary as any).metadata = {
  name: 'Traffic Summary',
  provider: 'Semrush Trends'
};


/**
 * Semrush Traffic Analytics API (Trends API) - Traffic Sources
 * 获取流量来源占比：Direct, Search (Organic/Paid), Social, Referral, Mail, Display Ads
 * 
 * 这是识别竞品 SEO 依赖度的核心接口！
 * 
 * 文档: https://developer.semrush.com/api/basics/api-tutorials/trends-api/
 * 端点: https://api.semrush.com/analytics/ta/api/v3/traffic_sources
 * 
 * 消耗: 1 API unit per request
 */
export const get_traffic_sources = tool({
  description: 'Get traffic source breakdown for a domain: Direct, Search (Organic vs Paid), Social, Referral, Mail, Display Ads. CRITICAL for identifying SEO-dependent competitors.',
  parameters: z.object({
    target: z.string().describe('The domain to analyze (e.g., example.com)'),
    display_date: z.string().optional().describe('Date in YYYY-MM-01 format. Defaults to last month.'),
    country: z.string().optional().describe('Country code (e.g., us, uk, de). If not set, returns global data.'),
  }),
  execute: async ({ target, display_date, country }) => {
    console.log(`[get_traffic_sources] Analyzing traffic sources for: ${target}`);
    
    try {
      const apiKey = process.env.SEMRUSH_API_KEY;
      if (!apiKey) {
        throw new Error('SEMRUSH_API_KEY is not configured');
      }

      // 端点: /traffic_sources
      const url = new URL('https://api.semrush.com/analytics/ta/api/v3/traffic_sources');
      url.searchParams.append('target', target);
      url.searchParams.append('key', apiKey);
      
      if (display_date) {
        url.searchParams.append('display_date', display_date);
      }
      if (country) {
        url.searchParams.append('country', country);
      }

      console.log(`[get_traffic_sources] Calling: ${url.toString().replace(apiKey, 'KEY_HIDDEN')}`);

      const response = await fetch(url.toString());
      const text = await response.text();
      console.log(`[get_traffic_sources] Response:`, text.substring(0, 500));

      if (!response.ok || text.startsWith('ERROR')) {
        throw new Error(`Semrush Trends API error: ${text}`);
      }

      // 解析响应 - Traffic Sources 返回的是各渠道数据
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        return {
          success: true,
          no_data: true,
          message: `No traffic source data found for "${target}".`,
          target
        };
      }

      // 解析 CSV: 通常是 source_type;share;value 格式
      const header = lines[0].split(';');
      const sources: Record<string, number> = {};
      
      lines.slice(1).forEach(line => {
        const values = line.split(';');
        const sourceType = values[0]?.toLowerCase();
        const share = parseFloat(values[1]) || 0;
        if (sourceType) {
          sources[sourceType] = share;
        }
      });

      // 计算 SEO 依赖度分析
      const searchTotal = (sources['search'] || 0);
      const organicShare = sources['search_organic'] || sources['organic'] || 0;
      const paidShare = sources['search_paid'] || sources['paid'] || 0;
      const directShare = sources['direct'] || 0;
      const socialShare = sources['social'] || 0;
      const referralShare = sources['referral'] || 0;
      const mailShare = sources['mail'] || 0;
      const displayShare = sources['display_ads'] || sources['display'] || 0;

      const result = {
        success: true,
        target,
        display_date: display_date || 'last month',
        country: country || 'global',
        traffic_sources: {
          direct: directShare,
          search: searchTotal,
          search_organic: organicShare,
          search_paid: paidShare,
          social: socialShare,
          referral: referralShare,
          mail: mailShare,
          display_ads: displayShare,
        },
        // SEO 依赖度分析
        seo_analysis: {
          is_seo_dependent: organicShare > 30,
          is_high_search_traffic: searchTotal > 40,
          organic_vs_paid_ratio: paidShare > 0 
            ? (organicShare / paidShare).toFixed(2)
            : organicShare > 0 ? 'Infinite (no paid)' : 'N/A',
          primary_channel: Object.entries(sources)
            .filter(([k]) => !k.includes('search_'))
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown',
        },
        raw_sources: sources,
      };

      console.log(`[get_traffic_sources] Successfully analyzed ${target}:`, {
        search: searchTotal,
        organic: organicShare,
        direct: directShare
      });

      return result;
    } catch (error: any) {
      console.error(`[get_traffic_sources] ERROR:`, error.message);
      return {
        success: false,
        error: error.message,
        target
      };
    }
  },
});

(get_traffic_sources as any).metadata = {
  name: 'Traffic Sources',
  provider: 'Semrush Trends'
};


/**
 * Semrush Traffic Analytics API (Trends API) - Daily Traffic
 * 获取每日流量数据，用于发现流量波动、季节性和活动影响
 * 
 * 端点: https://api.semrush.com/analytics/ta/api/v3/summary_by_day
 * 
 * 消耗: 1 API unit per request
 */
export const get_daily_traffic = tool({
  description: 'Get daily traffic breakdown for a domain. Useful for spotting traffic spikes, dips, and short-term patterns.',
  parameters: z.object({
    target: z.string().describe('The domain to analyze (e.g., example.com)'),
    display_date: z.string().optional().describe('Month to analyze in YYYY-MM-01 format. Defaults to last month.'),
    country: z.string().optional().describe('Country code (e.g., us, uk, de).'),
  }),
  execute: async ({ target, display_date, country }) => {
    console.log(`[get_daily_traffic] Getting daily traffic for: ${target}`);
    
    try {
      const apiKey = process.env.SEMRUSH_API_KEY;
      if (!apiKey) {
        throw new Error('SEMRUSH_API_KEY is not configured');
      }

      const url = new URL('https://api.semrush.com/analytics/ta/api/v3/summary_by_day');
      url.searchParams.append('target', target);
      url.searchParams.append('key', apiKey);
      
      if (display_date) {
        url.searchParams.append('display_date', display_date);
      }
      if (country) {
        url.searchParams.append('country', country);
      }

      console.log(`[get_daily_traffic] Calling: ${url.toString().replace(apiKey, 'KEY_HIDDEN')}`);

      const response = await fetch(url.toString());
      const text = await response.text();
      console.log(`[get_daily_traffic] Response:`, text.substring(0, 500));

      if (!response.ok || text.startsWith('ERROR')) {
        throw new Error(`Semrush Trends API error: ${text}`);
      }

      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        return {
          success: true,
          no_data: true,
          message: `No daily traffic data found for "${target}".`,
          target
        };
      }

      // 解析每日数据
      const header = lines[0].split(';');
      const dailyData = lines.slice(1).map(line => {
        const values = line.split(';');
        return {
          date: values[0],
          visits: parseInt(values[1]) || 0,
          users: parseInt(values[2]) || 0,
        };
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // 计算趋势分析
      const totalVisits = dailyData.reduce((sum, d) => sum + d.visits, 0);
      const avgDailyVisits = Math.round(totalVisits / dailyData.length);
      const maxDay = dailyData.reduce((max, d) => d.visits > max.visits ? d : max, dailyData[0]);
      const minDay = dailyData.reduce((min, d) => d.visits < min.visits ? d : min, dailyData[0]);

      // 检测流量激增 (超过平均值 50%)
      const spikes = dailyData.filter(d => d.visits > avgDailyVisits * 1.5);

      return {
        success: true,
        target,
        display_date: display_date || 'last month',
        country: country || 'global',
        daily_data: dailyData,
        summary: {
          total_visits: totalVisits,
          avg_daily_visits: avgDailyVisits,
          peak_day: maxDay,
          lowest_day: minDay,
          spikes_detected: spikes.length,
          spike_days: spikes.map(s => s.date),
        }
      };
    } catch (error: any) {
      console.error(`[get_daily_traffic] ERROR:`, error.message);
      return {
        success: false,
        error: error.message,
        target
      };
    }
  },
});

(get_daily_traffic as any).metadata = {
  name: 'Daily Traffic',
  provider: 'Semrush Trends'
};


/**
 * Batch Traffic Sources Analysis
 * 批量获取多个域名的流量来源，用于竞品对比
 * 
 * 消耗: 1 API unit per domain
 */
export const get_traffic_sources_batch = tool({
  description: 'Get traffic source breakdown for multiple domains in batch. Ideal for comparing SEO dependency across competitors. Returns sorted list with top SEO performers.',
  parameters: z.object({
    targets: z.array(z.string()).describe('List of domains to analyze (max 10)'),
    country: z.string().optional().describe('Country code (e.g., us, uk, de).'),
  }),
  execute: async ({ targets, country }) => {
    console.log(`[get_traffic_sources_batch] Batch analyzing ${targets.length} domains`);
    
    try {
      const apiKey = process.env.SEMRUSH_API_KEY;
      if (!apiKey) {
        throw new Error('SEMRUSH_API_KEY is not configured');
      }

      // 限制最多 10 个域名
      const domainList = targets.slice(0, 10);
      
      // 并行请求每个域名的流量来源
      const results = await Promise.all(
        domainList.map(async (target) => {
          try {
            const url = new URL('https://api.semrush.com/analytics/ta/api/v3/traffic_sources');
            url.searchParams.append('target', target);
            url.searchParams.append('key', apiKey);
            if (country) {
              url.searchParams.append('country', country);
            }

            const response = await fetch(url.toString());
            const text = await response.text();

            if (!response.ok || text.startsWith('ERROR')) {
              return { target, success: false, error: text };
            }

            const lines = text.trim().split('\n');
            if (lines.length < 2) {
              return { target, success: true, no_data: true };
            }

            // 解析流量来源
            const sources: Record<string, number> = {};
            lines.slice(1).forEach(line => {
              const values = line.split(';');
              const sourceType = values[0]?.toLowerCase();
              const share = parseFloat(values[1]) || 0;
              if (sourceType) {
                sources[sourceType] = share;
              }
            });

            return {
              target,
              success: true,
              direct: sources['direct'] || 0,
              search: sources['search'] || 0,
              search_organic: sources['search_organic'] || sources['organic'] || 0,
              search_paid: sources['search_paid'] || sources['paid'] || 0,
              social: sources['social'] || 0,
              referral: sources['referral'] || 0,
            };
          } catch (err: any) {
            return { target, success: false, error: err.message };
          }
        })
      );

      // 按 organic share 排序
      const validResults = results
        .filter((r): r is typeof r & { search_organic: number } => r.success && !('no_data' in r))
        .sort((a, b) => (b.search_organic || 0) - (a.search_organic || 0));

      const topSeoPerformers = validResults.slice(0, 3).map(r => ({
        domain: r.target,
        organic_share: r.search_organic,
        search_total: r.search,
        is_seo_dependent: r.search_organic > 30,
      }));

      console.log(`[get_traffic_sources_batch] Completed. Top SEO performers:`, topSeoPerformers);

      return {
        success: true,
        country: country || 'global',
        total_domains: domainList.length,
        successful_queries: validResults.length,
        results,
        top_seo_performers: topSeoPerformers,
        summary: {
          avg_organic_share: validResults.length > 0
            ? (validResults.reduce((sum, r) => sum + r.search_organic, 0) / validResults.length).toFixed(2)
            : 0,
          domains_seo_dependent: validResults.filter(r => r.search_organic > 30).length,
          domains_high_search: validResults.filter(r => r.search > 40).length,
        }
      };
    } catch (error: any) {
      console.error(`[get_traffic_sources_batch] ERROR:`, error.message);
      return {
        success: false,
        error: error.message,
        targets
      };
    }
  },
});

(get_traffic_sources_batch as any).metadata = {
  name: 'Batch Traffic Sources',
  provider: 'Semrush Trends'
};


/**
 * Semrush Traffic Analytics API (Trends API) - Geo Distribution
 * 获取域名流量的地理分布
 * 
 * 端点: https://api.semrush.com/analytics/ta/api/v3/geo_distribution
 */
export const get_geo_distribution = tool({
  description: 'Get geographic distribution of traffic for a domain. Shows which countries drive the most traffic.',
  parameters: z.object({
    target: z.string().describe('The domain to analyze (e.g., example.com)'),
    display_date: z.string().optional().describe('Date in YYYY-MM-01 format.'),
  }),
  execute: async ({ target, display_date }) => {
    console.log(`[get_geo_distribution] Analyzing geo distribution for: ${target}`);
    
    try {
      const apiKey = process.env.SEMRUSH_API_KEY;
      if (!apiKey) {
        throw new Error('SEMRUSH_API_KEY is not configured');
      }

      const url = new URL('https://api.semrush.com/analytics/ta/api/v3/geo_distribution');
      url.searchParams.append('target', target);
      url.searchParams.append('key', apiKey);
      
      if (display_date) {
        url.searchParams.append('display_date', display_date);
      }

      console.log(`[get_geo_distribution] Calling: ${url.toString().replace(apiKey, 'KEY_HIDDEN')}`);

      const response = await fetch(url.toString());
      const text = await response.text();

      if (!response.ok || text.startsWith('ERROR')) {
        throw new Error(`Semrush Trends API error: ${text}`);
      }

      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        return {
          success: true,
          no_data: true,
          message: `No geo distribution data found for "${target}".`,
          target
        };
      }

      const countries = lines.slice(1).map(line => {
        const values = line.split(';');
        return {
          country: values[0],
          share: parseFloat(values[1]) || 0,
          visits: parseInt(values[2]) || 0,
        };
      }).sort((a, b) => b.share - a.share);

      return {
        success: true,
        target,
        display_date: display_date || 'last month',
        countries: countries.slice(0, 20), // Top 20 countries
        top_country: countries[0],
      };
    } catch (error: any) {
      console.error(`[get_geo_distribution] ERROR:`, error.message);
      return {
        success: false,
        error: error.message,
        target
      };
    }
  },
});

(get_geo_distribution as any).metadata = {
  name: 'Geo Distribution',
  provider: 'Semrush Trends'
};
