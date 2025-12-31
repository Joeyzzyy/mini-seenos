-- Add annotations column to messages table to store additional message metadata
-- This includes reference images, attachments metadata, and other future annotations

ALTER TABLE messages ADD COLUMN IF NOT EXISTS annotations jsonb;

-- Add index for better query performance on annotations
CREATE INDEX IF NOT EXISTS idx_messages_annotations ON messages USING gin (annotations);

-- Add comment for documentation
COMMENT ON COLUMN messages.annotations IS 'Additional message metadata including reference images, custom attachments, and other annotations';

