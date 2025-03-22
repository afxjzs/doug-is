-- This migration adds the category, excerpt, and featured_image columns to the posts table
-- These columns are needed for proper display and categorization of blog posts

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Add category column with a default value of 'General'
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General';

-- Add excerpt column for post summaries
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS excerpt TEXT NOT NULL DEFAULT '';

-- Add featured_image column for post header images
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Add an index on category for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Add an index on slug for faster lookups (if not already exists)
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Update any existing posts to ensure they have a valid category
UPDATE posts
SET category = 'General'
WHERE category IS NULL OR category = '';

-- Update any existing posts to ensure they have a valid excerpt
UPDATE posts
SET excerpt = SUBSTRING(content, 1, 150) || '...'
WHERE excerpt IS NULL OR excerpt = '';

-- Add a security policy to allow public read access to published posts
DROP POLICY IF EXISTS "Public can view published posts" ON posts;
CREATE POLICY "Public can view published posts" 
  ON posts
  FOR SELECT 
  TO public
  USING (published_at IS NOT NULL);

-- Add a security policy to allow admin users to manage all posts
DROP POLICY IF EXISTS "Admins can manage all posts" ON posts;
CREATE POLICY "Admins can manage all posts" 
  ON posts
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  ); 