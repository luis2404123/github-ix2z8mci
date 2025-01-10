/*
  # Fix Storage and Document Policies

  1. Changes
    - Enable RLS on storage.objects
    - Update storage bucket policies
    - Drop and recreate policies with proper checks

  2. Security
    - Ensure proper user isolation
    - Maintain data access control
*/

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read documents" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Update documents table policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can create documents" ON documents;
  DROP POLICY IF EXISTS "Users can read own documents" ON documents;
  DROP POLICY IF EXISTS "Users can update own documents" ON documents;
  DROP POLICY IF EXISTS "Users can delete own documents" ON documents;
END $$;

-- Create new document policies
CREATE POLICY "Users can create documents"
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