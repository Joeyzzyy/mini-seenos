-- Add missing columns to messages table
-- These columns are used by the saveMessage function but were missing from the schema

-- Add tokens_input column
ALTER TABLE messages ADD COLUMN IF NOT EXISTS tokens_input INTEGER DEFAULT 0;

-- Add tokens_output column
ALTER TABLE messages ADD COLUMN IF NOT EXISTS tokens_output INTEGER DEFAULT 0;

-- Add attached_files column (JSONB for storing file references)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS attached_files JSONB;

-- Add attached_content_items column (JSONB for storing content item references)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS attached_content_items JSONB;
