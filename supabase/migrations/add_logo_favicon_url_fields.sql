-- Add new logo and favicon URL fields with clearer naming
-- These replace the deprecated logo_light, logo_dark, icon_light, icon_dark fields
-- Run this migration in Supabase SQL Editor

-- Add new logo URL columns
ALTER TABLE site_contexts 
  ADD COLUMN IF NOT EXISTS logo_light_url TEXT,
  ADD COLUMN IF NOT EXISTS logo_dark_url TEXT;

-- Add new favicon URL columns
ALTER TABLE site_contexts 
  ADD COLUMN IF NOT EXISTS favicon_light_url TEXT,
  ADD COLUMN IF NOT EXISTS favicon_dark_url TEXT;

-- Add comments for the new columns
COMMENT ON COLUMN site_contexts.logo_light_url IS 'Light theme logo URL (replaces deprecated logo_light)';
COMMENT ON COLUMN site_contexts.logo_dark_url IS 'Dark theme logo URL (replaces deprecated logo_dark)';
COMMENT ON COLUMN site_contexts.favicon_light_url IS 'Light theme favicon URL (replaces deprecated icon_light)';
COMMENT ON COLUMN site_contexts.favicon_dark_url IS 'Dark theme favicon URL (replaces deprecated icon_dark)';
