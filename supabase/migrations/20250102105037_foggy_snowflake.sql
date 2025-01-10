/*
  # Storage Setup for Document Translation

  1. Storage Buckets
    - Creates 'documents' bucket for original files
    - Creates 'translations' bucket for translated files
    - Sets buckets as public for easier access
    
  2. Security Policies
    - Enables users to upload and read their own documents
    - Enables users to upload and read their own translations
    - All policies are scoped to authenticated users only
*/

-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('translations', 'translations', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on objects table if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Documents policies
  DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
  DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
  DROP POLICY IF EXISTS "Public can read documents" ON storage.objects;
  
  -- Translations policies
  DROP POLICY IF EXISTS "Users can upload translations" ON storage.objects;
  DROP POLICY IF EXISTS "Users can read their own translations" ON storage.objects;
END $$;

-- Create new policies
DO $$ 
BEGIN
  -- Documents policies
  CREATE POLICY "Users can upload documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

  CREATE POLICY "Users can read their own documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

  -- Translations policies
  CREATE POLICY "Users can upload translations"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'translations' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

  CREATE POLICY "Users can read their own translations"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'translations' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

  -- Public read access
  CREATE POLICY "Public can read documents"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id IN ('documents', 'translations'));
END $$;