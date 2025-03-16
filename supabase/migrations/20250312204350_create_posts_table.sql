-- Migration: create_posts_table
-- Created at: Wed Mar 12 20:43:50 PDT 2025

-- Create posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  category TEXT NOT NULL,
  featured_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to published posts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'posts' 
    AND policyname = 'Allow public read access to published posts'
  ) THEN
    CREATE POLICY "Allow public read access to published posts" 
    ON public.posts
    FOR SELECT 
    USING (true);
  END IF;
END
$$;

-- Create policy for authenticated users to manage posts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'posts' 
    AND policyname = 'Allow authenticated users to manage posts'
  ) THEN
    CREATE POLICY "Allow authenticated users to manage posts" 
    ON public.posts
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;
END
$$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_trigger
    WHERE tgname = 'update_posts_updated_at'
  ) THEN
    CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;

