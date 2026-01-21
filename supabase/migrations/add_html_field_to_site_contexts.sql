-- Add html field to site_contexts table
-- This field stores the generated HTML for header/footer, separate from the config JSON in content
-- Run this migration in Supabase SQL Editor

-- Add html column to store generated HTML (for header/footer)
ALTER TABLE site_contexts 
  ADD COLUMN IF NOT EXISTS html TEXT;

-- Add comment for the new column
COMMENT ON COLUMN site_contexts.html IS 'Generated HTML content (for header/footer). The content field stores the JSON config for editing.';
