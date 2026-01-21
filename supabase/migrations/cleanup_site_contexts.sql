-- ================================================
-- SITE CONTEXTS CLEANUP MIGRATION
-- ================================================
-- This migration simplifies the site_contexts table by:
-- 1. Removing unused context types
-- 2. Adding new URL fields for logo/favicon
-- 3. Adding html field for header/footer
-- 4. Removing deprecated columns
-- ================================================

-- Step 1: Add new columns if they don't exist
ALTER TABLE site_contexts 
  ADD COLUMN IF NOT EXISTS html TEXT,
  ADD COLUMN IF NOT EXISTS logo_light_url TEXT,
  ADD COLUMN IF NOT EXISTS logo_dark_url TEXT,
  ADD COLUMN IF NOT EXISTS favicon_light_url TEXT,
  ADD COLUMN IF NOT EXISTS favicon_dark_url TEXT,
  ADD COLUMN IF NOT EXISTS domain_name TEXT;

-- Step 2: Migrate logo data - copy from old fields to new fields if new fields are empty
UPDATE site_contexts 
SET 
  logo_light_url = COALESCE(logo_light_url, logo_light, file_url),
  logo_dark_url = COALESCE(logo_dark_url, logo_dark),
  favicon_light_url = COALESCE(favicon_light_url, icon_light, favicon),
  favicon_dark_url = COALESCE(favicon_dark_url, icon_dark)
WHERE type = 'logo';

-- Step 3: For header/footer, if html is null but content has HTML, copy content to html
-- (Legacy data has HTML in content field)
UPDATE site_contexts 
SET html = content
WHERE type IN ('header', 'footer') 
  AND html IS NULL 
  AND content IS NOT NULL 
  AND content LIKE '<%';

-- Step 4: Delete unused context types
-- Removing: meta, sitemap, hero-section, problem-statement, who-we-serve,
-- use-cases, industries, products-services, social-proof-trust, leadership-team,
-- about-us, faq, contact-information, key-website-pages, landing-pages, blog-resources
DELETE FROM site_contexts 
WHERE type IN (
  'meta',
  'sitemap', 
  'hero-section',
  'problem-statement', 
  'who-we-serve',
  'use-cases', 
  'industries', 
  'products-services',
  'social-proof-trust', 
  'leadership-team',
  'about-us', 
  'faq', 
  'contact-information',
  'key-website-pages',
  'landing-pages',
  'blog-resources'
);

-- Step 5: Remove deprecated columns (optional - can keep for safety)
-- Uncomment these if you want to fully remove old columns:
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS logo_light;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS logo_dark;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS icon_light;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS icon_dark;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS favicon;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS subtitle;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS tone;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS meta_description;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS brand_name;

-- Step 6: Add comments for remaining fields
COMMENT ON TABLE site_contexts IS 'Stores site-wide context: logo, header, footer, competitors, and brand settings';
COMMENT ON COLUMN site_contexts.type IS 'Context type: logo, header, footer, competitors';
COMMENT ON COLUMN site_contexts.content IS 'JSON config for editors (header/footer config, competitors list)';
COMMENT ON COLUMN site_contexts.html IS 'Generated HTML for header/footer';
COMMENT ON COLUMN site_contexts.logo_light_url IS 'Light theme logo URL';
COMMENT ON COLUMN site_contexts.logo_dark_url IS 'Dark theme logo URL';
COMMENT ON COLUMN site_contexts.favicon_light_url IS 'Light theme favicon URL';
COMMENT ON COLUMN site_contexts.favicon_dark_url IS 'Dark theme favicon URL';
COMMENT ON COLUMN site_contexts.domain_name IS 'Website domain name';
COMMENT ON COLUMN site_contexts.primary_color IS 'Brand primary color (hex)';
COMMENT ON COLUMN site_contexts.secondary_color IS 'Brand secondary color (hex)';
COMMENT ON COLUMN site_contexts.heading_font IS 'Font family for headings';
COMMENT ON COLUMN site_contexts.body_font IS 'Font family for body text';
COMMENT ON COLUMN site_contexts.languages IS 'Supported languages';
COMMENT ON COLUMN site_contexts.og_image IS 'Open Graph image URL';

-- Step 7: Update type constraint to only allow valid types
-- First drop the old constraint if exists
ALTER TABLE site_contexts DROP CONSTRAINT IF EXISTS site_contexts_type_check;

-- Add new constraint
ALTER TABLE site_contexts ADD CONSTRAINT site_contexts_type_check 
  CHECK (type IN ('logo', 'header', 'footer', 'competitors'));
