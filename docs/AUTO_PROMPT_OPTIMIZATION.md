# 自动提示词优化

## 更新日期
2026-01-05

## 问题描述

在项目初始化时，系统会自动触发 site-context 提取，原有的自动提示词过于技术化，对用户不友好：

### 原提示词 ❌
```
Acquire complete site context for https://notelm.ai. Use acquire_context_field to extract each field one by one: brand-assets, hero-section, contact-info, sitemap, page-classification, problem-statement, who-we-serve, use-cases, products-services, about-us, faq, social-proof. Report progress after each field.
```

### 存在的问题

1. **技术术语暴露**
   - "Acquire complete site context" - 技术化表达
   - "Use acquire_context_field" - 暴露了内部工具名称
   - 用户看到工具名会感到困惑

2. **字段名称不友好**
   - `brand-assets` → 应该是"品牌资产"
   - `hero-section` → 应该是"首屏区域"
   - `contact-info` → 应该是"联系方式"
   - `page-classification` → 应该是"页面分类"
   - `problem-statement` → 应该是"核心问题"
   - `who-we-serve` → 应该是"目标用户"
   - `use-cases` → 应该是"使用场景"
   - `products-services` → 应该是"产品服务"
   - `about-us` → 应该是"公司介绍"
   - `social-proof` → 应该是"社会证明"

3. **语言风格僵硬**
   - 指令式语气（"Use...", "Report..."）
   - 缺乏人性化
   - 不符合中文用户习惯

## 解决方案

### 新提示词 ✅
```
Please analyze https://notelm.ai and extract comprehensive site information: brand assets (logo, colors, fonts), hero section, contact information, sitemap, page categories, core problems addressed, target audience, use cases, products & services, company background, FAQs, and social proof. Extract each section and report progress.
```

### 优化要点

1. **自然的英文表达**
   - "Please analyze" - 礼貌、友好
   - "extract comprehensive site information" - 用户能理解的动作
   - 使用自然语言替代技术术语

2. **用户友好的字段名**
   - 使用描述性名称
   - 添加括号说明（如"brand assets (logo, colors, fonts)"）
   - 更直观易懂

3. **保留技术功能**
   - Skill 系统仍然能正确识别意图
   - 仍然会调用 `site-context` skill
   - 仍然会使用 `acquire_context_field` 工具
   - 只是对用户隐藏了技术细节

4. **保持域名引用**
   - `${fullUrl}` 动态插入当前项目域名
   - 让提示词更加个性化

## 字段映射表

| 技术名称 | 用户友好名称 | 说明 |
|---------|-------------|------|
| brand-assets | 品牌资产（logo、颜色、字体） | 视觉身份识别元素 |
| hero-section | 首屏区域 | 网站首屏的核心内容 |
| contact-info | 联系方式 | 邮箱、电话、社交媒体 |
| sitemap | 网站地图 | 站点结构 |
| page-classification | 页面分类 | 关键页面、着陆页、博客 |
| problem-statement | 核心问题 | 产品要解决的问题 |
| who-we-serve | 目标用户 | 服务的客户群体 |
| use-cases | 使用场景 | 应用案例 |
| products-services | 产品服务 | 提供的产品和服务 |
| about-us | 公司介绍 | 公司背景、使命、愿景 |
| faq | 常见问题 | FAQ |
| social-proof | 社会证明 | 评价、案例、数据 |

## 技术实现

### 文件位置
`/app/chat/[projectId]/page.tsx`

### 代码修改
```typescript
// 原代码
const prompt = `Acquire complete site context for ${fullUrl}. Use acquire_context_field to extract each field one by one: brand-assets, hero-section, contact-info, sitemap, page-classification, problem-statement, who-we-serve, use-cases, products-services, about-us, faq, social-proof. Report progress after each field.`;

// 新代码
const prompt = `Please analyze ${fullUrl} and extract comprehensive site information: brand assets (logo, colors, fonts), hero section, contact information, sitemap, page categories, core problems addressed, target audience, use cases, products & services, company background, FAQs, and social proof. Extract each section and report progress.`;
```

### 触发场景
1. 用户创建新项目
2. 项目有域名信息
3. 该项目尚未有任何对话消息
4. 系统自动创建"Context Analysis: [domain]"对话
5. 自动发送优化后的提示词

## 用户体验提升

### Before (原提示词) ❌
```
用户看到：
"Acquire complete site context for https://notelm.ai. Use acquire_context_field..."

用户心理：
- "Acquire 是什么？"
- "acquire_context_field 是个工具？"
- "brand-assets 是什么意思？"
- "为什么有这么多带横线的奇怪词？"
```

### After (新提示词) ✅
```
用户看到：
"Please analyze https://notelm.ai and extract comprehensive site information: brand assets (logo, colors, fonts)..."

用户心理：
- "Oh, the system will analyze the website for me"
- "It will extract logo, colors and other design elements"
- "Also contact info, product information, etc."
- "Feels professional and clear"
```

## 兼容性

### Skill 识别
- AI 模型仍能正确理解用户意图
- 自动激活 `site-context` skill
- 按照预期调用 17 个字段提取

### 多语言支持
使用英文提示词，系统支持：
- 英文网站分析
- 多语言内容提取
- 国际化项目
- 全球用户友好

### 向后兼容
- 不影响现有功能
- 不影响手动输入的指令
- 不影响其他 skills

## 未来优化建议

1. **多语言版本**
   - 根据用户语言偏好切换提示词
   - 当前默认英文，适应全球用户
   - 可以考虑根据浏览器语言自动切换

2. **个性化提示**
   - 根据项目类型调整提示词
   - 电商项目强调"产品服务"
   - 企业官网强调"公司介绍"

3. **进度可视化**
   - 配合 UI 显示提取进度
   - 实时反馈当前正在提取的字段
   - 完成度百分比显示

4. **智能推荐**
   - 根据网站类型推荐重点关注字段
   - 提示缺失的关键信息

## 总结

这次优化将技术化的提示词转化为用户友好的自然语言，同时保持了系统功能的完整性。用户体验得到显著提升，不再被技术术语困扰，能够清楚理解系统正在做什么。

**核心原则**：
- ✅ 对用户：使用自然语言，清晰易懂
- ✅ 对系统：保持技术功能，准确执行
- ✅ 平衡点：用户友好 + 技术可靠
- ✅ 国际化：使用英文，适应全球用户

