-- Drop trigger
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;

-- Drop function (only if not used by other tables)
-- DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop policies
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Only authenticated users can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Only authenticated users can update contact messages" ON contact_messages;

-- Drop table
DROP TABLE IF EXISTS contact_messages; 