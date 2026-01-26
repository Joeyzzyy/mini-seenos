-- Fix site_contexts table completely
-- This migration fixes all schema issues

-- 1. Remove NOT NULL constraint from url column (legacy column)
ALTER TABLE site_contexts ALTER COLUMN url DROP NOT NULL;

-- 2. Remove NOT NULL constraint from context_data if exists
ALTER TABLE site_contexts ALTER COLUMN context_data DROP NOT NULL;

-- 3. Add seo_project_id column if it doesn't exist
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS seo_project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE;

-- 4. Add all needed columns
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS html TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS domain_name TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS logo_light_url TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS logo_dark_url TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS favicon_url TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS favicon_light_url TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS favicon_dark_url TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS primary_color TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS secondary_color TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS heading_font TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS body_font TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS languages TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS brand_name TEXT;
ALTER TABLE site_contexts ADD COLUMN IF NOT EXISTS tone TEXT;

-- 5. Fix type constraint if it exists (remove old CHECK constraint)
ALTER TABLE site_contexts DROP CONSTRAINT IF EXISTS site_contexts_type_check;

-- 6. Drop old unique constraint and create new one
ALTER TABLE site_contexts DROP CONSTRAINT IF EXISTS site_contexts_user_id_type_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'site_contexts_user_id_seo_project_id_type_key'
  ) THEN
    ALTER TABLE site_contexts ADD CONSTRAINT site_contexts_user_id_seo_project_id_type_key 
      UNIQUE (user_id, seo_project_id, type);
  END IF;
END $$;

-- 7. Create indexes
CREATE INDEX IF NOT EXISTS idx_site_contexts_seo_project_id ON site_contexts(seo_project_id);
CREATE INDEX IF NOT EXISTS idx_site_contexts_user_project_type ON site_contexts(user_id, seo_project_id, type);
