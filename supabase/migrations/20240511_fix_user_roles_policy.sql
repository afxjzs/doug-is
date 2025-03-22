-- Grant anonymous SELECT access to user_roles table to allow public blog viewing
-- This is needed because anonymous users need to access this table for some queries

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to view user roles but not modify them
DROP POLICY IF EXISTS "Allow anonymous read access to user roles" ON user_roles;
CREATE POLICY "Allow anonymous read access to user roles" 
ON user_roles 
FOR SELECT 
TO anon
USING (true);

-- Allow authenticated users to read all roles
DROP POLICY IF EXISTS "Allow authenticated users to read all roles" ON user_roles;
CREATE POLICY "Allow authenticated users to read all roles" 
ON user_roles 
FOR SELECT 
TO authenticated
USING (true); 