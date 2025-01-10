/*
  # Create Dashboard Tables

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `file_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `translations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `document_id` (uuid, foreign key to documents)
      - `source_language` (text)
      - `target_language` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `qr_codes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `translation_id` (uuid, foreign key to translations)
      - `code_url` (text)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `activity_log`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `description` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Translations Table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  document_id uuid REFERENCES documents NOT NULL,
  source_language text NOT NULL,
  target_language text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own translations"
  ON translations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- QR Codes Table
CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  translation_id uuid REFERENCES translations NOT NULL,
  code_url text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own QR codes"
  ON qr_codes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Activity Log Table
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity"
  ON activity_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity logs"
  ON activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);