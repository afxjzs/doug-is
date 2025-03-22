-- Fix permissions for the posts table
-- This ensures that the public posts can be read correctly

-- Make sure RLS is enabled
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Make sure all existing policies are removed
DROP POLICY IF EXISTS "Public can view published posts" ON posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON posts;

-- Add policy for public read access to published posts
CREATE POLICY "Enable read access for all users" 
  ON posts
  FOR SELECT 
  USING (published_at IS NOT NULL);

-- Add policy for admin users to manage all posts
CREATE POLICY "Admins can manage all posts" 
  ON posts
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Enable anon key to access the table
GRANT SELECT ON posts TO anon; 