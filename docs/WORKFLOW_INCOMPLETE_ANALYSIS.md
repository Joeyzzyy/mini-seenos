# 页面生成进度：已执行8/10步骤

## 📊 当前状态

### ✅ 已完成的步骤 (8/10)

从工具调用记录来看，AI 执行了：

1. ✅ **Create Execution Plan** - 创建执行计划
2. ✅ **Get header** - 获取站点 header
3. ✅ **Get footer** - 获取站点 footer  
4. ✅ **Get head tags** - 获取自定义 head 标签
5. ✅ **Fetch Planning Data** - 加载 content item 详情
6. ✅ **Writing Section × 5** - 生成所有 5 个 sections
7. ✅ **Deerapi generate images** - 生成图片
8. ✅ **Assemble html page** - 组装基础 HTML

### ❌ **缺少的关键步骤 (2/10)**

9. ❌ **merge_html_with_site_contexts** - 合并 header/footer/head_tags 到 HTML
10. ❌ **save_final_page** - 保存完整页面到数据库

---

## 🚨 当前问题

### 问题 1：HTML 不完整

`page-xxx.html` 文件是 `assemble_html_page` 的输出，但：
- ❌ **没有 header** - 缺少导航栏
- ❌ **没有 footer** - 缺少页脚
- ❌ **没有自定义 head tags** - 缺少用户设置的 meta 标签、样式、脚本

这个 HTML 只包含：
- ✅ 页面内容（sections）
- ✅ 内容图片
- ✅ 基础 CSS 样式
- ✅ SEO meta 标签（title、description）

### 问题 2：未保存到数据库

- ❌ `content_items` 表的 `generated_content` 字段未更新
- ❌ `status` 仍然是 'ready' 而不是 'generated'
- ❌ 无法从左侧边栏的 Content Library 中预览

---

## 🔧 为什么 AI 停止了？

可能的原因：

### 1. **误认为任务完成**
AI 看到生成了 HTML 文件（`page-xxx.html`），可能认为任务已完成，没有意识到还需要两个步骤。

### 2. **工具调用限制**
达到了某个限制（token、时间、工具调用次数），导致流程中断。

### 3. **Prompt 强调不够**
虽然 prompt 中有说明步骤 5 和 6，但可能不够突出，AI 认为它们是"可选"的。

---

## ✅ 已实施的优化

为了防止这个问题再次发生，我已经加强了 prompt：

### 优化 1：在步骤描述中添加警告

```typescript
4. ASSEMBLE BASE HTML: ...
   - ⚠️ CRITICAL: This HTML does NOT include header/footer yet! Must proceed to step 5!

5. MERGE WITH SITE CONTEXTS (MANDATORY - DO NOT SKIP): ...
   - ⚠️ The HTML from step 4 is INCOMPLETE - it lacks header/footer/custom head tags
   - You MUST call merge_html_with_site_contexts to complete the page
   - ⚠️ CRITICAL: Do NOT proceed to save without merging! The page will be incomplete!

6. SAVE (MANDATORY - FINAL STEP): ...
   - ⚠️ CRITICAL: You MUST use merged_html from step 5, NOT html_content from step 4
   - This is the FINAL step - do not stop until this is complete!
```

### 优化 2：添加检查点提醒

```typescript
CRITICAL CHECKPOINTS:
- After step 4 (assemble_html_page): Ask yourself "Did I merge with site contexts?" If NO, continue to step 5
- After step 5 (merge_html_with_site_contexts): Ask yourself "Did I save to database?" If NO, continue to step 6
- After step 6 (save_final_page): Workflow complete!
```

### 优化 3：强化强制规则

```typescript
IMPORTANT RULES - COMPLETE WORKFLOW EXECUTION:
❗ DO NOT stop after assemble_html_page - the HTML is INCOMPLETE without merge!
❗ You MUST call merge_html_with_site_contexts - header/footer must be added!
❗ You MUST call save_final_page - the page must be saved to database!
❗ The workflow is NOT complete until save_final_page returns success!
```

