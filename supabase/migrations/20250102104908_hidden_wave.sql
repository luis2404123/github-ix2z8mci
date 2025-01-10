/*
  # Storage Setup for Document Translation

  1. Storage Buckets
    - Creates 'documents' bucket for original files
    - Creates 'translations' bucket for translated files
    
  2. Security Policies
    - Enables users to upload and read their own documents
    - Enables users to upload and read their own translations
    - All policies are scoped to authenticated users only
*/

-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('translations', 'translations', false)
ON CONFLICT DO NOTHING;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Documents policies
  DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
  DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
  
  -- Translations policies
  DROP POLICY IF EXISTS "Users can upload translations" ON storage.objects;
  DROP POLICY IF EXISTS "Users can read their own translations" ON storage.objects;
END $$;

-- Create new policies
DO $$ 
BEGIN
  -- Documents policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload documents'
  ) THEN
    CREATE POLICY "Users can upload documents"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
      bucket_id = 'documents' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can read their own documents'
  ) THEN
    CREATE POLICY "Users can read their own documents"
    ON storage.objects FOR SELECT TO authenticated
    USING (
      bucket_id = 'documents' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  -- Translations policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload translations'
  ) THEN
    CREATE POLICY "Users can upload translations"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
      bucket_id = 'translations' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can read their own translations'
  ) THEN
    CREATE POLICY "Users can read their own translations"
    ON storage.objects FOR SELECT TO authenticated
    USING (
      bucket_id = 'translations' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;