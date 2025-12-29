# 如何让已生成的页面包含 Header/Footer

## 问题说明

**问题**: 在添加 Site Contexts 功能之前生成的页面，不会自动包含 header、footer 和自定义 head 标签。

**原因**: 
- 页面生成时，HTML 内容被保存到数据库的 `generated_content` 字段
- 这是一个**静态的字符串**，不会自动更新
- 旧页面生成时还没有 site contexts 功能，所以没有包含 header/footer

## 解决方案

### 方案 1: 单独重新生成页面（推荐）

最简单的方式是让 AI 重新生成某个页面：

**命令示例**:
```
请帮我重新生成 "AI 工具推荐" 这个页面
```

**AI 会执行**:
1. ✅ 查找并读取原有页面的 outline 和内容
2. ✅ 重新撰写各个章节
3. ✅ 调用 `assemble_html_page` 时传入 `user_id`
4. ✅ 自动包含最新的 header、footer、head 标签
5. ✅ 更新数据库中的 `generated_content`

**优点**:
- ✅ 内容会重新生成，可能更新更好
- ✅ 图片会重新生成
- ✅ 确保使用最新的模板和样式

**缺点**:
- ❌ 需要消耗 AI tokens 和图片生成配额
- ❌ 一次只能处理一个页面
- ❌ 如果有很多页面，比较麻烦

---

### 方案 2: 批量更新旧页面（新工具）

我刚刚创建了一个新工具 `update_pages_with_contexts`，可以批量为旧页面添加 header/footer。

#### 使用方法

**1. 更新所有旧页面**

```
请帮我把所有已生成的页面都加上我的 header 和 footer
```

AI 会调用:
```typescript
update_pages_with_contexts({
  user_id: "your-user-id"
  // 不提供 item_ids，会更新所有页面
})
```

**2. 更新特定页面**

```
请帮我把这几个页面加上 header 和 footer：
1. AI 工具推荐
2. SEO 优化指南
3. 内容营销策略
```

AI 会:
1. 查找这些页面的 ID
2. 调用工具更新这些特定页面

**3. 强制更新（包括已有 header/footer 的页面）**

```
强制更新所有页面，使用最新的 header 和 footer
```

AI 会调用:
```typescript
update_pages_with_contexts({
  user_id: "your-user-id",
  force: true  // 即使已有也更新
})
```

#### 工具功能说明

**智能检测**:
- ✅ 自动检测页面是否已有 header/footer
- ✅ 跳过已经有的页面（避免重复）
- ✅ 可以用 `force: true` 强制更新

**内容合并**:
- ✅ 智能合并 head 标签（不会重复 title 和 description）
- ✅ 保留原有页面的 SEO meta 标签
- ✅ 添加用户的自定义样式和脚本

**批量处理**:
- ✅ 一次可以更新多个页面
- ✅ 提供详细的处理报告
- ✅ 显示成功、跳过、失败的页面数量

#### 返回结果示例

```json
{
  "success": true,
  "total": 10,
  "updated": 7,
  "skipped": 2,
  "failed": 1,
  "message": "Updated 7 page(s), skipped 2, failed 1.",
  "details": [
    {
      "id": "page-1",
      "title": "AI 工具推荐",
      "status": "updated"
    },
    {
      "id": "page-2",
      "title": "SEO 指南",
      "status": "skipped",
      "reason": "Already has header/footer"
    },
    // ...
  ]
}
```

---

### 方案 3: 手动编辑 HTML（不推荐）

如果你只想更新一两个页面，可以：

1. 从左侧边栏点击页面
2. 切换到 "Code" 标签
3. 复制 HTML 代码
4. 手动添加你的 header 和 footer
5. ... 但这很麻烦，不建议

---

## 推荐使用策略

### 如果你的页面不多（< 5 个）

**使用方案 1: 逐个重新生成**
- 让 AI 重新生成每个页面
- 内容会更新，质量可能更好

### 如果你的页面很多（≥ 5 个）

**使用方案 2: 批量更新**
1. 先测试：更新 1-2 个页面，检查效果
2. 满意后：批量更新所有页面
3. 检查：逐个预览确认效果

### 如果你刚设置完 Site Contexts

**未来的页面会自动包含**
- ✅ 新生成的页面会自动包含 header/footer
- ❌ 旧页面需要手动更新（用上面的方案）

---

## 使用示例

