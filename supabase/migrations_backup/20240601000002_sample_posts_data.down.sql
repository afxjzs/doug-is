-- Remove sample data
DELETE FROM public.posts WHERE slug IN (
  'hello-world',
  'investing-basics',
  'business-advisory-tips',
  'getting-started-with-vaporwave-design'
); 