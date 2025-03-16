-- Down Migration: add_read_flag_to_posts
-- Created at: Wed Mar 12 20:52:00 PDT 2025

-- Example: Drop a policy with IF EXISTS check
-- DO $$
-- BEGIN
--   IF EXISTS (
--     SELECT FROM pg_policies 
--     WHERE tablename = 'my_table' 
--     AND policyname = 'My policy name'
--   ) THEN
--     DROP POLICY IF EXISTS "My policy name" ON my_table;
--   END IF;
-- END
-- $$;

-- Example: Drop a table with IF EXISTS
-- DROP TABLE IF EXISTS my_table;

-- Remove is_read column from posts table if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'posts' 
    AND column_name = 'is_read'
  ) THEN
    ALTER TABLE public.posts DROP COLUMN is_read;
  END IF;
END
$$;

-- Your rollback SQL statements here

