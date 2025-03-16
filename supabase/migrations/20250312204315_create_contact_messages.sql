a-- Migration: create_contact_messages
-- Created at: Wed Mar 12 20:43:15 PDT 2025

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for insert (anyone can submit a contact form)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND policyname = 'Anyone can insert contact messages'
  ) THEN
    CREATE POLICY "Anyone can insert contact messages" 
    ON contact_messages FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);
  END IF;
END
$$;

-- Create policy for select (only authenticated users can view messages)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND policyname = 'Only authenticated users can view contact messages'
  ) THEN
    CREATE POLICY "Only authenticated users can view contact messages" 
    ON contact_messages FOR SELECT 
    TO authenticated
    USING (true);
  END IF;
END
$$;

-- Create policy for update (only authenticated users can update messages)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND policyname = 'Only authenticated users can update contact messages'
  ) THEN
    CREATE POLICY "Only authenticated users can update contact messages" 
    ON contact_messages FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;
END
$$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_trigger
    WHERE tgname = 'update_contact_messages_updated_at'
  ) THEN
    CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;

