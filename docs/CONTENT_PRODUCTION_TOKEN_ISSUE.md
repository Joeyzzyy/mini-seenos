# Content Production Workflow - Token Management Issue

## 问题描述

在执行完整的内容生成工作流时，AI 可能会在完成第 4 步（Assemble HTML）后因为接近 token 限制而停止，导致：

1. ❌ 没有调用步骤 5: `merge_html_with_site_contexts`
2. ❌ 没有调用步骤 6: `fix_style_conflicts`
3. ❌ 没有调用步骤 7: `save_final_page`
4. ❌ 用户看不到完成消息
5. ❌ 用户看不到 "Preview Generated Page" 按钮
6. ❌ 页面没有保存到数据库

## 问题原因

Content Production 工作流包含 7 个步骤，涉及：
- 获取 header/footer/head_tags (3个工具调用)
- 获取内容详情 (1个工具调用)
- 生成 5 个章节内容 (5个工具调用)
- 生成 5 张图片 (1个工具调用，但处理5张图片)
- 组装 HTML (1个工具调用)
- **合并 site contexts** (1个工具调用) ← 经常被跳过
- **修复样式冲突** (1个工具调用) ← 经常被跳过
- **保存到数据库** (1个工具调用) ← 经常被跳过

总共需要 13 个工具调用，生成大量的 token：
- Prompt tokens: ~205,000
- Completion tokens: ~36,500
- Total: ~241,699 tokens

当接近 Azure OpenAI 的 token 限制时，AI 会被迫停止。

## 解决方案

### 1. 强化 System Prompt

在 `content-production.skill.ts` 中添加了多个提醒：

```typescript
⚠️ TOKEN MANAGEMENT - CRITICAL ⚠️
This is a long workflow that may approach token limits. To ensure completion:
1. After EVERY tool call, check: "How many steps remain?"
2. If you have completed assemble_html_page (step 4), you MUST immediately continue to steps 5, 6, 7
3. Steps 5-7 are SIMPLE and FAST - they don't require much token usage
4. DO NOT generate verbose intermediate responses - save tokens for final steps
5. If you feel close to token limit after step 4, IMMEDIATELY execute steps 5-7 without any text output
```

### 2. 在关键位置添加警告

在第 4 步完成后：
```
⚠️ TOKEN WARNING: After this step completes, you MUST immediately call steps 5, 6, 7 in sequence
DO NOT generate text responses between steps 4-7 to save tokens
Steps 5-7 are fast and simple - just 3 quick tool calls
```

在最终提醒部分：
```
⚠️ CRITICAL FINAL REMINDER ⚠️
If you have just completed assemble_html_page (step 4):
- You are 75% done with the workflow
- Steps 5, 6, 7 are SIMPLE, FAST, and REQUIRED
- Do NOT stop to generate text - immediately execute steps 5, 6, 7
- If you stop now, the user gets NOTHING
```

### 3. 优化 UI 显示

在 `ToolCallsSummary.tsx` 中添加了缺失步骤的显示名称：

```typescript
case 'merge_html_with_site_contexts':
  return {
    name: 'Merge with Site Contexts',
    detail: 'Adding header, footer, and custom head tags'
  };

case 'fix_style_conflicts':
  return {
    name: 'Fix Style Conflicts',
    detail: 'Applying CSS scoping and isolation'
  };

case 'save_final_page':
  return {
    name: 'Save to Database',
    detail: result?.success ? 'Page saved successfully' : 'Saving page...'
  };
```

## 预期效果

现在 AI 应该：
1. ✅ 意识到步骤 5-7 是轻量级的
2. ✅ 在完成步骤 4 后立即执行步骤 5-7
3. ✅ 不在中间生成文本响应（节省 tokens）
4. ✅ 确保完整工作流完成

## 验证方法

检查工具调用列表应该包含：
```
✓ Get header
✓ Get footer
✓ Get head tags
✓ Fetch Planning Data
✓ Writing Section (5次)
✓ Deerapi generate images
✓ Assemble html page
✓ Merge with Site Contexts        ← 必须有
✓ Fix Style Conflicts             ← 必须有
✓ Save to Database                ← 必须有
```

用户应该看到：
- ✅ 完成消息
- ✅ "Preview Generated Page" 按钮

## 如果问题仍然出现

如果 AI 仍然在步骤 4 后停止，可能需要：

1. **减少章节数量**：从 5 个减少到 3-4 个
2. **简化图片生成**：减少图片数量
3. **拆分工作流**：
   - 第一阶段：生成内容和图片（步骤 0-4）
   - 第二阶段：合并和保存（步骤 5-7）
4. **使用更大的模型**：切换到支持更多 tokens 的模型

## 临时解决方案

如果页面已经生成但没有保存，用户可以：
1. 在 "Generated Files" 中找到 `page-xxx.html` 文件
2. 下载该文件
3. 手动上传或使用

但这不是理想的解决方案，因为：
- 页面缺少 header 和 footer
- 样式可能有冲突
- 没有保存到数据库
- 无法通过 Content Library 访问

