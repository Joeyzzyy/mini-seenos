# Site Contexts 架构重构文档

## 📋 重构背景

### 问题分析

用户发现 header 和 footer 没有被正确保存到最终的 HTML 中。经过分析发现了以下问题：

1. **职责不清**：`assemble_html_page` 工具既负责组装 HTML，又负责获取和集成 site contexts
2. **不透明**：AI 无法明确知道 header/footer/head_tags 是否被获取和集成
3. **难以调试**：当出现问题时，无法判断是哪个环节出了问题
4. **参数依赖**：需要记得传 `user_id` 参数，否则 contexts 不会被集成

### 正确的设计理念

> **Header、Footer、Head Tags 是三个独立的要素，应该有三个独立的工具处理，然后在 skill 中被要求执行，最后由 AI 主导融合生成的 HTML 和这三个上下文的组合**

---

## 🏗️ 新架构设计

### 核心原则

1. **职责分离**：每个工具只做一件事
2. **显式调用**：AI 明确知道每一步在做什么
3. **透明流程**：每个环节的结果都可见
4. **AI 主导**：由 AI 控制融合逻辑，而不是工具自动处理

### 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      Content Production Skill                │
│                                                               │
│  Step 0: Fetch Site Contexts (3 independent tools)          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ get_header   │  │ get_footer   │  │ get_head_tags│      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         ▼                  ▼                  ▼               │
│    header: HTML      footer: HTML      head_tags: HTML      │
│                                                               │
│  Step 1-3: Draft content and generate images                │
│                                                               │
│  Step 4: Assemble base HTML                                 │
│  ┌──────────────────────┐                                   │
│  │ assemble_html_page   │                                   │
│  └──────────┬───────────┘                                   │
│             ▼                                                 │
│       base_html (without contexts)                           │
│                                                               │
│  Step 5: Merge with site contexts (AI controlled)           │
│  ┌───────────────────────────────────────────┐              │
│  │    merge_html_with_site_contexts          │              │
│  │  - base_html (from step 4)                │              │
│  │  - header (from step 0)                   │              │
│  │  - footer (from step 0)                   │              │
│  │  - head_tags (from step 0)                │              │
│  └───────────────────┬───────────────────────┘              │
│                      ▼                                        │
│               merged_html (final HTML)                       │
│                                                               │
│  Step 6: Save to database                                   │
│  ┌──────────────────────┐                                   │
│  │   save_final_page    │                                   │
│  │  - merged_html       │                                   │
│  └──────────────────────┘                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 新增工具

### 1. `get_header.tool.ts`

**作用**：获取用户保存的 header HTML

**参数**：
- `user_id`: string

**返回**：
```typescript
{
  success: boolean,
  header: string | null,  // HTML内容
  message: string
}
```

### 2. `get_footer.tool.ts`

**作用**：获取用户保存的 footer HTML

**参数**：
- `user_id`: string

**返回**：
```typescript
{
  success: boolean,
  footer: string | null,  // HTML内容
  message: string
}
```

### 3. `get_head_tags.tool.ts`

**作用**：获取用户保存的自定义 head 标签（meta tags, scripts, styles等）

**参数**：
- `user_id`: string

**返回**：
```typescript
{
  success: boolean,
  head_tags: string | null,  // HTML内容
  message: string
}
```

### 4. `merge-html-with-site-contexts.tool.ts`

**作用**：将基础 HTML 与 site contexts 智能融合

**参数**：
```typescript
{
  base_html: string,       // 从 assemble_html_page 返回的基础 HTML
  header?: string,          // 可选：header HTML
  footer?: string,          // 可选：footer HTML
  head_tags?: string        // 可选：自定义 head 标签
}
```

**返回**：
```typescript
{
  success: boolean,
  merged_html: string,      // 合并后的完整 HTML
  has_header: boolean,
  has_footer: boolean,
  has_custom_head: boolean,
  message: string
}
```

