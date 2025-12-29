# Site Contexts 功能验证指南

## 验证清单

### ✅ 步骤 1: 数据库准备

1. **打开 Supabase Dashboard**
   - 访问: https://supabase.com/dashboard
   - 选择你的项目

2. **检查 site_contexts 表**
   ```
   Table Editor → 查找 "site_contexts" 表
   ```
   
   应该包含以下列：
   - `id` (uuid, PRIMARY KEY)
   - `user_id` (uuid, NOT NULL)
   - `type` (text, NOT NULL)
   - `content` (text)
   - `file_url` (text)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)
   - UNIQUE 约束: `(user_id, type)`

3. **如果表不存在，运行 SQL 迁移**
   ```sql
   -- 在 Supabase SQL Editor 中执行
   -- 复制 supabase-migrations/fix-site-contexts-table.sql 的内容
   ```

4. **检查 RLS 策略**
   ```
   Table Editor → site_contexts → RLS Policies
   ```
   
   应该有 4 个策略：
   - `Users can view own contexts` (SELECT)
   - `Users can insert own contexts` (INSERT)
   - `Users can update own contexts` (UPDATE)
   - `Users can delete own contexts` (DELETE)

5. **检查 logos 存储桶**
   ```
   Storage → 查找 "logos" bucket
   ```
   
   如果不存在，参考 `docs/SETUP_LOGOS_BUCKET.md` 创建

---

### ✅ 步骤 2: UI 测试 - 设置 Site Contexts

1. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

2. **登录应用**
   - 打开 http://localhost:3000
   - 使用 Google 登录

3. **打开 Site Context 编辑**
   - 查看左侧边栏
   - 找到 "On Site Context" 部分
   - 点击各个项目进行设置

4. **测试 Logo 上传**
   - ✅ 点击 "Logo"
   - ✅ 上传一个图片文件（PNG/JPG）
   - ✅ 确认预览显示正确
   - ✅ 点击 "Save Changes"
   - ✅ 检查是否显示成功消息
   - ✅ 关闭弹窗，Logo 项旁边应该有紫色小点

5. **测试 Header 设置**
   - ✅ 点击 "Header"
   - ✅ 粘贴以下测试代码：
   ```html
   <header style="background: #f3f4f6; padding: 20px; border-bottom: 2px solid #e5e7eb;">
     <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
       <div style="font-size: 24px; font-weight: bold; color: #111827;">My Test Site</div>
       <nav style="display: flex; gap: 20px;">
         <a href="#" style="color: #6b7280; text-decoration: none;">Home</a>
         <a href="#" style="color: #6b7280; text-decoration: none;">About</a>
         <a href="#" style="color: #6b7280; text-decoration: none;">Contact</a>
       </nav>
     </div>
   </header>
   ```
   - ✅ 查看下方预览（应该显示缩放的 header）
   - ✅ 点击 "Save Changes"
   - ✅ 确认保存成功

6. **测试 Footer 设置**
   - ✅ 点击 "Footer"
   - ✅ 粘贴以下测试代码：
   ```html
   <footer style="background: #111827; color: #fff; padding: 40px 20px; margin-top: 60px;">
     <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
       <p style="margin: 0;">&copy; 2024 My Test Site. All rights reserved.</p>
       <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 14px;">
         Built with Mini SeeNOS
       </p>
     </div>
   </footer>
   ```
   - ✅ 查看预览（高度应该更大）
   - ✅ 点击 "Save Changes"
   - ✅ 确认保存成功

