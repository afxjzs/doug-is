-- This script fixes all Supabase permissions to ensure anonymous users can view blog posts
-- Run this entire script in the Supabase dashboard SQL editor

-- 1. Enable Row Level Security on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 2. Grant basic schema permissions to anonymous users
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 3. Create policies for posts table
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous read access to published posts" ON posts;
DROP POLICY IF EXISTS "Allow authenticated users to read all posts" ON posts;

-- Create new policies for posts table
CREATE POLICY "Allow anonymous read access to published posts" 
ON posts 
FOR SELECT 
TO anon
USING (published_at IS NOT NULL);

CREATE POLICY "Allow authenticated users to read all posts" 
ON posts 
FOR SELECT 
TO authenticated
USING (true);

-- 4. Create policies for user_roles table
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous read access to user roles" ON user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to read all roles" ON user_roles;

-- Create new policies for user_roles table
CREATE POLICY "Allow anonymous read access to user roles" 
ON user_roles 
FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Allow authenticated users to read all roles" 
ON user_roles 
FOR SELECT 
TO authenticated
USING (true);

-- 5. Create policies for contact_messages table
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to read contact messages" ON contact_messages;

-- Create new policies for contact_messages table
CREATE POLICY "Allow authenticated users to read contact messages" 
ON contact_messages 
FOR SELECT 
TO authenticated
USING (true);

-- 6. Grant direct SELECT permissions on tables to the anonymous role
GRANT SELECT ON TABLE posts TO anon;
GRANT SELECT ON TABLE user_roles TO anon;

-- 7. Grant additional permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE contact_messages TO authenticated;

-- 8. Grant usage on sequences (needed for insertions with serial IDs)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- All permissions should now be properly set up 