### 示例 1: 批量更新所有旧页面

**对话**:
```
User: 我刚设置好了 header 和 footer，能帮我把之前生成的所有页面都加上吗？

AI: 好的，我来帮你批量更新所有已生成的页面。
[调用 update_pages_with_contexts]

AI: 更新完成！共处理 10 个页面：
- ✅ 成功更新: 8 个
- ⏭️ 跳过: 2 个（已经有 header/footer）
- ❌ 失败: 0 个

已更新的页面：
1. AI 工具推荐
2. SEO 优化指南
3. 内容营销策略
...

你可以在左侧边栏查看效果！
```

### 示例 2: 更新特定页面

**对话**:
```
User: 请帮我把 "AI 工具推荐" 和 "SEO 指南" 这两个页面加上 header 和 footer

AI: 好的，我来更新这两个页面。
[查找页面 ID]
[调用 update_pages_with_contexts with item_ids]

AI: 更新完成！
- ✅ "AI 工具推荐" - 成功更新
- ✅ "SEO 指南" - 成功更新

现在这两个页面都包含了你的 header 和 footer！
```

### 示例 3: 强制更新（使用最新 header）

**对话**:
```
User: 我修改了 header 样式，想让所有页面都用新的 header

AI: 明白了，我会强制更新所有页面使用最新的 header。
[调用 update_pages_with_contexts with force: true]

AI: 强制更新完成！所有 12 个页面都已更新为最新的 header 和 footer。
```

---

## 注意事项

### ⚠️ 更新是不可逆的

- 更新后，旧的 HTML 会被覆盖
- 建议先测试 1-2 个页面
- 如果不满意，可以重新生成页面

### ✅ 智能跳过机制

- 工具会自动检测页面是否已有 header/footer
- 已经有的页面会被跳过（除非使用 `force: true`）
- 避免重复添加造成混乱

### 🔄 Head 标签合并

- 工具会智能合并 head 标签
- 不会重复添加 title 和 description
- 保留原有的 SEO meta 标签
- 添加你的自定义样式和脚本

### 📊 处理报告

- 每次更新都会返回详细报告
- 显示成功、跳过、失败的页面
- 如果有失败，会显示具体原因

---

## 故障排除

### Q: 更新后页面样式还是错乱？

**A**: 检查以下几点：
1. 确认 Head 标签中包含 Tailwind CDN 或其他样式表
2. 检查浏览器控制台是否有脚本错误
3. 清除浏览器缓存后重新预览
4. 确认 iframe sandbox 权限已修复（`allow-scripts`）

### Q: 工具说"No site contexts found"？

**A**: 你需要先设置 Site Contexts：
1. 左侧边栏点击 "On Site Context"
2. 设置 Logo、Header、Footer、Meta Tags
3. 保存后再运行更新工具

### Q: 某些页面更新失败？

**A**: 可能的原因：
1. 页面的 HTML 格式不正确
2. 数据库权限问题
3. 页面已被删除

查看失败原因在返回的 `details` 中。

### Q: 更新后发现不满意，怎么办？

**A**: 两种方式：
1. **方案 A**: 让 AI 重新生成该页面（完全重做）
2. **方案 B**: 修改你的 header/footer，然后用 `force: true` 再次更新

---

## 最佳实践

1. **设置 Site Contexts 后立即测试**
   - 生成一个新页面测试效果
   - 确认 header/footer 显示正确

2. **小范围测试批量更新**
   - 先更新 1-2 个页面
   - 检查效果满意后再批量处理

3. **定期检查页面效果**
   - 每次修改 header/footer 后
   - 在几个页面上测试效果
   - 必要时重新批量更新

4. **保持 header/footer 简洁**
   - 复杂的样式可能导致渲染问题
   - 尽量使用内联样式或 Tailwind classes
   - 避免依赖太多外部资源

---

## 总结

| 场景 | 推荐方案 | 命令示例 |
|------|---------|----------|
| 单个页面需要更新 | 方案 1: 重新生成 | "重新生成 [页面名]" |
| 多个旧页面需要更新 | 方案 2: 批量更新工具 | "把所有页面加上 header 和 footer" |
| 修改了 header 样式 | 方案 2: 强制更新 | "强制更新所有页面使用新 header" |
| 新生成的页面 | 无需操作 | 自动包含 ✅ |

现在你可以轻松管理所有页面的 header 和 footer 了！🎉