7. **测试 Meta Tags 设置**
   - ✅ 点击 "Meta Tags"
   - ✅ 粘贴以下测试代码：
   ```html
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta name="author" content="Test User">
     <meta name="theme-color" content="#6366f1">
     
     <!-- Open Graph -->
     <meta property="og:site_name" content="My Test Site">
     <meta property="og:type" content="website">
     
     <!-- Twitter -->
     <meta name="twitter:site" content="@mytestsite">
     
     <!-- Google Analytics (测试用，不会真实发送) -->
     <script>
       console.log('GA Script Loaded - Test Mode');
     </script>
     
     <!-- Custom Styles -->
     <style>
       body {
         font-family: 'Inter', -apple-system, sans-serif;
       }
     </style>
   </head>
   ```
   - ✅ 查看下方预览，应该显示提取的信息：
     - Basic Information: Charset, Author
     - Visual & Branding: Theme Color
     - Performance & Analytics: Scripts count, Analytics Services
     - Open Graph: Site Name, Type
     - Twitter: Site Handle
   - ✅ 点击 "Save Changes"
   - ✅ 确认保存成功

---

### ✅ 步骤 3: 数据库验证

1. **打开 Supabase Dashboard → Table Editor → site_contexts**

2. **检查数据是否已保存**
   ```
   应该看到 4 条记录（如果全部设置了）:
   - type: 'logo', file_url: '...'
   - type: 'header', content: '<header>...'
   - type: 'footer', content: '<footer>...'
   - type: 'meta', content: '<head>...'
   ```

3. **验证 user_id**
   - 所有记录的 user_id 应该相同（你的用户 ID）

---

### ✅ 步骤 4: AI 生成页面测试

1. **在 Chat 中输入测试命令**
   ```
   生成一个关于 "AI 工具推荐" 的页面，包含 3 个章节
   ```

2. **观察 AI 执行过程**
   - ✅ AI 应该调用 `create_plan`
   - ✅ AI 应该调用 `get_site_contexts` (可选，但推荐)
   - ✅ AI 调用 `draft_page_section` 撰写各章节
   - ✅ AI 调用 `deerapi_generate_images` 生成图片
   - ✅ AI 调用 `assemble_html_page` 并传入 `user_id` 参数
   - ✅ AI 调用 `save_final_page`

3. **检查生成的消息**
   - 应该显示: "Site contexts (header/footer/head tags) integrated."
   - 应该有文件下载卡片显示生成的 HTML

4. **点击 "Preview Generated Page" 按钮**
   - ✅ 应该打开 ContentDrawer 预览
   - ✅ 切换到 "Code" 标签查看 HTML 源代码

---

### ✅ 步骤 5: HTML 验证

在预览的 Code 标签中，检查生成的 HTML 是否包含：

#### 1. Head 标签部分
```html
<head>
  <!-- 应该包含用户自定义的 meta 标签 -->
  <meta name="author" content="Test User">
  <meta name="theme-color" content="#6366f1">
  
  <!-- 应该包含页面特定的 SEO -->
  <title>AI 工具推荐</title>
  <meta name="description" content="...">
  
  <!-- 应该包含用户的自定义脚本 -->
  <script>
    console.log('GA Script Loaded - Test Mode');
  </script>
  
  <!-- 应该包含用户的自定义样式 -->
  <style>
    body {
      font-family: 'Inter', -apple-system, sans-serif;
    }
  </style>
</head>
```

#### 2. Body 结构
```html
<body>
  <!-- 用户的 Header -->
  <header style="background: #f3f4f6; ...">
    <div style="...">
      <div style="...">My Test Site</div>
      <nav style="...">...</nav>
    </div>
  </header>
  
  <!-- 页面主体内容 -->
  <main>
    <article>
      <h1>AI 工具推荐</h1>
      <!-- 各个章节 -->
    </article>
  </main>
  
  <!-- 用户的 Footer -->
  <footer style="background: #111827; ...">
    <div style="...">
      <p>&copy; 2024 My Test Site...</p>
    </div>
  </footer>
</body>
```

#### 3. 元数据检查
在 AI 返回的消息中应该看到：
```
metadata: {
  has_custom_header: true,
  has_custom_footer: true,
  has_custom_head: true,
  ...
}
```

---

### ✅ 步骤 6: 浏览器测试

1. **下载生成的 HTML 文件**
   - 点击下载按钮

2. **在浏览器中打开**
   - 右键点击文件 → 打开方式 → Chrome/Firefox
   
