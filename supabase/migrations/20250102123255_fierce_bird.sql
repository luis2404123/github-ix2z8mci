/*
  # Fix RLS and Storage Policies

  1. Storage Policies
    - Add proper RLS policies for documents bucket
    - Fix folder structure and access patterns
    - Enable public read access for translations

  2. Table Policies
    - Update RLS policies for better security
    - Fix document upload permissions
*/

-- Update storage bucket settings
UPDATE storage.buckets
SET public = true
WHERE id IN ('documents', 'translations');

-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload translations" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own translations" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documents' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own documents" 
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'documents' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Public can read translations"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'translations');

-- Update table RLS policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own documents"
ON documents FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own documents"
ON documents FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
ON documents FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
ON documents FOR DELETE TO authenticated
USING (auth.uid() = user_id);