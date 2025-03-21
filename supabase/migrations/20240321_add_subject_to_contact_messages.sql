-- Add subject column to contact_messages table
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS subject TEXT NOT NULL DEFAULT '';

-- Create RLS policies if they don't exist
DO $$
BEGIN
  -- Check if the policy exists before trying to alter it
  IF EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND policyname = 'Allow admins to select contact_messages'
  ) THEN
    ALTER POLICY "Allow admins to select contact_messages" ON contact_messages USING (true);
  ELSE
    -- Create policy if it doesn't exist
    CREATE POLICY "Allow admins to select contact_messages" ON contact_messages FOR SELECT USING (true);
  END IF;

  -- Check if the policy exists before trying to alter it
  IF EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND policyname = 'Allow admins to insert contact_messages'
  ) THEN
    ALTER POLICY "Allow admins to insert contact_messages" ON contact_messages WITH CHECK (true);
  ELSE
    -- Create policy if it doesn't exist
    CREATE POLICY "Allow admins to insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
  END IF;
END
$$;

-- Add comment for documentation
COMMENT ON COLUMN contact_messages.subject IS 'The subject of the contact message'; 