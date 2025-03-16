# Doug.is - Personal Website Project

## Project Overview

This is a personal website for Douglas Rogers built with Next.js 14, Supabase, and Tailwind CSS. The site features a modern, cyberpunk-inspired design with neon accents and follows a content-first approach. It serves as a platform for sharing thoughts, projects, and professional information.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

## Directory Structure

```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── [category]/       # Dynamic category pages
│   ├── about/            # About page
│   ├── admin/            # Admin dashboard
│   ├── advising/         # Advisory services page
│   ├── api/              # API routes
│   ├── attributing/      # Attribution page
│   ├── building/         # Building/projects page
│   ├── contact/          # Contact page with form
│   ├── hustling/         # Hustling/entrepreneurship page
│   ├── investing/        # Investing page
│   ├── respecting-privacy/ # Privacy policy page
│   ├── thinking/         # Blog/thoughts main page
│   │   ├── [primary-category]/ # Category-specific blog pages
│   │   │   └── [slug]/   # Individual blog post pages
│   ├── globals.css       # Global CSS styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Homepage
├── components/           # Reusable UI components
│   ├── ContactForm.tsx   # Contact form component
│   ├── Footer.tsx        # Site footer
│   ├── Header.tsx        # Site header with navigation
│   ├── Navigation.tsx    # Navigation component
│   └── SafeImage.tsx     # Image component with error handling
├── content/              # Static content
│   └── posts/            # Markdown blog posts
├── lib/                  # Utility functions and services
│   ├── supabase/         # Supabase client and database functions
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── supabase/             # Supabase configuration and migrations
│   └── migrations/       # SQL migration files for database schema
└── scripts/              # Utility scripts
    ├── create-migration.sh # Script to create new migrations
    └── run-migrations.sh # Script to run migrations up/down
```

## Key Components

### App Structure

- **layout.tsx**: Root layout that includes the Header, Footer, and various background effects
- **page.tsx**: Homepage with sections for different categories and a personal introduction

### Navigation

- **Header.tsx**: Main navigation header with responsive mobile menu
- **Footer.tsx**: Footer with navigation links, social links, and contact information

### Data Fetching

- **supabase/client.ts**: Supabase client setup and data fetching functions
  - Handles connection to Supabase
  - Provides mock data for development when credentials are missing
  - Contains CRUD operations for blog posts

## Content Structure

### Blog Posts

Blog posts are stored in Supabase with the following schema:

```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published_at?: string;
  category: string;
  featured_image?: string;
}
```

All blog content is centralized under the `/thinking` route with the URL structure:
`/thinking/[primary-category]/[slug]`

### Pages

- **Homepage**: Introduction and links to main sections
- **Thinking**: Blog posts and articles
- **Building**: Projects and development work
- **Investing**: Investment insights and strategies
- **Hustling**: Entrepreneurship and business ventures
- **Advising**: Professional advisory services

## Styling

The site uses a custom design system with:

- **Color Variables**: Defined in globals.css with RGB values for easy opacity adjustments
- **Gradient Effects**: Various gradient text and background effects
- **Neon Accents**: Glow effects for text and UI elements
- **Responsive Design**: Mobile-first approach with tailored experiences for different screen sizes

Key CSS classes:
- `gradient-heading`: For gradient text headings
- `gradient-text-[color]`: For colored gradient text
- `neon-[color]`: For text with neon glow effects
- `dark-card`: For card components with hover effects

## Development Workflow

1. Local development server: `bun --bun run dev` (preferred method)
   - Fastest performance using Bun runtime
   - Alternatively, use `./dev.sh` which provides optimized Node.js setup
   - Or use `npm run dev` directly (slowest option)
2. Supabase integration with fallback to mock data when credentials are missing
3. Content management through Supabase or direct code edits

## Authentication and Authorization

- Admin section for content management
- Supabase authentication for secure access

## Special Features

1. **Backdrop Effects**: Multiple layered background effects (grid, noise, scanlines)
2. **Animated UI Elements**: Subtle animations for interactive elements
3. **Mobile Menu**: Responsive menu with backdrop blur effect
4. **Dynamic Routing**: Category and slug-based routing for blog posts

## Common Patterns

1. **Data Fetching**: Using Supabase client functions like `getPosts()`, `getPostBySlug()`, etc.
2. **Layout Components**: Consistent layout structure across pages
3. **Responsive Design**: Mobile-first approach with tailored experiences
4. **Gradient Effects**: Consistent use of gradients for visual hierarchy

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## Deployment

The site is deployed on Vercel with:
- Automatic deployments from the main branch
- Environment variables configured in Vercel dashboard
- Vercel Analytics for performance monitoring

## Database Management

The project uses Supabase for database storage with a structured migration system:

- **Migration Files**: Located in `supabase/migrations/` directory
- **Helper Scripts**: 
  - `scripts/create-migration.sh`: Creates new migration files with proper timestamps
  - `scripts/run-migrations.sh`: Simplifies running migrations up and down

Database tables include:
- `posts`: Stores blog posts with categories and content
- `contact_messages`: Stores contact form submissions

All tables use Row Level Security (RLS) policies to control access 