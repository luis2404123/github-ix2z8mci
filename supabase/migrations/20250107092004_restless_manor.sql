-- Insert test activity logs with a specific user ID
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Get the first user ID from auth.users
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;

  -- Only insert if we found a user
  IF test_user_id IS NOT NULL THEN
    INSERT INTO activity_log (user_id, description, created_at)
    VALUES 
      (test_user_id, 'Created translation: Business Proposal (English → Spanish)', NOW() - INTERVAL '2 hours'),
      (test_user_id, 'Translation completed: Marketing Report (English → French)', NOW() - INTERVAL '1 hour'),
      (test_user_id, 'Generated QR code for Technical Manual', NOW() - INTERVAL '30 minutes'),
      (test_user_id, 'Started new translation: Product Catalog (English → German)', NOW() - INTERVAL '15 minutes'),
      (test_user_id, 'Updated translation settings', NOW() - INTERVAL '5 minutes');
  END IF;
END $$;