-- Down Migration: create_posts_table
-- Created at: Wed Mar 12 20:43:50 PDT 2025

-- Drop trigger
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;

-- Drop indexes
DROP INDEX IF EXISTS idx_posts_slug;
DROP INDEX IF EXISTS idx_posts_category;
DROP INDEX IF EXISTS idx_posts_published_at;

-- Drop policies
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'posts' 
    AND policyname = 'Allow public read access to published posts'
  ) THEN
    DROP POLICY IF EXISTS "Allow public read access to published posts" ON public.posts;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'posts' 
    AND policyname = 'Allow authenticated users to manage posts'
  ) THEN
    DROP POLICY IF EXISTS "Allow authenticated users to manage posts" ON public.posts;
  END IF;
END
$$;

-- Drop table
DROP TABLE IF EXISTS public.posts;