**融合逻辑**：
1. 提取 base_html 的 `<head>` 和 `<body>` 内容
2. 合并 head 标签（避免重复，保留页面特定的 title 和 description）
3. 在 `<body>` 开头插入 header
4. 在 `</body>` 结尾前插入 footer
5. 重建完整的 HTML5 文档

---

## 🔄 修改的工具

### `assemble_html_page.tool.ts`

**移除的功能**：
- ❌ 不再接受 `user_id` 参数
- ❌ 不再自动获取 site contexts
- ❌ 不再自动拼接 header/footer
- ❌ 不再自动合并 head tags

**保留的功能**：
- ✅ 将 Markdown 转换为 HTML
- ✅ 替换图片占位符
- ✅ 生成基础的 HTML5 文档结构
- ✅ 应用 CSS 样式
- ✅ 设置页面特定的 SEO meta 标签

**新的返回值说明**：
```typescript
{
  success: true,
  html_content: string,  // 基础 HTML（不包含 header/footer）
  message: "Base HTML page assembled successfully..."
}
```

---

## 📝 更新的 Skill Prompt

### 新的工作流程（6步）

```
0. FETCH SITE CONTEXTS (IMPORTANT):
   - Call get_header with user_id
   - Call get_footer with user_id
   - Call get_head_tags with user_id
   - Remember these for step 5

1. FETCH DATA:
   - Call get_content_item_detail

2. WRITING:
   - Call draft_page_section for each section

3. IMAGE GENERATION:
   - Call deerapi_generate_images for sections with placeholders

4. ASSEMBLE BASE HTML:
   - Call assemble_html_page (WITHOUT user_id)
   - Save the html_content

5. MERGE WITH SITE CONTEXTS:
   - Call merge_html_with_site_contexts
   - Pass: base_html, header, footer, head_tags
   - Save the merged_html

6. SAVE:
   - Call save_final_page
   - Pass: merged_html (from step 5)
```

### 关键规则更新

```typescript
IMPORTANT RULES:
- You MUST call get_header, get_footer, and get_head_tags BEFORE starting
- Do NOT provide user_id to assemble_html_page
- You MUST call merge_html_with_site_contexts AFTER assemble_html_page
- Pass html_content from assemble_html_page as base_html
- You MUST call save_final_page AFTER merge_html_with_site_contexts
- The full_content must be the merged_html
```

---

## ✅ 优势对比

### 旧架构的问题

| 问题 | 描述 |
|------|------|
| ❌ 隐式行为 | AI 不知道 header/footer 是否被加载 |
| ❌ 参数依赖 | 忘记传 `user_id` 导致 contexts 丢失 |
| ❌ 难以调试 | 无法判断是获取失败还是融合失败 |
| ❌ 职责混乱 | 一个工具做了太多事情 |
| ❌ 不可见性 | AI 看不到获取到的 header/footer 内容 |

### 新架构的优势

| 优势 | 描述 |
|------|------|
| ✅ 显式调用 | AI 明确调用每个获取工具 |
| ✅ 透明流程 | 每一步的结果都可见 |
| ✅ 易于调试 | 可以精确定位问题环节 |
| ✅ 职责单一 | 每个工具只做一件事 |
| ✅ AI 主导 | AI 控制何时以及如何融合 |
| ✅ 可验证性 | AI 可以检查每个 context 是否存在 |
| ✅ 灵活性 | 可以选择性地应用某些 contexts |

---

## 🔍 示例：AI 执行流程

