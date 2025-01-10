-- Insert test translations with proper user association
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Get the first user ID from auth.users
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;

  -- Only insert if we found a user
  IF test_user_id IS NOT NULL THEN
    -- Insert test documents
    WITH doc_inserts AS (
      INSERT INTO documents (user_id, name, file_url)
      VALUES 
        (test_user_id, 'Marketing Presentation.pdf', 'documents/marketing-presentation.pdf'),
        (test_user_id, 'Product Manual.docx', 'documents/product-manual.docx'),
        (test_user_id, 'Legal Contract.pdf', 'documents/legal-contract.pdf')
      RETURNING id, name
    )
    -- Insert translations for each document
    INSERT INTO translations (user_id, document_id, source_language, target_language, status, created_at)
    SELECT 
      test_user_id,
      doc_inserts.id,
      'en',
      target_lang,
      status,
      created_time
    FROM doc_inserts
    CROSS JOIN (
      VALUES 
        ('es', 'completed', NOW() - INTERVAL '2 days'),
        ('fr', 'processing', NOW() - INTERVAL '1 day'),
        ('de', 'pending', NOW() - INTERVAL '12 hours')
    ) AS t(target_lang, status, created_time);
  END IF;
END $$;