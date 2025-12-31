# Topic Intelligence Tools

## 概述

三个新的内容智能工具，用于防止内容重复、分析主题结构和发现内容机会。

## 🛠️ 工具列表

### 1. `detect_site_topics` - 主题检测器

**功能**：分析 sitemap 和内容库，自动识别主题中心（Topic Hubs）

**何时调用**：
- ✅ **自动调用**：Site Context Acquisition 获取 sitemap 后自动执行
- 手动调用：需要刷新主题分析时

**输出**：
```json
{
  "topicHubs": [
    {
      "name": "SEO",
      "urlCount": 25,
      "coverage": "Strong",
      "sampleUrls": [...],
      "urlPatterns": ["/blog/seo", "/resources/seo"],
      "keywords": ["seo tips", "seo guide", ...]
    }
  ],
  "analysis": {
    "totalUrls": 150,
    "totalHubs": 8,
    "avgUrlsPerHub": 19,
    "strongHubs": 3,
    "weakHubs": 2
  }
}
```

**数据存储**：
- 增强的 sitemap 数据自动保存到 `site_contexts` 表
- 包含原始 URLs + 主题分析结果

---

### 2. `check_topic_duplication` - 重复检查器

**功能**：检查建议的主题是否与现有内容冲突

**何时调用**：
- ✅ **必须调用**：Topic Brainstorm 和 Page Planner 在建议主题后
- 在保存内容到库之前

**输入**：
```typescript
{
  user_id: string,
  proposed_topics: [
    {
      title: "Complete Guide to SEO",
      keyword: "seo guide",
      description: "..."
    }
  ],
  similarity_threshold: 0.7  // 0-1, 越高越严格
}
```

**输出**：
```json
{
  "results": [
    {
      "proposedTopic": "Complete Guide to SEO",
      "status": "conflict",  // safe | warning | conflict
      "conflictCount": 2,
      "conflicts": [
        {
          "source": "sitemap",
          "title": "SEO Guide for Beginners",
          "url": "/blog/seo-guide",
          "similarity": 0.85,
          "conflictType": "high_similarity"
        }
      ],
      "recommendation": "🚫 High conflict - choose different angle"
    }
  ],
  "summary": {
    "safe": 3,
    "warnings": 2,
    "conflicts": 1
  }
}
```

**冲突类型**：
- `exact_title` - 标题完全相同
- `exact_keyword` - 目标关键词完全相同
- `high_similarity` - 高度相似（根据 threshold）
- `keyword_overlap` - 关键词重叠

---

### 3. `find_topic_gaps` - 缺口发现器

**功能**：分析现有主题结构，识别内容缺口和扩展机会

**何时调用**：
- ✅ **必须调用**：Topic Brainstorm 开始时
- 制定内容战略时

**输入**：
```typescript
{
  user_id: string,
  focus_hub: "SEO" (optional),  // 聚焦特定主题
  min_hub_size: 3  // 最小主题规模
}
```

**输出**：
```json
{
  "gaps": [
    {
      "hubName": "Content Marketing",
      "currentSize": 4,
      "coverage": "Weak",
      "gapType": "under_developed",
      "priority": "high",
      "opportunities": [
        "Create 3-5 comprehensive guides covering Content Marketing fundamentals",
        "Develop a pillar page: Complete Guide to Content Marketing",
        ...
      ],
      "reasoning": "Hub has only 4 pages. Need minimum 3 to establish authority."
    }
  ],
  "summary": {
    "totalGapsFound": 5,
    "highPriority": 2,
    "mediumPriority": 2,
    "lowPriority": 1
  }
}
```

**缺口类型**：
- `under_developed` - 主题覆盖不足（< min_hub_size）
- `needs_pillar` - 缺少核心支柱页面
- `needs_supporting` - 需要更多支撑内容
- `orphan` - 孤立内容（1-2 篇）
- `new_opportunity` - 新主题机会

---

## 🔄 工作流集成

### Site Context Acquisition（自动化）

```
User triggers: Site Context Acquisition
  ↓
1. fetch_sitemap_urls (获取 sitemap)
  ↓
2. save_site_context (保存原始数据)
  ↓
3. detect_site_topics (自动调用 - 分析主题)
  ↓
4. 增强的 sitemap 数据保存到数据库
  ↓
User sees: 组织好的主题结构
```

### Topic Brainstorm（防重复）

```
User triggers: Topic Brainstorm
  ↓
1. detect_site_topics (了解现有内容)
  ↓
2. find_topic_gaps (识别机会)
  ↓
3. web_search + brainstorming (生成创意)
  ↓
4. check_topic_duplication (检查冲突)
  ↓
5. keyword_overview (验证数据)
  ↓
6. 过滤掉冲突主题，呈现安全主题
```

### Page Planner（战略对齐）

