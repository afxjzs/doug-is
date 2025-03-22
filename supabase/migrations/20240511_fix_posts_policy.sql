-- Grant anonymous access to read posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read published posts
DROP POLICY IF EXISTS "Allow anonymous read access to published posts" ON posts;
CREATE POLICY "Allow anonymous read access to published posts" 
ON posts 
FOR SELECT 
TO anon
USING (published_at IS NOT NULL);

-- Allow authenticated users to read all posts
DROP POLICY IF EXISTS "Allow authenticated users to read all posts" ON posts;
CREATE POLICY "Allow authenticated users to read all posts" 
ON posts 
FOR SELECT 
TO authenticated
USING (true); 