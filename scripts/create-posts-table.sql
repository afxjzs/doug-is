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
CREATE POLICY "Allow public read access to published posts" 
ON public.posts
FOR SELECT 
USING (true);

-- Create policy for authenticated users to manage posts
CREATE POLICY "Allow authenticated users to manage posts" 
ON public.posts
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at);

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

-- Insert sample posts
INSERT INTO public.posts (title, slug, content, excerpt, category, featured_image)
VALUES
(
    'Getting Started with Vaporwave Design',
    'getting-started-with-vaporwave-design',
    'Vaporwave is an aesthetic that emerged in the early 2010s, combining elements of 80s and 90s design with glitch art, cyberpunk, and retro computing.\n\nThe style is characterized by its use of neon colors, particularly pink and cyan, retro computer graphics, glitch effects, and references to early internet culture and obsolete technology.\n\nTo create a vaporwave design:\n\n1. Start with a dark background, preferably black or deep purple\n2. Add neon gradients in pink, purple, and cyan\n3. Incorporate grid patterns reminiscent of 80s sci-fi\n4. Use glitch effects and distortion\n5. Add retro computer graphics or statues\n\nVaporwave is more than just a visual style—it''s a nostalgic commentary on consumer capitalism and technology.',
    'An introduction to vaporwave aesthetics and how to incorporate this retro-futuristic style into your designs.',
    'general',
    'https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
),
(
    'Investment Strategies for 2023',
    'investment-strategies-for-2023',
    'As we navigate through 2023, several investment strategies stand out for their potential in the current economic climate.\n\n## Diversification Remains Key\n\nDiversification across asset classes continues to be a fundamental strategy. Consider allocating investments across:\n\n- Equities (with a focus on quality companies with strong balance sheets)\n- Bonds (particularly short to intermediate-term in the current interest rate environment)\n- Alternative investments (real estate, commodities, private equity)\n- Cash and cash equivalents\n\n## Focus on Value Investing\n\nWith market volatility expected to continue, value investing may outperform growth. Look for companies with:\n\n- Strong fundamentals\n- Reasonable price-to-earnings ratios\n- Consistent dividend history\n- Competitive advantages in their industries\n\n## Consider Defensive Sectors\n\nDefensive sectors tend to perform better during economic uncertainty:\n\n- Healthcare\n- Consumer staples\n- Utilities\n- Discount retailers\n\nRemember that all investments carry risk, and it''s important to consult with a financial advisor before making significant changes to your portfolio.',
    'Exploring effective investment approaches for navigating the current economic landscape.',
    'investing',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
),
(
    'The Role of AI in Business Advisory',
    'role-of-ai-in-business-advisory',
    'Artificial Intelligence is transforming business advisory services across industries. Here''s how AI is changing the landscape:\n\n## Enhanced Data Analysis\n\nAI systems can process vast amounts of data quickly, identifying patterns and insights that might be missed by human analysts. This capability allows for:\n\n- More accurate financial forecasting\n- Comprehensive market analysis\n- Identification of operational inefficiencies\n- Customer behavior prediction\n\n## Automated Reporting and Compliance\n\nAI tools can automate routine reporting tasks and help ensure regulatory compliance by:\n\n- Generating financial reports\n- Monitoring transactions for compliance issues\n- Updating documentation as regulations change\n- Flagging potential risks\n\n## Personalized Advisory Services\n\nAI enables more personalized advisory services through:\n\n- Customized recommendations based on specific business data\n- Scenario planning tailored to company objectives\n- Adaptive strategies that evolve with changing conditions\n\n## Challenges and Considerations\n\nDespite its benefits, implementing AI in advisory services comes with challenges:\n\n- Data privacy and security concerns\n- Need for human oversight and interpretation\n- Integration with existing systems\n- Ongoing training and maintenance requirements\n\nThe most effective approach combines AI capabilities with human expertise, creating advisory services that are both data-driven and contextually aware.',
    'Examining how artificial intelligence is revolutionizing business advisory services and decision-making processes.',
    'advisory',
    'https://images.unsplash.com/photo-1677442135136-760c813a743d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80'
); 