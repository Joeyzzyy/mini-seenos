# 为什么只生成了部分内容？

## 🤔 问题现象

用户报告：
> "Feature Comparison Table"部分已生成... 页面内容将继续分步生成...  
> 怎么会变成这样，这个触发的一定应该是整个页面生成的 skill 啊

AI 只调用了 `draft_page_section` 生成单个部分，而不是执行完整的 6 步页面生成工作流。

---

## 🔍 根本原因分析

### 问题 1：Skill 描述不够明确

**修改前**：
```typescript
description: 'Tools for generating full page content, including images and final saving.'
```

这个描述太模糊，AI 可能认为：
- "Tools" = 一组独立工具
- 可以只调用其中一个工具（`draft_page_section`）

### 问题 2：System Prompt 缺少强调

Prompt 中虽然写了完整工作流，但没有明确强调：
- ❌ 这是一个**完整的页面生成流程**
- ❌ 必须执行**所有 6 个步骤**
- ❌ 不能只调用一个工具就停止

### 问题 3：用户请求可能不够明确

用户说"生成这个页面"时，AI 可能理解为：
- "先生成一个部分看看"
- "逐步生成"
- 而不是"一次性生成完整页面"

---

## ✅ 解决方案

### 修改 1：明确 Skill 描述

**修改后**：
```typescript
description: 'COMPLETE PAGE GENERATION: Generates full-page content from outline to final HTML. This skill executes the entire production workflow automatically.'
```

关键改进：
- ✅ "COMPLETE PAGE GENERATION" - 强调完整性
- ✅ "from outline to final HTML" - 明确起点和终点
- ✅ "executes the entire production workflow automatically" - 强调自动化执行全流程

### 修改 2：添加使用场景说明

```typescript
systemPrompt: `You are a professional content producer responsible for COMPLETE PAGE GENERATION.

CRITICAL: This skill is designed for FULL PAGE PRODUCTION, not individual sections.

WHEN TO USE THIS SKILL:
- User says "generate the page", "create the full content", "produce the content"
- User references a content item from the library and wants it generated
- User wants to go from outline to final publishable HTML

WHAT THIS SKILL DOES:
This skill executes the COMPLETE 6-step workflow to produce a finished HTML page:
0. Fetch site branding contexts (header/footer/head tags)
1. Load content item outline and SEO data
2. Draft ALL sections with rich content
3. Generate images for sections
4. Assemble HTML with proper styling
5. Merge with site branding
6. Save final page to database

DO NOT use this skill for:
❌ Just drafting one section (that's a different workflow)
❌ Just generating images
❌ Just assembling existing content`
```

### 修改 3：添加强制完整执行的规则

```typescript
IMPORTANT RULES - COMPLETE WORKFLOW EXECUTION:
❗ You MUST execute ALL 6 steps - this is a COMPLETE page generation workflow
❗ DO NOT stop after drafting one section - you must draft ALL sections
❗ DO NOT skip image generation - images are required
❗ DO NOT skip the HTML assembly - all sections must be combined
❗ DO NOT skip the merge step - site contexts must be integrated
❗ DO NOT skip the save step - the page must be saved to database
```

---

## 📝 正确的使用方式

### ✅ 用户应该这样说：

```
"生成完整页面"
"Generate the full page"
"Create the complete content for this item"
"Produce the entire page from the outline"
```

### ❌ 避免这样说（容易被误解）：

```
"生成页面"（可能被理解为生成部分）
"开始生成"（可能被理解为逐步生成）
"创建内容"（不明确是完整还是部分）
```

---

## 🔧 技术实现细节

### Skill 的工作方式

Content Production Skill 被设计为一个**原子化的完整流程**：

```typescript
Step 0: get_header + get_footer + get_head_tags
   ↓
Step 1: get_content_item_detail (加载outline)
   ↓
Step 2: draft_page_section × N (为每个section生成内容)
   ↓
Step 3: deerapi_generate_images × M (生成所有图片)
   ↓
Step 4: assemble_html_page (组装HTML)
   ↓
Step 5: merge_html_with_site_contexts (融合branding)
   ↓
Step 6: save_final_page (保存到数据库)
```

**关键点**：这 6 个步骤必须全部执行，不能只执行其中一个。

### 为什么AI会只调用一个工具？

可能的原因：
1. **Planning不够明确**：AI的plan中没有列出所有6个步骤
2. **误解用户意图**：AI认为用户只想看一个部分
3. **Skill描述模糊**：AI没有理解这是一个完整流程
4. **Stream中断**：AI在生成过程中被其他因素中断

---

## 🎯 如何确保完整执行

### 方法 1：明确指令

用户说：
> "请执行完整的页面生成流程，包括所有sections、images、HTML组装和保存"

### 方法 2：引用 Content Item

用户说：
> "为 Content Library 中的 [item_id] 生成完整页面"

当提到 "Content Library" 或 "content item" 时，AI 更容易理解这是一个完整的页面生成任务。

### 方法 3：明确步骤

用户说：
> "1. 获取outline  
> 2. 生成所有sections  
> 3. 生成images  
> 4. 组装HTML  
> 5. 合并header/footer  
> 6. 保存到数据库"

---

## 📊 监控和调试

### 如何检查AI是否正确执行了工作流？

查看工具调用记录，应该看到：

```
✅ get_header
✅ get_footer
✅ get_head_tags
✅ get_content_item_detail
✅ draft_page_section (多次，每个section一次)
✅ deerapi_generate_images (如果有图片)
✅ assemble_html_page
✅ merge_html_with_site_contexts
✅ save_final_page
```

如果只看到：
```
❌ draft_page_section (只有一次)
```

说明AI没有执行完整流程。

### 解决方法

1. **重新发送指令**：明确要求"完整页面生成"
2. **检查Planning**：查看AI的plan是否包含所有6个步骤
3. **手动触发**：如果必要，可以手动要求AI继续执行后续步骤

---

## 🔮 未来改进方向

### 1. 添加流程进度提示

在每个步骤完成后，AI 显示：
```
✓ Step 1/6: Fetched outline with 8 sections
✓ Step 2/6: Drafted all 8 sections (4500 words total)
✓ Step 3/6: Generated 5 images
...
```

### 2. 流程完整性检查

在 `draft_page_section` 工具返回时，检查：
- 是否是第一个section？
- outline中总共有多少个sections？
- 提示AI："还有 X 个 sections 需要draft"

### 3. 创建专用的"完整页面生成"工具

将整个6步流程封装为一个工具：
```typescript
export const generate_complete_page = tool({
  description: 'Generate a complete page from outline to final HTML',
  execute: async ({ item_id, user_id }) => {
    // 内部自动执行所有6个步骤
  }
});
```

---

## 总结

**核心问题**：AI 没有理解 Content Production Skill 是一个**完整的原子化流程**，而是把它当作一组可以独立调用的工具。

**解决方案**：
1. ✅ 明确 Skill 描述（"COMPLETE PAGE GENERATION"）
2. ✅ 添加使用场景说明
3. ✅ 强调必须执行所有6个步骤
4. ✅ 用户使用更明确的指令

**预期效果**：AI 在识别到页面生成任务时，会自动执行完整的 6 步workflow，而不是只调用一个工具。

---

**更新日期**: 2025-12-21  
**问题类型**: AI 行为 / Workflow 执行  
**影响范围**: Content Production Skill

