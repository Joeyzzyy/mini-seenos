-- ================================================================
-- SQL Migration: Add 'competitors' type support to site_contexts
-- 执行时间: 运行一次即可
-- ================================================================

-- 删除旧的 CHECK 约束（如果存在）
ALTER TABLE site_contexts DROP CONSTRAINT IF EXISTS site_contexts_type_check;

-- 添加新的 CHECK 约束，包含 'competitors' 类型
ALTER TABLE site_contexts ADD CONSTRAINT site_contexts_type_check 
CHECK (type IN (
  'logo', 'header', 'footer', 'meta', 'sitemap',
  'key-website-pages', 'landing-pages', 'blog-resources',
  'hero-section', 'problem-statement', 'who-we-serve',
  'use-cases', 'industries', 'products-services',
  'social-proof-trust', 'leadership-team', 'about-us',
  'faq', 'contact-information', 'competitors'
));

-- 如果上面的方式报错，说明你的表没有 CHECK 约束，可以忽略错误
-- site_contexts 表的 type 字段是 TEXT 类型，本身就支持任意字符串