```javascript
// Step 0: Fetch contexts
const headerResult = await get_header({ user_id: "user123" });
// → { success: true, header: "<nav>...</nav>", message: "Header found" }

const footerResult = await get_footer({ user_id: "user123" });
// → { success: true, footer: "<footer>...</footer>", message: "Footer found" }

const headTagsResult = await get_head_tags({ user_id: "user123" });
// → { success: true, head_tags: "<meta ...>", message: "Custom head tags found" }

// Step 1-3: Draft content and generate images
// ... (省略)

// Step 4: Assemble base HTML
const baseHtmlResult = await assemble_html_page({
  item_id: "item123",
  page_title: "My Page",
  sections: [...],
  images: [...]
});
// → { success: true, html_content: "<!DOCTYPE html>...", message: "Base HTML assembled" }

// Step 5: Merge with contexts
const mergedResult = await merge_html_with_site_contexts({
  base_html: baseHtmlResult.html_content,
  header: headerResult.header,
  footer: footerResult.footer,
  head_tags: headTagsResult.head_tags
});
// → { success: true, merged_html: "<!DOCTYPE html>...", has_header: true, has_footer: true }

// Step 6: Save
await save_final_page({
  item_id: "item123",
  full_content: mergedResult.merged_html  // ← 保存的是完整的、融合后的 HTML
});
```

---

## 🎯 问题解决

### 原问题：Header 和 Footer 没有被保存

**根本原因**：
- AI 调用 `assemble_html_page` 时可能忘记传 `user_id`
- 或者传了但获取失败，AI 无感知
- 或者获取成功但在后续步骤中丢失

**新架构的解决方案**：
1. ✅ AI 必须显式调用 `get_header/get_footer/get_head_tags`
2. ✅ AI 可以看到每个工具的返回结果
3. ✅ AI 必须显式传递这些内容给 `merge_html_with_site_contexts`
4. ✅ 如果任何环节失败，AI 可以明确知道并报告
5. ✅ 融合后的 HTML 明确包含所有 contexts

---

## 📂 文件清单

### 新增文件

- `app/api/skills/tools/content/get-header.tool.ts`
- `app/api/skills/tools/content/get-footer.tool.ts`
- `app/api/skills/tools/content/get-head-tags.tool.ts`
- `app/api/skills/tools/content/merge-html-with-site-contexts.tool.ts`

### 修改文件

- `app/api/skills/skill-content/content-production.skill.ts` - 更新工作流和工具列表
- `app/api/skills/tools/content/internal-assemble-html-page.tool.ts` - 移除自动集成逻辑

### 保留文件（兼容性）

- `app/api/skills/tools/content/get-site-contexts.tool.ts` - 保留用于其他 skills
- `app/api/skills/tools/content/update-pages-with-contexts.tool.ts` - 用于批量更新旧页面

---

## 🚀 测试验证

### 测试步骤

1. **设置 site contexts**：确保用户已设置 header、footer、head tags
2. **生成新页面**：运行 Content Production skill 生成一个新页面
3. **检查工具调用**：验证 AI 调用了所有 6 个步骤的工具
4. **预览页面**：点击 "Preview Generated Page" 查看预览
5. **检查数据库**：确认 `content_items` 表中的 `generated_content` 包含 header/footer
6. **左侧边栏预览**：点击左侧边栏的页面，确认显示相同的内容

### 预期结果

- ✅ 工具调用顺序正确
- ✅ 每个 get_* 工具都返回了正确的内容
- ✅ `merge_html_with_site_contexts` 返回包含所有 contexts 的 HTML
- ✅ 数据库中保存的 HTML 包含 header 和 footer
- ✅ Chat 预览和左侧边栏预览显示完全一致
- ✅ Header、Footer、Head tags 都正确显示

---

## 📌 总结

这次重构实现了：

1. **职责分离**：每个工具只负责一个明确的功能
2. **显式流程**：AI 明确知道每一步在做什么
3. **透明可控**：每个环节的结果都可见和可验证
4. **AI 主导**：由 AI 控制融合逻辑，而不是工具自动处理
5. **易于调试**：可以精确定位问题发生的环节
6. **数据一致性**：确保保存到数据库的 HTML 包含所有 contexts

这是一个更加健壮、透明、易于维护的架构设计。

---

**重构完成日期**: 2025-12-21  
**重构类型**: 架构优化 / 职责分离  
**影响范围**: Content Production Skill

