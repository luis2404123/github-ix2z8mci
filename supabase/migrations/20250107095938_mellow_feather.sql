/*
  # Add Translation Text Columns

  1. Changes
    - Add translated_text column to translations table
    - Add error_message column to translations table
    - Add indexes for better query performance

  2. Security
    - Maintain existing RLS policies
*/

-- Add translated_text and error_message columns to translations table
ALTER TABLE translations 
ADD COLUMN IF NOT EXISTS translated_text text,
ADD COLUMN IF NOT EXISTS error_message text;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_translations_status ON translations(status);
CREATE INDEX IF NOT EXISTS idx_translations_created_at ON translations(created_at);

-- Update existing translations to have empty translated_text
UPDATE translations 
SET translated_text = ''
WHERE translated_text IS NULL;