### 优化 4：加强执行提醒

```typescript
ENFORCEMENT:
- After assemble_html_page, IMMEDIATELY check: "Did I call merge_html_with_site_contexts?" If NO, call it now!
- After merge_html_with_site_contexts, IMMEDIATELY check: "Did I call save_final_page?" If NO, call it now!
- The workflow is INCOMPLETE if you stop at assemble_html_page - you MUST continue to merge and save!
```

---

## 🎯 下次如何避免

### 用户指令优化

更明确地强调"完整流程"：

```
"生成完整页面并保存到数据库"
"Execute the full 6-step workflow and save to database"
"Complete all steps including merge and save"
```

### 监控和提醒

如果 AI 在 step 4 后停止，应该：
1. 检查工具调用记录
2. 提醒用户："页面已组装但尚未合并 header/footer 和保存"
3. 询问用户是否继续执行剩余步骤

---

## 📋 完整的 6 步工作流

为了避免混淆，这里再次明确完整流程：

```
Step 0: Fetch Site Contexts
  ├─ get_header (user_id)
  ├─ get_footer (user_id)
  └─ get_head_tags (user_id)
  
Step 1: Fetch Data
  └─ get_content_item_detail (item_id)
  
Step 2: Draft Content
  ├─ draft_page_section (section 1)
  ├─ draft_page_section (section 2)
  └─ ... (all sections)
  
Step 3: Generate Images
  └─ deerapi_generate_images (all image placeholders)
  
Step 4: Assemble Base HTML ⚠️ INCOMPLETE WITHOUT NEXT STEPS
  └─ assemble_html_page (sections, images)
      ↓ Returns: base HTML (no header/footer)
  
Step 5: Merge Contexts ⚠️ MANDATORY
  └─ merge_html_with_site_contexts (base_html, header, footer, head_tags)
      ↓ Returns: complete HTML (with header/footer)
  
Step 6: Save to Database ⚠️ MANDATORY
  └─ save_final_page (item_id, merged_html)
      ↓ Returns: success + file info
      ✅ WORKFLOW COMPLETE
```

---

## 🔍 如何验证完整性

### 检查工具调用记录

完整的执行应该包含：
```
✓ get_header
✓ get_footer
✓ get_head_tags
✓ get_content_item_detail
✓ draft_page_section (多次)
✓ deerapi_generate_images
✓ assemble_html_page
✓ merge_html_with_site_contexts  ← 确保有这个！
✓ save_final_page                ← 确保有这个！
```

### 检查数据库

查询 `content_items` 表：
```sql
SELECT 
  id, 
  title, 
  status, 
  LENGTH(generated_content) as content_length,
  generated_content LIKE '%<header%' as has_header,
  generated_content LIKE '%<footer%' as has_footer
FROM content_items
WHERE id = 'xxx';
```

期望结果：
- `status` = 'generated' ✅
- `content_length` > 0 ✅
- `has_header` = true ✅
- `has_footer` = true ✅

---

## 💡 临时解决方案

如果遇到这个问题，用户可以：

### 方案 1：要求 AI 继续

```
"请继续执行剩余步骤：
1. 调用 merge_html_with_site_contexts 合并 header 和 footer
2. 调用 save_final_page 保存到数据库"
```

### 方案 2：使用修复工具

系统有一个修复工具 `update_pages_with_contexts`，可以批量为已生成但缺少 header/footer 的页面添加：

```
"使用 update_pages_with_contexts 工具为这个页面添加 header 和 footer"
```

---

## 总结

**当前状态**：AI 执行了 80% 的工作流程（8/10 步骤）

**缺少的步骤**：
- ❌ 合并 header/footer（`merge_html_with_site_contexts`）
- ❌ 保存到数据库（`save_final_page`）

**已实施的优化**：加强了 prompt 中的警告和强制提醒

**下次预期**：AI 应该能执行完整的 6 步工作流程

---

**更新时间**: 2025-12-21  
**问题类型**: Workflow 中断  
**影响**: 页面生成不完整

