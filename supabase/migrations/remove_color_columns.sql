-- Migration: Remove primary_color, secondary_color, heading_font, body_font columns from site_contexts
-- Date: 2026-01-26
-- Reason: Simplify header/footer to use unified light theme and fixed typography

-- First, set values to NULL (optional, for safety)
UPDATE site_contexts 
SET primary_color = NULL, secondary_color = NULL, heading_font = NULL, body_font = NULL
WHERE primary_color IS NOT NULL 
   OR secondary_color IS NOT NULL
   OR heading_font IS NOT NULL
   OR body_font IS NOT NULL;

-- Then drop the columns
ALTER TABLE site_contexts DROP COLUMN IF EXISTS primary_color;
ALTER TABLE site_contexts DROP COLUMN IF EXISTS secondary_color;
ALTER TABLE site_contexts DROP COLUMN IF EXISTS heading_font;
ALTER TABLE site_contexts DROP COLUMN IF EXISTS body_font;

-- Add comment to table explaining the change
COMMENT ON TABLE site_contexts IS 'Stores brand settings, header, footer, and competitor context. Colors and typography removed in favor of unified theme.';
