# Visual Editor for Header and Footer

## 概述

为 Header 和 Footer 添加了**纯可视化编辑器**，让用户无需任何代码知识，就能轻松配置网站的 Header 和 Footer。所有配置通过简单的表单完成，实时预览效果。

## 功能特点

### 1. 纯可视化编辑

- ✅ **无需代码**：完全通过表单编辑，零代码门槛
- 👁️ **实时预览**：每次修改立即显示效果
- 🎨 **品牌色支持**：按钮颜色遵循应用的渐变色规范
- 🎯 **简单直观**：清晰的界面布局，易于理解

### 2. Header 可视化编辑器

提供以下配置选项：

#### 基础设置
- **Site Name**：网站名称
- **Theme**：主题选择（Light / Dark）

#### 导航链接（Navigation Links）
- 可添加/删除/编辑导航链接
- 每个链接包含：
  - Label（显示文本）
  - URL（链接地址）
- 支持任意数量的导航链接
- 一键添加新链接

#### CTA 按钮配置
- **Button Label**：按钮文本
- **Button URL**：按钮链接
- **Button Color**：按钮颜色选择
  - 🌈 **Brand Gradient**：使用应用的品牌渐变色（推荐）
    - `linear-gradient(80deg, rgb(255, 175, 64) -21.49%, rgb(209, 148, 236) 18.44%, rgb(154, 143, 234) 61.08%, rgb(101, 180, 255) 107.78%)`
  - 🎨 **Custom Color**：自定义单色按钮
    - 支持颜色选择器，可选择任意颜色

#### 预览功能
- 实时预览 Header 的显示效果
- 预览使用 iframe 隔离样式，确保准确性
- 自动集成用户上传的 Logo
- 按钮颜色实时更新

### 3. Footer 可视化编辑器

提供以下配置选项：

#### 基础设置
- **Company Name**：公司名称
- **Tagline**：标语
- **Theme**：主题选择（Light / Dark）

#### 链接列（Link Columns）
- 支持多列链接组织
- 每列包含：
  - Column Title（列标题）
  - Multiple Links（多个链接）
    - Label（显示文本）
    - URL（链接地址）
- 可添加/删除列和链接

#### 社交媒体（Social Media）
- 支持主流社交平台：
  - Twitter
  - Facebook
  - LinkedIn
  - GitHub
  - Instagram
- 每个社交链接包含平台选择和 URL

#### 预览功能
- 实时预览 Footer 的显示效果
- 支持查看完整的 Footer 布局

### 使用方式

### 访问编辑器

1. 在左侧边栏找到 **On Site Context** 部分
2. 点击 **Header** 或 **Footer** 选项
3. 弹出编辑模态框

### 编辑 Header

1. 填写**网站名称**和选择**主题**（Light/Dark）
2. 配置**导航链接**：
   - 编辑现有链接的名称和 URL
   - 点击删除按钮移除不需要的链接
   - 点击 "+ Add Link" 添加新链接
3. 配置 **CTA 按钮**：
   - 输入按钮文本和链接 URL
   - 选择按钮颜色：
     - 选择 "Brand Gradient" 使用品牌渐变色（推荐）
     - 选择 "Custom Color" 并使用颜色选择器选择自定义颜色
4. 在预览区域查看实时效果
5. 点击 **Save Changes** 保存

### 编辑 Footer

1. 填写**公司名称**、**标语**和选择**主题**
2. 配置**链接列**：
   - 编辑列标题
   - 添加/编辑/删除列内的链接
   - 删除整列或添加新列
3. 配置**社交媒体链接**：
   - 选择社交平台（Twitter、Facebook、LinkedIn、GitHub、Instagram）
   - 输入对应的 URL
   - 添加/删除社交链接
4. 在预览区域查看实时效果
5. 点击 **Save Changes** 保存

## 技术实现

### 数据结构

#### Header Config
```typescript
interface HeaderConfig {
  siteName: string;
  logo?: string;
  navigation: Array<{
    label: string;
    url: string;
  }>;
  ctaButton: {
    label: string;
    url: string;
    useGradient: boolean;      // 使用品牌渐变色
    customColor: string;        // 自定义颜色（当 useGradient 为 false 时使用）
  };
  theme: 'light' | 'dark';
}
```

#### Footer Config
```typescript
interface FooterConfig {
  companyName: string;
  tagline?: string;
  logo?: string;
  columns: Array<{
    title: string;
    links: Array<{
      label: string;
      url: string;
    }>;
  }>;
  socialMedia: Array<{
    platform: 'twitter' | 'facebook' | 'linkedin' | 'github' | 'instagram';
    url: string;
  }>;
  theme: 'light' | 'dark';
}
```

### HTML 生成

- 使用 `generateHeaderHTML(config, brandGradient)` 和 `generateFooterHTML(config)` 函数
- 基于配置对象动态生成 Tailwind CSS 样式的 HTML
- 支持明暗主题切换
- 响应式设计，适配移动端和桌面端
- Header 按钮支持品牌渐变色或自定义单色

### 品牌渐变色

应用统一使用的品牌渐变色：
```css
background: linear-gradient(
  80deg,
  rgb(255, 175, 64) -21.49%,
  rgb(209, 148, 236) 18.44%,
  rgb(154, 143, 234) 61.08%,
  rgb(101, 180, 255) 107.78%
);
```

这个渐变色贯穿整个应用，确保视觉一致性。

### 预览系统

- 使用 iframe 隔离样式，避免与主应用样式冲突
- 加载 Tailwind CSS CDN 确保样式正确显示
- 自动替换图片源，使用用户上传的 Logo
- 缩放预览以适应编辑器界面
- 实时渲染按钮颜色变化

## 优势

1. ✅ **零代码门槛**：任何人都能使用，无需技术背景
2. 👁️ **实时预览**：所见即所得，配置结果一目了然
3. 🎨 **品牌一致性**：按钮颜色遵循品牌规范，可自定义
4. 📱 **响应式设计**：生成的 HTML 自动适配各种设备
5. 🔄 **灵活配置**：支持任意数量的链接、列、社交媒体
6. 🎯 **清晰结构**：表单组织合理，易于理解和操作

## 颜色配置说明

### Header CTA 按钮颜色

用户可以选择两种颜色方案：

1. **Brand Gradient（品牌渐变色）**
   - 推荐使用，与应用整体风格保持一致
   - 多彩渐变效果，更具视觉冲击力
   - 默认选项

2. **Custom Color（自定义颜色）**
   - 使用颜色选择器选择任意单色
   - 适合需要特定品牌色的场景
   - 默认为蓝色 (#3B82F6)

### 颜色预览

编辑器中提供颜色预览：
- Brand Gradient 选项旁显示渐变色样本
- Custom Color 选项集成颜色选择器，可实时预览
- 预览区域实时显示按钮效果

## 未来改进

1. 支持从现有 HTML 代码解析回配置对象（反向解析）
2. 添加更多预设模板供用户选择
3. 支持完整的颜色方案配置（不仅限于按钮）
4. 添加更多布局选项和样式自定义
5. 支持拖拽排序导航链接和 Footer 列
6. 添加 Logo 尺寸和位置调整选项

## 使用建议

- **颜色选择**：推荐使用 Brand Gradient，确保视觉一致性
- **导航数量**：建议 4-6 个导航链接，避免过于拥挤
- **Footer 列数**：建议 3-4 列，平衡信息量和可读性
- **社交媒体**：只添加活跃使用的社交平台链接
- **预览确认**：保存前务必查看预览，确保效果符合预期

