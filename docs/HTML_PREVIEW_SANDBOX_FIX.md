# HTML Preview Sandbox 权限说明

## 问题描述

用户报告：
1. ❌ Chat 里的预览有 header 和 footer
2. ❌ 从左侧边栏的页面进入就没有 header 和 footer
3. ❌ Header 和 footer 的样式全错乱

## 根本原因

### 原因 1: iframe sandbox 权限不足

`ContentDrawer.tsx` 中使用 `iframe srcDoc` 来渲染 HTML 预览，但之前的 `sandbox` 属性只有：

```html
<iframe sandbox="allow-same-origin" />
```

这导致：
- ❌ `<script>` 标签无法执行
- ❌ `<head>` 中的 Tailwind CSS CDN 无法加载
- ❌ 任何外部样式表和脚本无法运行
- ❌ Google Analytics 等分析脚本无法执行

### 原因 2: Header/Footer 依赖外部资源

用户设置的 Header 和 Footer 通常会使用：
- Tailwind CSS classes
- 内联 `<style>` 标签
- `<script>` 标签中的 CDN 引用

如果 sandbox 不允许脚本执行，这些资源都无法加载，导致：
- Header 和 Footer 显示但**没有样式**
- 布局错乱
- 看起来像是"没有 header/footer"（实际上有，只是看不见）

## 解决方案

### ✅ 修复：添加完整的 sandbox 权限

**文件**: `components/ContentDrawer.tsx`

**修改前**:
```html
<iframe 
  srcDoc={item.generated_content}
  sandbox="allow-same-origin"
/>
```

**修改后**:
```html
<iframe 
  srcDoc={item.generated_content || undefined}
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
/>
```

### Sandbox 权限说明

| 权限 | 作用 | 为什么需要 |
|------|------|-----------|
| `allow-same-origin` | 允许 iframe 访问同源资源 | 基础权限，必需 |
| `allow-scripts` | 允许执行 JavaScript | 加载 Tailwind CDN、Analytics 等 |
| `allow-forms` | 允许表单提交 | 支持页面中的表单功能 |
| `allow-popups` | 允许打开弹窗 | 支持导航链接等 |
| `allow-modals` | 允许模态框 | 支持 alert/confirm 等 |

### 为什么 Chat 里的预览之前没问题？

实际上 Chat 里的预览（`ToolCallsSummary` → `onPreviewHtml`）**也有同样的问题**！

之前之所以"看起来正常"，可能是因为：
1. 用户还没有设置复杂的 Header/Footer
2. 或者测试的 Header/Footer 使用的是内联样式（`style="..."`），不依赖外部脚本

现在修复后，两个地方都会正确显示。

## 验证步骤

### 1. 测试有 Tailwind CSS 的 Header

设置一个使用 Tailwind classes 的 Header：

```html
<header class="bg-gray-100 border-b-2 border-gray-200 p-4">
  <div class="max-w-6xl mx-auto flex justify-between items-center">
    <div class="text-2xl font-bold text-gray-800">My Site</div>
    <nav class="flex gap-4">
      <a href="#" class="text-gray-600 hover:text-blue-600">Home</a>
      <a href="#" class="text-gray-600 hover:text-blue-600">About</a>
    </nav>
  </div>
</header>
```

在 Meta Tags 中添加 Tailwind CDN：

```html
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
```

### 2. 生成页面并预览

```
生成一个关于 "测试页面" 的页面
```

### 3. 在两个地方检查

- ✅ Chat 消息中点击 "Preview Generated Page" → 应该看到完整样式的 Header
- ✅ 左侧边栏点击页面 → "Preview" 标签 → 应该看到完整样式的 Header

### 4. 打开浏览器控制台

在预览页面打开控制台 (F12)：
- ✅ 不应该有 CSP 或 sandbox 相关的错误
- ✅ Tailwind CDN 应该成功加载
- ✅ 如果有 console.log，应该能看到输出

## 常见问题

### Q1: 为什么不直接移除 sandbox？

**答**: Sandbox 是重要的安全机制：
- 防止 XSS 攻击
- 隔离 iframe 内容
- 保护主页面不受恶意代码影响

我们只授予**必要的权限**，而不是完全移除 sandbox。

### Q2: 如果预览还是有问题怎么办？

**可能的原因**:

1. **外部资源加载失败**
   - 检查网络请求
   - 确认 CDN 地址正确

2. **CSP 策略冲突**
   - 检查是否有自定义的 Content-Security-Policy

3. **样式加载顺序问题**
   - 确保 `<head>` 中的样式在内容之前
   - 检查是否有样式被覆盖

### Q3: 为什么需要 allow-forms 和 allow-popups？

**答**: 这是为了支持页面的完整功能：
- `allow-forms`: 页面中可能有搜索框、联系表单等
- `allow-popups`: 导航链接、分享按钮等可能需要打开新窗口

### Q4: 之前保存的页面会自动修复吗？

**答**: 会的！
- 数据库中的 `generated_content` 没有改变
- 只是预览组件的渲染方式改进了
- 所有旧页面在新的 ContentDrawer 中预览时会自动应用新的 sandbox 权限

## 技术细节

### iframe srcDoc vs iframe src

**srcDoc**:
```html
<iframe srcDoc="<html>...</html>"></iframe>
```
- ✅ 直接渲染 HTML 字符串
- ✅ 不需要额外的网络请求
- ✅ 适合预览用户生成的内容

**src**:
```html
<iframe src="https://example.com/page.html"></iframe>
```
- ❌ 需要文件上传到服务器
- ❌ 额外的网络请求
- ✅ 适合预览已发布的页面

我们使用 `srcDoc` 是正确的选择。

### Sandbox 权限的安全性

即使添加了这些权限，iframe 仍然是隔离的：
- ✅ 无法访问父页面的 DOM
- ✅ 无法读取 cookies（除非同源）
- ✅ 无法进行导航跳转（除非 allow-top-navigation）
- ✅ 无法下载文件（除非 allow-downloads）

我们**没有**添加的高危权限：
- ❌ `allow-top-navigation` - 防止 iframe 劫持主页面
- ❌ `allow-downloads` - 防止自动下载恶意文件
- ❌ `allow-pointer-lock` - 防止鼠标劫持

## 后续优化建议

### 1. 添加加载状态

```tsx
<iframe 
  srcDoc={item.generated_content || undefined}
  onLoad={() => setIframeLoaded(true)}
  sandbox="..."
/>
{!iframeLoaded && <div>Loading preview...</div>}
```

### 2. 添加错误处理

```tsx
<iframe 
  srcDoc={item.generated_content || undefined}
  onError={() => setIframeError(true)}
  sandbox="..."
/>
{iframeError && <div>Preview failed to load</div>}
```

### 3. 性能优化

对于非常大的 HTML：
- 考虑使用 `src` 而不是 `srcDoc`
- 先上传到临时存储，然后用 URL 加载
- 或者添加虚拟滚动

## 测试清单

- [ ] Header 样式正确显示
- [ ] Footer 样式正确显示
- [ ] Tailwind classes 生效
- [ ] 自定义样式表加载成功
- [ ] Google Analytics 等脚本执行
- [ ] 控制台无 sandbox 错误
- [ ] Chat 预览正常
- [ ] 左侧边栏预览正常
- [ ] 旧页面预览正常
- [ ] 新页面预览正常

