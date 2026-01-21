-- Add seo_project_id column to content_projects table
-- This links Topic Clusters (content_projects) to SEO Projects (seo_projects table)

-- Add the column (nullable for existing data)
ALTER TABLE content_projects 
ADD COLUMN IF NOT EXISTS seo_project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE;

-- Create index for faster lookups by SEO project
CREATE INDEX IF NOT EXISTS idx_content_projects_seo_project_id 
ON content_projects(seo_project_id);

-- Create composite index for user + seo_project queries
CREATE INDEX IF NOT EXISTS idx_content_projects_user_seo_project 
ON content_projects(user_id, seo_project_id);
