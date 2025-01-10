/*
  # Add Sample Translation Data

  1. Sample Data
    - Creates example documents and translations
    - Adds variety of languages and statuses
    - Includes realistic timestamps
  
  2. Notes
    - All samples are linked to the first user who signs up
    - Uses realistic file paths and names
    - Includes different translation statuses
*/

-- Insert sample documents
INSERT INTO documents (id, user_id, name, file_url, created_at)
VALUES
  ('d7c52d6a-42f9-4a80-8654-c2f4b0ad0000', (SELECT id FROM auth.users LIMIT 1), 'Business Proposal.pdf', 'documents/user1/business-proposal.pdf', NOW() - INTERVAL '3 days'),
  ('d7c52d6a-42f9-4a80-8654-c2f4b0ad0001', (SELECT id FROM auth.users LIMIT 1), 'Technical Documentation.docx', 'documents/user1/tech-docs.docx', NOW() - INTERVAL '2 days'),
  ('d7c52d6a-42f9-4a80-8654-c2f4b0ad0002', (SELECT id FROM auth.users LIMIT 1), 'Marketing Brochure.pdf', 'documents/user1/marketing-brochure.pdf', NOW() - INTERVAL '1 day');

-- Insert sample translations
INSERT INTO translations (id, user_id, document_id, source_language, target_language, status, created_at, updated_at)
VALUES
  (
    'f9b12d8c-6e4a-4b91-9e45-8f67c3450000',
    (SELECT id FROM auth.users LIMIT 1),
    'd7c52d6a-42f9-4a80-8654-c2f4b0ad0000',
    'en',
    'es',
    'completed',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '2.9 days'
  ),
  (
    'f9b12d8c-6e4a-4b91-9e45-8f67c3450001',
    (SELECT id FROM auth.users LIMIT 1),
    'd7c52d6a-42f9-4a80-8654-c2f4b0ad0000',
    'en',
    'fr',
    'completed',
    NOW() - INTERVAL '2.5 days',
    NOW() - INTERVAL '2.4 days'
  ),
  (
    'f9b12d8c-6e4a-4b91-9e45-8f67c3450002',
    (SELECT id FROM auth.users LIMIT 1),
    'd7c52d6a-42f9-4a80-8654-c2f4b0ad0001',
    'en',
    'de',
    'pending',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    'f9b12d8c-6e4a-4b91-9e45-8f67c3450003',
    (SELECT id FROM auth.users LIMIT 1),
    'd7c52d6a-42f9-4a80-8654-c2f4b0ad0002',
    'en',
    'zh',
    'processing',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  );

-- Insert sample QR codes for completed translations
INSERT INTO qr_codes (id, user_id, translation_id, code_url, active, created_at)
VALUES
  (
    'e8a23f7b-5d3c-4c82-8b34-9f56d2340000',
    (SELECT id FROM auth.users LIMIT 1),
    'f9b12d8c-6e4a-4b91-9e45-8f67c3450000',
    'https://api.qrlingo.com/v1/translations/f9b12d8c-6e4a-4b91-9e45-8f67c3450000',
    true,
    NOW() - INTERVAL '2.9 days'
  ),
  (
    'e8a23f7b-5d3c-4c82-8b34-9f56d2340001',
    (SELECT id FROM auth.users LIMIT 1),
    'f9b12d8c-6e4a-4b91-9e45-8f67c3450001',
    'https://api.qrlingo.com/v1/translations/f9b12d8c-6e4a-4b91-9e45-8f67c3450001',
    true,
    NOW() - INTERVAL '2.4 days'
  );

-- Add sample activity logs
INSERT INTO activity_log (user_id, description, created_at)
VALUES
  (
    (SELECT id FROM auth.users LIMIT 1),
    'Created translation: Business Proposal (English → Spanish)',
    NOW() - INTERVAL '3 days'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    'Translation completed: Business Proposal (English → Spanish)',
    NOW() - INTERVAL '2.9 days'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    'Created translation: Business Proposal (English → French)',
    NOW() - INTERVAL '2.5 days'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    'Translation completed: Business Proposal (English → French)',
    NOW() - INTERVAL '2.4 days'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    'Created translation: Technical Documentation (English → German)',
    NOW() - INTERVAL '2 days'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    'Created translation: Marketing Brochure (English → Chinese)',
    NOW() - INTERVAL '1 day'
  );