3. **检查渲染效果**
   - ✅ Header 应该显示在顶部
   - ✅ 导航链接应该可见
   - ✅ 页面内容居中显示
   - ✅ Footer 应该显示在底部，黑色背景

4. **打开浏览器控制台 (F12)**
   - ✅ Console 应该显示: "GA Script Loaded - Test Mode"
   - ✅ 检查 Elements 标签，确认 head 标签包含所有自定义内容
   - ✅ 检查 Computed 样式，body 字体应该是 'Inter'

---

### ✅ 步骤 7: 修改测试

1. **修改 Header**
   - 返回 UI，点击 "Header"
   - 修改导航文字或样式
   - 保存

2. **生成新页面**
   ```
   再生成一个关于 "SEO 优化指南" 的页面
   ```

3. **验证新页面使用最新的 Header**
   - 下载并打开 HTML
   - 确认 Header 使用了更新后的内容

---

## 🐛 常见问题排查

### 问题 1: Logo 上传失败 (500 错误)
**原因**: `logos` storage bucket 不存在

**解决**:
1. 打开 Supabase Dashboard → Storage
2. 创建新 bucket: `logos`
3. 设置为 Public
4. 添加 RLS 策略（参考 `docs/SETUP_LOGOS_BUCKET.md`）

### 问题 2: 保存失败 (401/403)
**原因**: RLS 策略未正确设置

**解决**:
1. 重新运行 SQL 迁移脚本
2. 确认 RLS 已启用
3. 确认策略使用 `auth.uid()`

### 问题 3: Preview 不显示 Header/Footer
**原因**: `iframe` 的 `srcDoc` 没有正确处理

**解决**:
- 检查 `SiteContextModal.tsx` 中的 `generatePreviewHTML` 函数
- 确认 Tailwind CDN 已加载

### 问题 4: AI 没有调用 get_site_contexts
**原因**: 这是可选步骤，AI 可能直接调用 assemble_html_page

**解决**:
- 只要 `assemble_html_page` 传入了 `user_id`，就会自动获取 contexts
- 检查生成的消息是否包含 "Site contexts integrated"

### 问题 5: 生成的 HTML 不包含 Header/Footer
**原因**: `assemble_html_page` 没有收到 `user_id` 参数

**解决**:
1. 检查 AI 调用 `assemble_html_page` 时是否传入了 `user_id`
2. 查看 tool 返回的 metadata 中 `has_custom_header` 等字段
3. 确认数据库中有对应用户的 contexts

---

## ✨ 成功验证标志

如果以下全部成功，说明功能正常：

- [x] UI 可以设置 Logo、Header、Footer、Meta Tags
- [x] 设置后可以在预览中看到效果
- [x] 数据正确保存到 `site_contexts` 表
- [x] AI 生成页面时自动读取 contexts
- [x] 生成的 HTML 包含完整的 header、footer、head 标签
- [x] 下载的 HTML 在浏览器中正确渲染
- [x] Header 和 Footer 显示正确
- [x] 自定义脚本（如 console.log）执行成功
- [x] 修改 contexts 后，新生成的页面使用最新版本

---

## 📝 测试记录模板

```
测试日期: ____________
测试人员: ____________

✅ 步骤 1: 数据库准备 - [ ] 通过 / [ ] 失败
✅ 步骤 2: UI 测试 - [ ] 通过 / [ ] 失败
   - Logo: [ ] 通过 / [ ] 失败
   - Header: [ ] 通过 / [ ] 失败
   - Footer: [ ] 通过 / [ ] 失败
   - Meta: [ ] 通过 / [ ] 失败
✅ 步骤 3: 数据库验证 - [ ] 通过 / [ ] 失败
✅ 步骤 4: AI 生成测试 - [ ] 通过 / [ ] 失败
✅ 步骤 5: HTML 验证 - [ ] 通过 / [ ] 失败
✅ 步骤 6: 浏览器测试 - [ ] 通过 / [ ] 失败
✅ 步骤 7: 修改测试 - [ ] 通过 / [ ] 失败

遇到的问题:
_______________________
_______________________

备注:
_______________________
_______________________
```

