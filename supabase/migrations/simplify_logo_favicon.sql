-- ================================================
-- SIMPLIFY LOGO & FAVICON FIELDS
-- ================================================
-- Merge logo_light_url/logo_dark_url → logo_url
-- Merge favicon_light_url/favicon_dark_url → favicon_url
-- ================================================

-- Step 1: Add new simplified columns
ALTER TABLE site_contexts 
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS favicon_url TEXT;

-- Step 2: Migrate data - prefer light version, fallback to dark
UPDATE site_contexts 
SET 
  logo_url = COALESCE(logo_light_url, logo_dark_url, logo_light, logo_dark, file_url),
  favicon_url = COALESCE(favicon_light_url, favicon_dark_url, icon_light, icon_dark, favicon)
WHERE type = 'logo';

-- Step 3: Remove old columns (optional - uncomment when ready)
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS logo_light_url;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS logo_dark_url;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS favicon_light_url;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS favicon_dark_url;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS logo_light;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS logo_dark;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS icon_light;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS icon_dark;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS favicon;
-- ALTER TABLE site_contexts DROP COLUMN IF EXISTS file_url;

-- Add comments
COMMENT ON COLUMN site_contexts.logo_url IS 'Brand logo URL';
COMMENT ON COLUMN site_contexts.favicon_url IS 'Favicon URL';
