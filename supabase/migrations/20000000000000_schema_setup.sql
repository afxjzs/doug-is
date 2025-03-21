-- Schema Setup: Creates tables, functions, and policies for the doug.is website
-- Using a clean single migration approach to avoid conflicts

-- POSTS TABLE: For blog posts and articles
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- Indexes for posts table
CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts (published_at);
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts (slug);

-- RLS for posts: Public can read published posts, authenticated admins can do anything
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (only published posts)
CREATE POLICY posts_public_read_policy ON posts 
    FOR SELECT 
    TO public 
    USING (published_at IS NOT NULL AND published_at <= now());

-- Policy for admin full access
CREATE POLICY posts_admin_all_policy ON posts 
    FOR ALL 
    TO authenticated 
    USING (true);

-- CONTACT MESSAGES TABLE: For storing contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    read_at TIMESTAMPTZ,
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- Indexes for contact_messages table
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages (created_at);
CREATE INDEX IF NOT EXISTS contact_messages_read_at_idx ON contact_messages (read_at);

-- RLS for contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy for public to insert contact messages
CREATE POLICY contact_messages_public_insert_policy ON contact_messages 
    FOR INSERT 
    TO public 
    WITH CHECK (true);

-- Policy for admin to read contact messages
CREATE POLICY contact_messages_admin_read_policy ON contact_messages 
    FOR SELECT 
    TO authenticated 
    USING (true);

-- USER ROLES TABLE: For managing user roles
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    CONSTRAINT valid_role CHECK (role IN ('admin', 'editor', 'viewer')),
    UNIQUE (user_id, role)
);

-- Indexes for user_roles table
CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles (user_id);
CREATE INDEX IF NOT EXISTS user_roles_role_idx ON user_roles (role);

-- RLS for user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy for admin to manage all user roles
CREATE POLICY user_roles_admin_all_policy ON user_roles 
    FOR ALL 
    TO authenticated 
    USING (true);

-- AUTOMATIC TIMESTAMP UPDATES
-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for posts table
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger for user_roles table
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at(); 