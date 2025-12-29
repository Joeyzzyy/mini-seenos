# 修复预览数据源问题

## 问题描述

**用户报告**：通过左侧边栏点击生成好的页面进行预览，和点击 chat 里的 "Preview Generated Page" 进行预览，获取的数据不是同源的。

### 根本原因

Chat 预览使用的是**临时内存中的 HTML**，而左侧边栏预览使用的是**数据库中保存的真实数据**。

#### 之前的错误流程：

```
生成HTML → save_final_page工具 → 保存到DB
                     ↓
                返回临时HTML（内存中）
                     ↓
            Chat预览使用这个临时HTML ❌
```

#### 问题：

1. ❌ **Chat预览显示的**：工具返回的临时HTML（可能不完整、可能有错误）
2. ✅ **左侧边栏显示的**：数据库中实际保存的HTML（真实的业务数据）

### 潜在风险：

- **保存过程中数据可能被修改**：数据库触发器、RLS策略可能修改数据
- **编码问题**：保存到数据库时的编码转换
- **数据截断**：如果HTML超过字段长度限制
- **并发问题**：其他进程可能同时修改这条记录
- **用户看到的不是实际保存的数据**

## 解决方案

### ✅ 修改预览逻辑，从数据库读取真实数据

**核心原则**：数据库中的数据才是"Source of Truth"（唯一真实数据源）

### 修改的文件

#### 1. `components/ToolCallsSummary.tsx`

**修改前**：
```typescript
interface ToolCallsSummaryProps {
  onPreviewHtml?: (htmlContent: string, title: string) => void;
}

// 查找HTML文件内容
const latestHtmlFile = fileResults
  .map(inv => inv.result)
  .filter(result => result?.filename?.endsWith('.html') && result?.html_content)
  .pop();

// 使用临时HTML内容
onPreviewHtml(latestHtmlFile.html_content, latestHtmlFile.filename)
```

**修改后**：
```typescript
interface ToolCallsSummaryProps {
  onPreviewContentItem?: (itemId: string) => void;
}

// 查找save_final_page工具的结果
const latestSavedPage = toolInvocations
  .filter(inv => inv.toolName === 'save_final_page' && inv.result?.item_id)
  .pop();

// 传递item_id，让父组件从数据库读取
onPreviewContentItem(latestSavedPage.result.item_id)
```

#### 2. `components/MessageList.tsx`

**修改前**：
```typescript
interface MessageListProps {
  onPreviewHtml?: (htmlContent: string, title: string) => void;
}

<ToolCallsSummary
  onPreviewHtml={onPreviewHtml}
/>
```

**修改后**：
```typescript
interface MessageListProps {
  onPreviewContentItem?: (itemId: string) => void;
}

<ToolCallsSummary
  onPreviewContentItem={onPreviewContentItem}
/>
```

#### 3. `app/page.tsx`

**修改前**：
```typescript
onPreviewHtml={(htmlContent, title) => {
  // ❌ 使用临时HTML
  setSelectedContentItem({
    id: 'temp-preview',
    generated_content: htmlContent, // 内存中的临时数据
  });
}}
```

**修改后**：
```typescript
onPreviewContentItem={async (itemId: string) => {
  // ✅ 从数据库读取真实数据
  try {
    const item = await getContentItemById(itemId);
    if (item) {
      setSelectedContentItem(item); // 使用数据库的真实数据
      // 刷新左侧边栏的内容列表
      if (user) {
        await loadContentItems(user.id);
      }
    }
  } catch (error) {
    console.error('Failed to load content item for preview:', error);
  }
}}
```

**导入必要的函数**：
```typescript
import { 
  getContentItemById, // ← 新增导入
  getUserContentItems,
  // ... 其他导入
} from '@/lib/supabase';
```

## 修复效果

### ✅ 修复后的正确流程：

```
生成HTML → save_final_page工具 → 保存到DB
                     ↓
                返回item_id
                     ↓
            Chat预览使用item_id → 从DB读取 ✅
```

### ✅ 现在的行为：

1. ✅ **Chat预览显示的**：从数据库读取的真实保存数据
2. ✅ **左侧边栏显示的**：从数据库读取的真实保存数据
3. ✅ **两者完全同源**：都从 `content_items` 表的 `generated_content` 字段读取
4. ✅ **预览即所得**：用户看到的就是实际保存的数据

### 额外好处：

- ✅ 自动刷新左侧边栏的内容列表，显示最新状态
- ✅ 确保预览的数据经过了数据库的所有验证和处理
- ✅ 避免了临时数据可能存在的不一致问题

## 测试验证

### 测试步骤：

1. 在Chat中生成一个新页面（使用Content Production skill）
2. 等待生成完成后，点击 "Preview Generated Page"
3. 同时从左侧边栏点击该页面进行预览
4. 对比两种预览方式显示的内容

### 预期结果：

- ✅ 两种预览方式显示的内容**完全一致**
- ✅ Header、Footer、样式、内容等所有元素都相同
- ✅ 左侧边栏的状态自动更新为 "generated"

## 技术细节

### 数据流向：

```
AI生成内容
  ↓
assemble_html_page (组装完整HTML)
  ↓
save_final_page (保存到数据库)
  ↓
返回 {success: true, item_id: "xxx"}
  ↓
ToolCallsSummary 提取 item_id
  ↓
onPreviewContentItem(item_id)
  ↓
getContentItemById(item_id) 从数据库读取
  ↓
setSelectedContentItem(dbItem)
  ↓
ContentDrawer 显示预览
```

### 关键代码位置：

| 文件 | 作用 | 关键逻辑 |
|------|------|----------|
| `app/api/skills/tools/content/supabase-content-save-final-page.tool.ts` | 保存页面到数据库 | 返回 `item_id` |
| `components/ToolCallsSummary.tsx` | 提取保存结果 | 查找 `save_final_page` 的 `item_id` |
| `app/page.tsx` | 从数据库加载 | 调用 `getContentItemById` |
| `lib/supabase.ts` | 数据库查询 | 实现 `getContentItemById` |

## 相关文档

- [HTML_PREVIEW_SANDBOX_FIX.md](./HTML_PREVIEW_SANDBOX_FIX.md) - 关于iframe sandbox权限的修复
- Content Production Skill - 内容生成工作流

---

**修复时间**: 2025-12-21  
**修复类型**: 数据一致性 / 业务逻辑  
**影响范围**: Chat预览功能

