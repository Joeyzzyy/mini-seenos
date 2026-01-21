-- Add seo_project_id column to content_items table
-- This directly links content items to SEO projects (domains)

-- Add the column (nullable for existing data)
ALTER TABLE content_items 
ADD COLUMN IF NOT EXISTS seo_project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE;

-- Migrate existing data: copy conversation_id to seo_project_id where applicable
-- (only if conversation_id values are actually seo_project IDs)
-- UPDATE content_items SET seo_project_id = conversation_id::uuid WHERE conversation_id IS NOT NULL;

-- Create index for faster lookups by SEO project
CREATE INDEX IF NOT EXISTS idx_content_items_seo_project_id 
ON content_items(seo_project_id);

-- Create composite index for user + seo_project queries
CREATE INDEX IF NOT EXISTS idx_content_items_user_seo_project 
ON content_items(user_id, seo_project_id);
