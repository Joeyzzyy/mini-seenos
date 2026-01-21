-- Fix the foreign key constraint on content_projects.seo_project_id
-- It should reference seo_projects(id), not conversations(id)

-- Drop the incorrect foreign key constraint (if it exists)
ALTER TABLE content_projects 
DROP CONSTRAINT IF EXISTS content_projects_seo_project_id_fkey;

-- Re-add the column with correct foreign key reference
-- First, drop the column if it has wrong constraint
ALTER TABLE content_projects DROP COLUMN IF EXISTS seo_project_id;

-- Add the column with correct reference to seo_projects table
ALTER TABLE content_projects 
ADD COLUMN IF NOT EXISTS seo_project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE;

-- Re-create indexes
CREATE INDEX IF NOT EXISTS idx_content_projects_seo_project_id 
ON content_projects(seo_project_id);

CREATE INDEX IF NOT EXISTS idx_content_projects_user_seo_project 
ON content_projects(user_id, seo_project_id);
