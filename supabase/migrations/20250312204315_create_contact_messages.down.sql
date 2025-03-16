-- Down Migration: create_contact_messages
-- Created at: Wed Mar 12 20:43:15 PDT 2025

-- Drop trigger
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;

-- Drop function (only if not used by other tables)
-- DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop policies
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND policyname = 'Anyone can insert contact messages'
  ) THEN
    DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND policyname = 'Only authenticated users can view contact messages'
  ) THEN
    DROP POLICY IF EXISTS "Only authenticated users can view contact messages" ON contact_messages;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND policyname = 'Only authenticated users can update contact messages'
  ) THEN
    DROP POLICY IF EXISTS "Only authenticated users can update contact messages" ON contact_messages;
  END IF;
END
$$;

-- Drop table
DROP TABLE IF EXISTS contact_messages;

