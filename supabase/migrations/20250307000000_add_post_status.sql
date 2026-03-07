-- Add status column to posts table for blog capture pipeline
-- Statuses: idea (raw capture), draft (being written), review (ready for editing), published (live)
-- This is separate from published_at which controls public visibility.

-- Create the enum type
DO $$ BEGIN
	CREATE TYPE post_status AS ENUM ('idea', 'draft', 'review', 'published');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- Add status column with default 'draft' (backward compatible with existing posts)
ALTER TABLE public.posts
	ADD COLUMN IF NOT EXISTS status post_status NOT NULL DEFAULT 'draft';

-- Backfill: published posts get 'published', unpublished get 'draft'
UPDATE public.posts SET status = 'published' WHERE published_at IS NOT NULL;
UPDATE public.posts SET status = 'draft' WHERE published_at IS NULL;

-- Add index for status filtering
CREATE INDEX IF NOT EXISTS posts_status_idx ON public.posts (status);

-- Make content, excerpt, and slug optional for ideas/early drafts
-- (they already have defaults or are nullable, but let's ensure content allows empty)
ALTER TABLE public.posts ALTER COLUMN content SET DEFAULT '';
ALTER TABLE public.posts ALTER COLUMN slug SET DEFAULT '';
