# Competitor Analysis Skill

## Overview

The **Competitor Analysis** skill is a comprehensive competitive intelligence tool that automates the process of researching competitors, analyzing their websites, extracting pricing and feature information, and generating detailed strategic reports.

## Features

### Automatic Competitor Discovery
- If you don't know your competitors, the skill will automatically discover 10-20 direct competitors using web search
- Searches for alternatives, competitors, and similar tools in your market
- Prioritizes direct competitors with accessible websites and recent activity

### Deep Website Analysis
For each competitor, the skill will:
- Visit their homepage to understand value proposition
- Navigate to pricing pages (tries multiple paths: /pricing, /plans, navigation menus)
- Extract all pricing tiers, features, and limits
- Visit features/product pages to compile complete feature lists
- Check about/company pages for background information
- Visit 3-5 pages per competitor for comprehensive analysis

### Comprehensive Reporting
Generates a detailed markdown report including:
- **Executive Summary** with key findings and recommendations
- **Market Overview** with competitive landscape analysis
- **Competitor Deep Dive** with individual profiles for each competitor
- **Feature Comparison Matrix** comparing all competitors side-by-side
- **Pricing Comparison** with entry-level, mid-tier, and enterprise plans
- **Strategic Insights** including:
  - Market positioning map
  - Feature gaps and opportunities
  - Pricing strategy analysis
  - Target market insights
- **Actionable Recommendations** with immediate action items

## How to Use

### 1. Trigger the Skill

Navigate to the Skills page and click on **"Competitor Analysis"** or type in chat:
```
I need a competitor analysis
```

### 2. Fill Out the Form

You'll be prompted to provide:

**Required:**
- **Your Product Name**: e.g., "Acme Analytics"
- **Your Website URL**: e.g., "https://acme-analytics.com"

**Optional:**
- **Product Description**: Brief description of what your product does (helps with competitor discovery)
- **Known Competitors**: Comma-separated list of competitor names
- **Competitor URLs**: Comma-separated list of competitor website URLs

**Example:**
```
Your Product Name: Acme Analytics
Your Website URL: https://acme-analytics.com
Product Description: AI-powered web analytics platform for e-commerce businesses
Known Competitors: Google Analytics, Mixpanel, Amplitude
Competitor URLs: https://analytics.google.com, https://mixpanel.com, https://amplitude.com
```

### 3. Wait for Analysis

The skill will:
1. Visit your website to understand your product
2. Discover competitors (if not provided) using web search
3. Visit each competitor's website (3-5 pages each)
4. Extract pricing, features, and positioning information
5. Generate a comprehensive markdown report

**Estimated Duration:** 15-30 minutes (depending on number of competitors)

### 4. Review the Report

You'll receive:
- A detailed markdown report saved as a file
- A summary in chat with key findings
- Actionable recommendations and next steps

## Use Cases

### 1. Market Research
- Understand the competitive landscape before launching a product
- Identify market gaps and opportunities
- Assess market maturity and entry barriers

### 2. Pricing Strategy
- Benchmark your pricing against competitors
- Identify pricing sweet spots in your market
- Plan pricing tiers and feature packaging

### 3. Feature Planning
- Discover what features competitors offer
- Identify feature gaps in your product
- Find unique differentiators

### 4. Strategic Planning
- Understand competitive threats
- Identify strategic opportunities
- Plan product roadmap based on market analysis

### 5. Sales Enablement
- Arm your sales team with competitive intelligence
- Create comparison materials for prospects
- Understand competitor positioning and messaging

## Report Structure

The generated report includes:

```markdown
# Competitive Analysis Report: [Your Product]

## Executive Summary
[High-level findings and recommendations]

## Market Overview
- Industry context
- Competitive landscape
- Market maturity assessment

## Your Product: [Product Name]
- Positioning
- Core features
- Pricing (if available)

## Competitor Deep Dive
[Detailed profile for each competitor with:]
- Positioning and value proposition
- Core features (categorized)
- Pricing structure (all tiers)
- Strengths and weaknesses
- Target market

## Comparative Analysis
- Feature Comparison Matrix
- Pricing Comparison (entry, mid-tier, enterprise)
- Pricing insights and averages

## Strategic Insights
- Market positioning map
- Feature gaps & opportunities
- Pricing strategy analysis
- Target market insights

## Key Takeaways & Recommendations
- Top 3 strategic opportunities
- Top 3 competitive threats
- Immediate action items

## Appendix
- List of all competitors analyzed
- Research methodology
- Limitations
```

## Technical Details

### Tools Used

**Research:**
- `web_search`: Discovers competitors and validates market positioning

**Browser Automation (MCP):**
- `browser_navigate`: Visits competitor websites
- `browser_snapshot`: Captures page structure and content
- `browser_click`: Navigates to pricing and feature pages
- `browser_take_screenshot`: Documents key pages
- `browser_tabs`: Manages multiple tabs for parallel analysis

**File Management:**
- `create_file`: Saves the final report
- `create_conversation_tracker`: Tracks analysis progress

### Workflow

1. **Understand Product** (2-3 minutes)
   - Visit user's website
   - Analyze positioning, features, target market
   - Determine product category and industry

2. **Discover Competitors** (3-5 minutes)
   - If provided: Use competitor list
   - If not provided: Web search for alternatives
   - Identify 10-20 direct competitors
   - Validate competitor websites are accessible

3. **Analyze Each Competitor** (1-2 minutes per competitor)
   - Navigate to homepage
   - Snapshot and analyze value proposition
   - Find and navigate to pricing page
   - Extract all pricing tiers and features
   - Visit features/product pages
   - Visit about/company pages
   - Take screenshots of key pages

4. **Synthesize Report** (3-5 minutes)
   - Compile all collected data
   - Generate comparison matrices
   - Calculate pricing insights
   - Identify strategic opportunities
   - Create actionable recommendations
   - Save as markdown file

## Best Practices

### For Better Competitor Discovery
- Provide a clear product description
- Mention your industry or category
- Include at least 2-3 known competitors if possible

### For More Accurate Pricing Analysis
- Ensure your website has a public pricing page
- The skill will try multiple paths to find pricing
- Some competitors may hide pricing behind forms (will be noted in report)

### For Better Feature Comparison
- Have a clear features page on your website
- The skill will extract features from multiple pages
- Integration lists and product tours are also analyzed

### For Strategic Value
- Review the "Strategic Insights" section carefully
- Focus on the "Feature Gaps & Opportunities" section
- Prioritize the "Immediate Action Items"
- Share the report with your product and marketing teams

## Limitations

- **Login-Required Pages**: Cannot access pages that require authentication
- **JavaScript-Heavy Sites**: Some dynamic content may not be fully captured
- **Rate Limiting**: May need to pause between competitor visits
- **Pricing Behind Forms**: Some companies hide pricing behind demo requests
- **International Sites**: Analysis is optimized for English-language websites

## Tips for Success

1. **Be Patient**: Analyzing 10-20 competitors thoroughly takes time
2. **Provide Context**: More information about your product = better competitor discovery
3. **Review Regularly**: Run analysis quarterly to track competitive changes
4. **Combine with Manual Research**: Use the report as a foundation, supplement with manual research
5. **Share with Team**: The report is designed for executive presentation

## Example Output

See `example-competitor-analysis-report.md` for a sample output.

## Support

If you encounter issues or have questions:
1. Check that competitor websites are accessible (not blocked, not requiring login)
2. Verify your product website URL is correct
3. Try providing more competitor context if discovery is limited
4. Contact support with the conversation ID for debugging

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Category:** Research  
**Estimated Duration:** 15-30 minutes

