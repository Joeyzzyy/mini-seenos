# Visual Editor for Header and Footer - 颜色配置

## 概述

为 Header 和 Footer 添加了**纯可视化编辑器**，支持灵活的颜色配置：
- **Header**：CTA 按钮颜色可自定义（默认使用品牌渐变色）
- **Footer**：背景色和文字颜色都可自定义（背景默认使用品牌渐变色）

## 功能特点

### 1. Header 编辑器

#### 基础设置
- ✏️ **Site Name**：网站名称
- 🎨 **Theme**：主题选择（Light / Dark）

#### 导航链接
- 🔗 可添加/删除/编辑导航链接
- 每个链接包含 Label 和 URL
- 支持任意数量的导航链接

#### CTA 按钮配置
- **Button Label**：按钮文本
- **Button URL**：按钮链接
- **Button Color**：按钮颜色（单一配置项）
  - 默认值：品牌渐变色
  - 支持任何 CSS 颜色值：
    - 十六进制：`#3B82F6`
    - RGB：`rgb(59, 130, 246)`
    - 渐变：`linear-gradient(...)`
  - "Reset to Brand" 按钮一键恢复品牌色
  - 实时预览效果

### 2. Footer 编辑器

#### 基础设置
- 🏢 **Company Name**：公司名称
- 💬 **Tagline**：标语
- 🎨 **Theme**：主题选择（Light / Dark）

#### 颜色配置（新增）
**Color Settings** 独立配置区域：

1. **Background Color（背景色）**
   - 默认值：品牌渐变色
   - 支持任何 CSS 颜色值（单色或渐变）
   - 提供文本输入框和颜色预览
   - "Reset to Brand" 按钮一键恢复品牌色
   - 实时预览效果

2. **Text Color（文字颜色）**
   - 默认值：`#E5E7EB`（浅灰色）
   - 提供文本输入框
   - 集成原生颜色选择器（color picker）
   - 实时预览背景+文字组合效果

#### 链接列
- 📋 支持多列链接组织
- 可添加/删除列和链接
- 每列包含标题和多个链接项

#### 社交媒体
- 🌐 支持主流社交平台
- 可添加/删除社交链接

## 品牌渐变色

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

这个渐变色是默认值，确保视觉一致性。

## 使用方式

### 编辑 Header 按钮颜色

1. 在 Header 编辑器中找到 **CTA Button** 区域
2. 配置按钮文本和链接
3. 在 **Button Color** 输入框中：
   - 保持默认值使用品牌渐变色
   - 输入自定义颜色值（如 `#FF5733`）
   - 输入自定义渐变（如 `linear-gradient(90deg, #FF0000, #0000FF)`）
4. 点击 "Reset to Brand" 恢复品牌色
5. 查看预览条确认效果
6. 保存更改

### 编辑 Footer 颜色

1. 在 Footer 编辑器中找到 **Color Settings** 区域
2. 配置**背景色**：
   - 保持默认值使用品牌渐变色
   - 输入自定义颜色值或渐变
   - 点击 "Reset to Brand" 恢复品牌色
3. 配置**文字颜色**：
   - 在输入框中输入颜色值
   - 或使用右侧的颜色选择器选择颜色
4. 查看预览区域（显示 "Sample Text"）确认颜色搭配
5. 保存更改

## 颜色预览系统

### Header 预览
- 按钮颜色预览条：显示当前选择的按钮颜色
- 完整 Header 预览：在 iframe 中显示完整效果

### Footer 预览
- 背景色预览条：显示当前背景色
- 文字+背景组合预览：显示 "Sample Text" 在背景上的效果
- 完整 Footer 预览：在 iframe 中显示完整效果

## 技术实现

### Header Config
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
    color: string; // CSS color value (支持单色和渐变)
  };
  theme: 'light' | 'dark';
}
```

### Footer Config
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
  backgroundColor: string; // CSS color value (支持单色和渐变)
  textColor: string;       // CSS color value
  theme: 'light' | 'dark';
}
```

### HTML 生成

#### Header
- 按钮使用 `style` 属性设置颜色
- 支持任何有效的 CSS `background` 值

#### Footer
- 使用 `style` 属性设置背景和文字颜色
- 背景支持任何有效的 CSS `background` 值
- 文字颜色应用到所有文本元素

## 颜色搭配建议

### Header 按钮
- **品牌渐变色**（推荐）：视觉冲击力强，与应用一致
- **单色按钮**：简洁专业，适合特定品牌色需求
  - 蓝色系：`#3B82F6`、`#2563EB`
  - 绿色系：`#10B981`、`#059669`
  - 紫色系：`#8B5CF6`、`#7C3AED`

### Footer
#### 背景色建议
- **品牌渐变色**（推荐）：与 Header 按钮呼应，统一视觉
- **深色背景**：
  - 纯黑：`#000000`
  - 深灰：`#1F2937`、`#111827`
  - 深蓝：`#1E3A8A`
- **浅色背景**：
  - 浅灰：`#F3F4F6`、`#E5E7EB`
  - 白色：`#FFFFFF`

#### 文字颜色建议
根据背景明暗选择对比色：
- **深色背景搭配**：
  - 白色：`#FFFFFF`
  - 浅灰：`#E5E7EB`、`#D1D5DB`
- **浅色背景搭配**：
  - 深灰：`#374151`、`#1F2937`
  - 黑色：`#000000`

### 对比度要求
为确保可访问性，建议：
- 文字与背景的对比度至少为 4.5:1
- 使用在线工具检查对比度（如 WebAIM Contrast Checker）

## 优势

1. ✅ **零代码门槛**：纯可视化编辑，无需技术背景
2. 🎨 **品牌一致性**：默认使用品牌渐变色
3. 🔧 **高度灵活**：支持任何 CSS 颜色值
4. 👁️ **实时预览**：所见即所得，立即看到效果
5. 🔄 **一键恢复**：错误配置可快速恢复默认值
6. 🎯 **独立配置**：Header 和 Footer 颜色独立设置
7. 📱 **响应式**：生成的 HTML 自动适配各种设备

## 常见问题

### Q: 如何设置渐变色？
A: 在颜色输入框中输入 CSS 渐变语法，例如：
```
linear-gradient(90deg, #FF0000 0%, #0000FF 100%)
```

### Q: 颜色不显示怎么办？
A: 检查输入的 CSS 值是否有效，或点击 "Reset to Brand" 恢复默认值。

### Q: Footer 文字看不清楚？
A: 调整文字颜色，确保与背景有足够对比度。使用预览功能查看实际效果。

### Q: 可以使用透明背景吗？
A: 可以，输入 `transparent` 或 `rgba(0,0,0,0)` 即可。

## 最佳实践

1. **保持一致性**：建议 Header 按钮和 Footer 背景都使用品牌渐变色
2. **注意对比度**：确保文字在背景上清晰可读
3. **测试预览**：保存前务必查看预览效果
4. **渐变方向**：考虑响应式布局，避免过于复杂的渐变
5. **备份配置**：记录自定义颜色值，便于后续调整

