# GPT-4o-mini 重复调用问题及解决方案

## 🔍 问题描述

切换到 `gpt-4o-mini-for-seo-geo-check` 模型后，Content Production 工作流出现**重复调用**问题：

### 观察到的行为

```
Used 16 Tools:
├─ Create Execution Plan
├─ Get header/footer/head_tags (3×)
├─ Fetch Planning Data
├─ Writing Section × 5        ← 第一轮
├─ Deerapi generate images
└─ Writing Section × 5        ← 重复！第二轮
```

**结果：**
- 每个章节被写了两次
- 图片生成在两轮写作之间
- 总工具调用从 13 个增加到 16 个
- 浪费时间和 tokens

## 🤔 原因分析

### GPT-4o-mini vs GPT-4 的差异

| 特性 | GPT-4 | GPT-4o-mini |
|------|-------|-------------|
| **上下文记忆** | 强 | 较弱 |
| **任务追踪** | 准确 | 容易"忘记" |
| **复杂工作流** | 可靠 | 需要更强提示 |
| **Token 成本** | 高 | 低 |

### 具体问题

在 Content Production 的 7 步工作流中：

```
Step 1: Fetch data ✓
Step 2: Draft 5 sections ✓
Step 3: Generate images ✓
         ↓
    此时 gpt-4o-mini "忘记"了已经写过章节
         ↓
Step 2: Draft 5 sections (再次！) ✗
Step 4: Assemble HTML (使用第二轮的内容) ✓
...
```

**为什么会忘记：**
1. 长上下文累积（~200K tokens）
2. 图片生成插入在中间，打断了流程
3. 模型容量较小，难以追踪复杂状态

## ✅ 解决方案

### 1. 添加反重复检查

在每个可能重复的步骤前添加检查：

#### Step 2: Writing Sections
```
⚠️ CRITICAL: Check if you have ALREADY called draft_page_section for this section
DO NOT call draft_page_section twice for the same section title
If you see a section title in your previous tool calls, SKIP it
```

#### Step 3: Image Generation
```
⚠️ ANTI-REPEAT CHECK: Before generating images, verify you have NOT already called deerapi_generate_images
If you see deerapi_generate_images in your tool call history, DO NOT call it again
```

#### Step 4: Assemble HTML
```
⚠️ ANTI-REPEAT CHECK: Before assembling, verify you have NOT already called assemble_html_page
If you see assemble_html_page in your tool call history, DO NOT call it again
Instead, proceed directly to step 5
```

### 2. 增强工作流完成验证

```
⚠️ ANTI-DUPLICATION CHECK:
- Count how many times you called draft_page_section - it should equal the number of sections
- If you called draft_page_section MORE than the number of sections, you have DUPLICATED work
- Count how many times you called deerapi_generate_images - it should be 1
- Count how many times you called assemble_html_page - it should be 1
- DO NOT proceed if you detect duplications - skip to the next unique step
```

### 3. 明确的完成标准

```
[ ] Step 2: Called draft_page_section for EVERY section EXACTLY ONCE (no duplicates)?
[ ] Step 3: Called deerapi_generate_images EXACTLY ONCE for ALL sections?
[ ] Step 4: Called assemble_html_page EXACTLY ONCE with all sections?
```

## 📊 预期效果

### 之前（有重复）
- ✗ Writing Section × 5
- ✓ Generate images
- ✗ Writing Section × 5（重复）
- ✓ Assemble HTML
- **总计：16 工具调用**

### 之后（无重复）
- ✓ Writing Section × 5
- ✓ Generate images
- ✓ Assemble HTML
- ✓ Merge contexts
- ✓ Fix conflicts
- ✓ Save page
- **总计：13 工具调用**

## 🎯 其他建议

### 如果问题仍然存在

1. **考虑切换回 GPT-4**
   ```bash
   AZURE_OPENAI_DEPLOYMENT=gpt-4.1
   ```
   - 更可靠
   - 更好的上下文管理
   - 成本稍高但质量更好

2. **减少章节数量**
   - 从 5 个减少到 3-4 个
   - 减少工作流复杂度

3. **拆分工作流**
   - 第一阶段：生成内容（步骤 0-4）
   - 第二阶段：合并和保存（步骤 5-7）

### 性能对比

| 模型 | 可靠性 | 成本 | 速度 | 推荐场景 |
|------|--------|------|------|----------|
| **GPT-4** | ⭐⭐⭐⭐⭐ | 💰💰💰 | 🐢🐢 | 生产环境 |
| **GPT-4o** | ⭐⭐⭐⭐⭐ | 💰💰 | 🐇🐇🐇 | 平衡选择 |
| **GPT-4o-mini** | ⭐⭐⭐ | 💰 | 🐇🐇🐇🐇 | 简单任务/测试 |

## 🔧 验证方法

运行工作流后，检查日志：

```bash
# 应该只看到：
Writing Section × 5         # 第一轮，OK
Deerapi generate images     # OK
Assemble html page          # OK，不应该有第二轮 Writing Section

# 不应该看到：
Writing Section × 5         # 第二轮，重复！
```

## 💡 最佳实践

1. **使用合适的模型**
   - 简单任务 → mini
   - 复杂工作流 → 标准版或更好

2. **监控工具调用**
   - 留意重复模式
   - 检查 token 使用

3. **优化 prompt**
   - 添加防重复检查
   - 明确完成标准
   - 提供清晰的状态追踪

## 🎓 总结

GPT-4o-mini 是一个很好的经济型选择，但对于 Content Production 这样的**复杂、多步骤工作流**：

- ✅ 需要额外的防护措施（已添加）
- ✅ 更强的状态追踪提示（已添加）
- ⚠️ 如果仍有问题，建议使用更强大的模型

试试看更新后的效果！如果问题解决了，就可以继续使用 mini 版本节省成本。如果问题持续，建议切换回 GPT-4 或 GPT-4o。

