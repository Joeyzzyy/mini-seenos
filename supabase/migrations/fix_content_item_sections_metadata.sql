-- Fix content_item_sections table - add missing columns
-- The table may have been created with an older schema

-- Add all required columns if they don't exist
ALTER TABLE content_item_sections ADD COLUMN IF NOT EXISTS section_id TEXT;
ALTER TABLE content_item_sections ADD COLUMN IF NOT EXISTS section_type TEXT;
ALTER TABLE content_item_sections ADD COLUMN IF NOT EXISTS section_order INT DEFAULT 0;
ALTER TABLE content_item_sections ADD COLUMN IF NOT EXISTS section_html TEXT;
ALTER TABLE content_item_sections ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- For backward compatibility, copy data from old columns if they exist
DO $$
BEGIN
  -- If section_key exists and section_id is empty, copy the data
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_item_sections' AND column_name = 'section_key') THEN
    UPDATE content_item_sections SET section_id = section_key WHERE section_id IS NULL AND section_key IS NOT NULL;
  END IF;
END $$;

-- Drop old unique constraint if it exists
ALTER TABLE content_item_sections DROP CONSTRAINT IF EXISTS content_item_sections_content_item_id_section_key_key;

-- Add unique constraint for content_item_id + section_id (required for upsert)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'content_item_sections_content_item_id_section_id_key'
  ) THEN
    ALTER TABLE content_item_sections 
      ADD CONSTRAINT content_item_sections_content_item_id_section_id_key 
      UNIQUE (content_item_id, section_id);
  END IF;
END $$;

-- Add comment for the metadata column
COMMENT ON COLUMN content_item_sections.metadata IS 'Optional metadata for the section (title, description, etc.)';