```
User triggers: Page Planner
  ↓
1. detect_site_topics (了解现有结构)
  ↓
2. find_topic_gaps (确保战略对齐)
  ↓
3. 设计集群结构
  ↓
4. check_topic_duplication (检查所有页面)
  ↓
5. 调整冲突页面或差异化角度
  ↓
6. SERP 分析 + 关键词验证
  ↓
7. 保存到内容库
```

---

## 📊 数据结构

### Enhanced Sitemap Data（存储在 site_contexts 表）

```json
{
  "urls": ["https://...", ...],
  "categorizedUrls": {
    "Blog": [...],
    "Product": [...]
  },
  "topicHubs": [
    {
      "name": "SEO",
      "urlCount": 25,
      "coverage": "Strong",
      "sampleUrls": [...],
      "urlPatterns": [...],
      "keywords": [...]
    }
  ],
  "analysis": {
    "totalUrls": 150,
    "totalHubs": 8,
    "avgUrlsPerHub": 19,
    "strongHubs": 3,
    "moderateHubs": 3,
    "weakHubs": 2,
    "analyzedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

## 🎯 关键优势

### 1. **防止内容重复**
- ❌ 之前：AI 可能建议已存在的主题
- ✅ 现在：自动检测冲突，只建议新主题

### 2. **战略对齐**
- ❌ 之前：盲目建议主题，不考虑现有结构
- ✅ 现在：基于缺口分析，战略性扩展内容

### 3. **保护 SEO**
- ❌ 之前：可能创建关键词冲突的页面
- ✅ 现在：避免自我竞争，保护现有排名

### 4. **提升效率**
- ❌ 之前：用户需要手动检查重复
- ✅ 现在：自动化检查，节省时间

### 5. **数据驱动**
- ❌ 之前：主观判断内容需求
- ✅ 现在：基于实际覆盖度和缺口数据

---

## 🚀 使用示例

### 示例 1：首次设置

```
User: "帮我获取网站的 sitemap"
→ Site Context Acquisition 运行
→ 自动调用 detect_site_topics
→ 用户看到：8 个主题中心，3 个强势，2 个弱势
```

### 示例 2：主题头脑风暴

```
User: "帮我规划 SEO 内容策略"
→ Topic Brainstorm 运行
→ 检测到：SEO 主题已有 25 篇（强势）
→ 发现缺口：Content Marketing 只有 4 篇（弱势）
→ 建议：扩展 Content Marketing，而非 SEO
→ 检查重复：过滤掉 3 个冲突主题
→ 呈现：5 个安全的新主题创意
```

### 示例 3：集群规划

```
User: "规划一个 Content Marketing 主题集群"
→ Page Planner 运行
→ 检测到：该主题目前只有 4 篇（under_developed）
→ 设计：1 个 Pillar + 5 个 Supporting 页面
→ 检查重复：1 个页面与现有内容冲突
→ 调整：修改角度为 "Advanced Content Marketing"
→ 验证：所有关键词数据正常
→ 保存：6 个页面到内容库
```

---

## ⚙️ 配置参数

### similarity_threshold（相似度阈值）

- **默认值**：0.7
- **范围**：0.0 - 1.0
- **建议**：
  - 0.8+ - 严格模式（只标记高度相似）
  - 0.7 - 平衡模式（推荐）
  - 0.5- - 宽松模式（标记更多潜在冲突）

### min_hub_size（最小主题规模）

- **默认值**：3
- **含义**：主题需要至少 N 篇内容才算"已建立"
- **建议**：
  - 3-5 - 小型网站
  - 5-10 - 中型网站
  - 10+ - 大型权威网站

---

## 📝 注意事项

1. **首次使用**：必须先运行 Site Context Acquisition
2. **数据刷新**：sitemap 更新后需要重新运行 detect_site_topics
3. **手动内容**：工具只能检测 sitemap 和内容库中的内容，无法检测未索引的页面
4. **语言支持**：支持中英文混合内容
5. **性能**：大型网站（500+ URLs）可能需要几秒钟处理时间

---

## 🔧 故障排除

### 问题：No sitemap data found

**原因**：未运行 Site Context Acquisition
**解决**：先运行 Site Context Acquisition skill

### 问题：No topic hubs found

**原因**：sitemap 数据未经过 detect_site_topics 处理
**解决**：重新运行 Site Context Acquisition（会自动调用 detect_site_topics）

### 问题：Too many conflicts detected

**原因**：similarity_threshold 设置过低
**解决**：提高 threshold 到 0.8 或手动审查冲突

---

## 📈 未来增强

- [ ] 支持多语言网站的主题检测
- [ ] 基于 GSC 数据的主题表现分析
- [ ] AI 驱动的主题命名优化
- [ ] 主题趋势和增长预测
- [ ] 竞争对手主题对比分析

