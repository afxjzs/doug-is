# Doug.is - Personal Website Project

## Project Overview

This is a personal website for Douglas Rogers built with Next.js 15.2.4, React 19, Supabase, and Tailwind CSS v4. The site features a modern, cyberpunk-inspired design with neon accents and follows a content-first approach. It serves as a platform for sharing thoughts, projects, and professional information while showcasing Doug's work as a developer, investor, and entrepreneur.

## Tech Stack

- **Framework**: Next.js ^15.2.4 with App Router
- **Language**: TypeScript
- **Frontend**: React ^19.0.0
- **Styling**: Tailwind CSS ^4.0.0 with PostCSS ^4.0.14
- **Database**: Supabase
- **Deployment**: Vercel
- **UI Components**: Radix UI
- **Analytics**: Vercel Analytics
- **Node.js**: >=20.11.1

## Directory Structure

```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── [category]/       # Dynamic category pages
│   ├── (migraine-free)/  # Route Group for migraine-free pages
│   │   └── migraine-free/ # Migraine-free content section
│   ├── about/            # About page
│   ├── admin/            # Admin dashboard
│   ├── advising/         # Advisory services page
│   ├── api/              # API routes for data fetching and testing
│   ├── attributing/      # Attribution page
│   ├── building/         # Building/projects page
│   ├── contact/          # Contact page with form
│   ├── hustling/         # Hustling/entrepreneurship page
│   ├── investing/        # Investing page
│   ├── respecting-privacy/ # Privacy policy page
│   ├── thinking/         # Blog/thoughts main page
│   │   ├── [primary-category]/ # Category-specific blog pages
│   │   │   └── [slug]/   # Individual blog post pages
│   ├── globals.css       # Global CSS styles with Tailwind v4 imports
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Homepage
├── components/           # Reusable UI components
│   ├── ContactForm.tsx   # Contact form component
│   ├── Footer.tsx        # Site footer
│   ├── Header.tsx        # Site header with navigation and mobile menu
│   ├── Navigation.tsx    # Navigation component
│   └── SafeImage.tsx     # Optimized image component with error handling
├── content/              # Static content and markdown files
│   └── posts/            # Markdown blog posts
├── lib/                  # Utility functions and services
│   ├── supabase/         # Supabase client configuration and database functions
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
├── supabase/             # Supabase configuration and migrations
│   ├── migrations/       # SQL migration files for database schema changes
│   └── config.toml       # Supabase configuration
└── scripts/              # Utility scripts for development and database management
    ├── create-migration.sh # Script to create new migrations with timestamps
    └── run-migrations.sh # Script to run migrations up/down
```

## Key Components

### App Structure

- **layout.tsx**: Root layout that includes the Header, Footer, and various background effects with global styles
- **page.tsx**: Homepage with sections for different categories and a personal introduction
- **Route Groups**: Uses Next.js route groups like `(migraine-free)` for organized routing without affecting URL structure

### Navigation

- **Header.tsx**: Main navigation header with responsive mobile menu and animated elements
- **Navigation.tsx**: Navigation links with active state management
- **Footer.tsx**: Footer with navigation links, social links, and contact information

### Data Fetching

- **supabase/client.ts**: Supabase client setup and data fetching functions
  - Handles connection to Supabase with MCP server integration
  - Provides mock data for development when credentials are missing
  - Contains CRUD operations for posts and contact messages
  - Implements proper error handling and type safety

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
  created_at: string;
  updated_at: string;
}
```

All blog content is centralized under the `/thinking` route with the URL structure:
`/thinking/[primary-category]/[slug]`

### Database Schema

The project uses Supabase with the following main tables:

- **posts**: Blog posts with categories, content, and metadata
- **contact_messages**: Contact form submissions with user information
- **user_roles**: User authentication and authorization

All tables implement Row Level Security (RLS) policies for secure access control.

### Pages

- **Homepage**: Introduction and links to main sections
- **Thinking**: Blog posts and articles with dynamic routing
- **Building**: Projects and development work showcase
- **Investing**: Investment insights and strategies
- **Hustling**: Entrepreneurship and business ventures
- **Advising**: Professional advisory services
- **Migraine-Free**: Specialized content section using route groups

## Styling and Design

The site uses a custom design system with Tailwind CSS v4:

### Color Variables
Defined in globals.css with RGB values for easy opacity adjustments:
```css
@import "tailwindcss";

