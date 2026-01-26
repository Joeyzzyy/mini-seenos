-- Add missing columns to content_items table for page planning

-- target_keyword - SEO target keyword for the page
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS target_keyword TEXT;

-- page_type - Type of page (alternative, listicle, etc.)
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS page_type TEXT;

-- outline - Page structure/outline as JSON
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS outline JSONB;

-- estimated_word_count - Estimated word count for the page
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS estimated_word_count INTEGER;

-- seo_title - SEO meta title
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS seo_title TEXT;

-- seo_description - SEO meta description
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- notes - Additional notes about the page
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS notes TEXT;

-- slug - URL slug for the page
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create index on seo_project_id for faster queries
CREATE INDEX IF NOT EXISTS idx_content_items_seo_project_id ON content_items(seo_project_id);

-- Create index on page_type for filtering
CREATE INDEX IF NOT EXISTS idx_content_items_page_type ON content_items(page_type);
