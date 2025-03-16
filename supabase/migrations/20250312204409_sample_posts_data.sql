-- Migration: sample_posts_data
-- Created at: Wed Mar 12 20:44:09 PDT 2025

-- Your SQL statements here

-- Insert sample data if the table is empty
INSERT INTO public.posts (title, slug, content, excerpt, category, featured_image)
SELECT 
  'Hello World - My First Blog Post',
  'hello-world',
  'This is a sample post content with **markdown** support.',
  'This is my first blog post on my new personal website.',
  'general',
  '/images/blog/hello-world.jpg'
WHERE NOT EXISTS (SELECT 1 FROM public.posts LIMIT 1);

INSERT INTO public.posts (title, slug, content, excerpt, category, featured_image)
SELECT 
  'Investing Basics - Getting Started with Investing',
  'investing-basics',
  'This is a sample investing post content with **markdown** support.',
  'A beginner''s guide to investing in the stock market.',
  'investing',
  '/images/blog/investing-basics.jpg'
WHERE NOT EXISTS (SELECT 1 FROM public.posts WHERE slug != 'hello-world' LIMIT 1);

INSERT INTO public.posts (title, slug, content, excerpt, category, featured_image)
SELECT 
  '5 Essential Business Advisory Tips for Startups',
  'business-advisory-tips',
  'This is a sample advisory post content with **markdown** support.',
  'Key advisory tips for startup founders.',
  'advisory',
  '/images/blog/advisory-tips.jpg'
WHERE NOT EXISTS (SELECT 1 FROM public.posts WHERE slug NOT IN ('hello-world', 'investing-basics') LIMIT 1);

-- Insert vaporwave design post
INSERT INTO public.posts (title, slug, content, excerpt, category, featured_image)
SELECT
    'Getting Started with Vaporwave Design',
    'getting-started-with-vaporwave-design',
    'Vaporwave is an aesthetic that emerged in the early 2010s, combining elements of 80s and 90s design with glitch art, cyberpunk, and retro computing.\n\nThe style is characterized by its use of neon colors, particularly pink and cyan, retro computer graphics, glitch effects, and references to early internet culture and obsolete technology.\n\nTo create a vaporwave design:\n\n1. Start with a dark background, preferably black or deep purple\n2. Add neon gradients in pink, purple, and cyan\n3. Incorporate grid patterns reminiscent of 80s sci-fi\n4. Use glitch effects and distortion\n5. Add retro computer graphics or statues\n\nVaporwave is more than just a visual style—it''s a nostalgic commentary on consumer capitalism and technology.',
    'An introduction to vaporwave aesthetics and how to incorporate this retro-futuristic style into your designs.',
    'general',
    'https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.posts WHERE slug = 'getting-started-with-vaporwave-design' LIMIT 1);

