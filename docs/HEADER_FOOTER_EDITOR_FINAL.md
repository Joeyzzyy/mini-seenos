# Header & Footer Visual Editor - 最终版本

## 概述

纯可视化的 Header 和 Footer 编辑器，移除了所有不必要的选项，只保留核心配置。

## Header 编辑器

### 配置项

1. **Site Name** - 网站名称
2. **Navigation Links** - 导航链接
   - 可添加/删除/编辑
   - 每个链接包含：Label 和 URL
3. **CTA Button** - 行动号召按钮
   - Button Label
   - Button URL
   - Button Color（默认：品牌渐变色）
     - 支持任何 CSS 颜色值
     - "Reset to Brand" 快速恢复
     - 实时颜色预览

### 样式
- 固定样式：白色背景、深色文字、浅灰边框
- 导航链接悬停时变为蓝色

## Footer 编辑器

### 配置项

1. **Company Name** - 公司名称
2. **Tagline** - 标语
3. **Color Settings** - 颜色配置
   - **Background Color**（默认：品牌渐变色）
     - 文本输入框
     - "Reset to Brand" 按钮
     - 颜色预览条
   - **Text Color**（默认：#E5E7EB）
     - 文本输入框
     - 原生颜色选择器
     - 背景+文字组合预览
4. **Link Columns** - 链接列
   - 可添加/删除列和链接
5. **Social Media** - 社交媒体链接
   - 支持 Twitter、Facebook、LinkedIn、GitHub、Instagram

## 品牌渐变色

```css
linear-gradient(
  80deg,
  rgb(255, 175, 64) -21.49%,
  rgb(209, 148, 236) 18.44%,
  rgb(154, 143, 234) 61.08%,
  rgb(101, 180, 255) 107.78%
)
```

## 数据结构

### HeaderConfig
```typescript
interface HeaderConfig {
  siteName: string;
  logo?: string;
  navigation: Array<{
    label: string;
    url: string;
  }>;
  ctaButton?: {
    label: string;
    url: string;
    color: string; // CSS 颜色值
  };
}
```

### FooterConfig
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
  socialMedia?: Array<{
    platform: 'twitter' | 'facebook' | 'linkedin' | 'github' | 'instagram';
    url: string;
  }>;
  copyright?: string;
  backgroundColor?: string; // CSS 颜色值
  textColor?: string; // CSS 颜色值
}
```

## 特点

✅ **简洁**：移除了 theme 选项，减少配置复杂度
✅ **直观**：只保留必要的配置项
✅ **灵活**：颜色完全可自定义
✅ **品牌一致**：默认使用品牌渐变色
✅ **零门槛**：纯可视化编辑

## 修改内容

### 移除项
- ❌ Theme 选项（Light/Dark）
- ❌ 代码编辑器模式
- ❌ 模式切换按钮

### 简化项
- Header 固定为 light 风格（白色背景）
- Footer 颜色完全由用户通过颜色配置控制
- 界面更简洁，只显示必要配置

## 使用流程

1. 点击左侧边栏的 Header 或 Footer
2. 填写基本信息（名称、标语等）
3. 配置链接和按钮
4. 调整颜色（可选）
5. 查看预览
6. 保存

就这么简单！🎉

