/*
  # Create storage buckets for document management
  
  1. New Buckets
    - documents: For storing all document files
    - translations: For storing translated files
  
  2. Security
    - Enable RLS on buckets
    - Add policies for authenticated users
*/

-- Create documents bucket
INSERT INTO storage.buckets (id, name)
VALUES ('documents', 'documents')
ON CONFLICT DO NOTHING;

-- Create translations bucket  
INSERT INTO storage.buckets (id, name)
VALUES ('translations', 'translations')
ON CONFLICT DO NOTHING;

-- Documents bucket policies
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read their own documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Translations bucket policies  
CREATE POLICY "Users can upload translations"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'translations' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read their own translations"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'translations' AND auth.uid()::text = (storage.foldername(name))[1]);