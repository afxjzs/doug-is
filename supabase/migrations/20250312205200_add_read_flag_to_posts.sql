-- Migration: add_read_flag_to_posts
-- Created at: Wed Mar 12 20:52:00 PDT 2025

-- Example: Create a table with IF NOT EXISTS
-- CREATE TABLE IF NOT EXISTS my_table (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Example: Create a policy with IF NOT EXISTS check
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT FROM pg_policies 
--     WHERE tablename = 'my_table' 
--     AND policyname = 'My policy name'
--   ) THEN
--     CREATE POLICY "My policy name" 
--     ON my_table
--     FOR SELECT 
--     USING (true);
--   END IF;
-- END
-- $$;

-- Your SQL statements here

-- Add is_read column to posts table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'posts' 
    AND column_name = 'is_read'
  ) THEN
    ALTER TABLE public.posts ADD COLUMN is_read BOOLEAN DEFAULT FALSE;
  END IF;
END
$$;

