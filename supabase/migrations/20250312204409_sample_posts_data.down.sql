-- Down Migration: sample_posts_data
-- Created at: Wed Mar 12 20:44:09 PDT 2025

-- Your rollback SQL statements here

-- Remove sample data
DELETE FROM public.posts WHERE slug IN (
  'hello-world',
  'investing-basics',
  'business-advisory-tips',
  'getting-started-with-vaporwave-design'
);

