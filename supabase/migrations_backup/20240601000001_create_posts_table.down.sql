-- Drop trigger
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;

-- Drop indexes
DROP INDEX IF EXISTS idx_posts_slug;
DROP INDEX IF EXISTS idx_posts_category;
DROP INDEX IF EXISTS idx_posts_published_at;

-- Drop policies
DROP POLICY IF EXISTS "Allow public read access to published posts" ON public.posts;
DROP POLICY IF EXISTS "Allow authenticated users to manage posts" ON public.posts;

-- Drop table
DROP TABLE IF EXISTS public.posts; 