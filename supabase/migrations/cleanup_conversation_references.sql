-- Cleanup: Remove conversation_id from content_items
-- We now use seo_project_id to link content to SEO projects (domains)

-- Drop the conversation_id column from content_items (if it exists)
ALTER TABLE content_items DROP COLUMN IF EXISTS conversation_id;

-- Note: The 'conversations' table and related functions are kept for:
-- 1. Chat message history storage
-- 2. Backwards compatibility with existing data
-- These may be deprecated in a future update.