:root {
  /* Custom color definitions */
}
```

### Design Features
- **Cyberpunk Theme**: Modern, tech-inspired design with neon accents
- **Gradient Effects**: Various gradient text and background effects
- **Neon Accents**: Glow effects for text and UI elements
- **Responsive Design**: Mobile-first approach with tailored experiences
- **Backdrop Effects**: Multiple layered background effects (grid, noise, scanlines)

### Key CSS Classes
- `gradient-heading`: For gradient text headings
- `gradient-text-[color]`: For colored gradient text
- `neon-[color]`: For text with neon glow effects
- `dark-card`: For card components with hover effects

## Development Workflow

### Local Development
```bash
# Start development server (runs on port 3000)
./start.sh

# Alternative optimized Node.js setup
npm run dev
```

### Key Development Practices
- **Test-Driven Development (TDD)**: Write tests before implementation
- **Server-Side Rendering**: Leverage Next.js App Router and Server Components
- **Performance Optimization**: Font optimization with next/font, image optimization with next/image
- **Content-First Approach**: Prioritize content organization and accessibility

### Database Management
- **Migration System**: Structured migration system with helper scripts
- **MCP Integration**: Read-only Supabase MCP server for development
- **Environment Fallback**: Mock data when Supabase credentials are missing

## Authentication and Authorization

- **Admin Section**: Content management interface
- **Supabase Auth**: User authentication system
- **Row Level Security**: Database-level access control
- **Role-Based Access**: User roles and permissions system

## Performance Optimizations

- **Next.js 15 Features**: Enhanced App Router with async APIs
- **React 19 Integration**: Server Components and improved streaming
- **Image Optimization**: Automatic WebP conversion and responsive sizing
- **Font Optimization**: next/font for optimal font loading
- **Minimized Client JS**: Server components reduce bundle size
- **Build Optimization**: Optimized configuration in next.config.js
- **Core Web Vitals**: Monitoring and optimization for performance metrics

## Special Features

1. **Route Groups**: Organized routing without URL impact using `(group)` syntax
2. **Animated UI Elements**: Subtle animations for interactive elements  
3. **Mobile Menu**: Responsive menu with backdrop blur effect
4. **Dynamic Routing**: Category and slug-based routing for blog posts
5. **Error Boundaries**: Comprehensive error handling throughout the app
6. **Accessibility**: WCAG compliance and keyboard navigation support

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- Additional environment variables for deployment and analytics

## Deployment

The site is deployed on Vercel with:
- **Automatic Deployments**: From the main branch
- **Environment Configuration**: Variables configured in Vercel dashboard  
- **Performance Monitoring**: Vercel Analytics integration
- **Edge Functions**: Optimized for global performance

## Common Development Patterns

1. **Data Fetching**: Using Supabase client functions like `getPosts()`, `getPostBySlug()`
2. **Layout Components**: Consistent layout structure across all pages
3. **Responsive Design**: Mobile-first approach with breakpoint-specific optimizations
4. **Gradient Effects**: Consistent use of gradients for visual hierarchy
5. **Error Handling**: Comprehensive error boundaries and fallback states
6. **Type Safety**: Strong TypeScript integration throughout the codebase

## Server Management

**CRITICAL**: Development server runs on port 3000. Server restart command:
```bash
cd /Users/afxjzs/dev/projects/doug-is && kill $(lsof -t -i:3000) || true && npm run dev
``` 