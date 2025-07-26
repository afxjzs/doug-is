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
│   ├── (migraine-free)/  # Route Group for migraine-free pages
│   │   ├── layout.tsx    # Migraine-free layout
│   │   └── migraine-free/ # Migraine-free content section
│   │       ├── feedback/  # Feedback pages
│   │       ├── layout.tsx # Migraine-free section layout
│   │       ├── metadata.ts # Section metadata
│   │       └── page.tsx   # Main migraine-free page
│   ├── (site)/           # Route Group for main site content (doesn't affect URLs)
│   │   ├── layout.tsx    # Shared layout for all site pages
│   │   ├── advising/     # Advisory services content
│   │   │   └── page.tsx  # Page content: /advising
│   │   ├── building/     # Building/projects content
│   │   │   └── page.tsx  # Page content: /building
│   │   ├── connecting/   # Connecting content
│   │   │   └── page.tsx  # Page content: /connecting
│   │   ├── hustling/     # Hustling/entrepreneurship content
│   │   │   └── page.tsx  # Page content: /hustling
│   │   ├── investing/    # Investing content
│   │   │   └── page.tsx  # Page content: /investing
│   │   └── thinking/     # Blog/thoughts content
│   │       └── page.tsx  # Page content: /thinking
│   ├── admin/            # Admin dashboard (protected routes)
│   │   ├── admin.css     # Admin-specific styles
│   │   ├── layout.tsx    # Admin layout
│   │   ├── page.tsx      # Admin dashboard
│   │   ├── contacts/     # Contact management
│   │   ├── posts/        # Post management
│   │   ├── login/        # Admin login
│   │   └── register/     # Admin registration
│   ├── advising/         # Advisory services layout and metadata
│   │   ├── layout.tsx    # Section-specific layout
│   │   └── metadata.ts   # Section-specific metadata
│   ├── api/              # API routes for data fetching and testing
│   │   ├── auth/         # Authentication API routes
│   │   ├── contact/      # Contact form API
│   │   ├── posts/        # Posts API
│   │   ├── upload/       # File upload API
│   │   └── debug-*/      # Debug and testing APIs
│   ├── attributing/      # Attribution page
│   ├── building/         # Building/projects section
│   │   ├── layout.tsx    # Building section layout
│   │   ├── metadata.ts   # Building section metadata
│   │   ├── __tests__/    # Building section tests
│   │   ├── hopping-list/ # Hopping List project
│   │   ├── oil-price-ticker/ # Oil Price Ticker project
│   │   ├── inn/          # Inn project
│   │   ├── just-ate/     # Just Ate project
│   │   ├── occupado/     # Occupado project
│   │   └── bolt-form/    # Bolt Form project
│   ├── debugging/        # Debugging page
│   ├── hireable/         # Hireable page
│   ├── investing/        # Investing section layout and metadata
│   │   ├── layout.tsx    # Section-specific layout
│   │   └── metadata.ts   # Section-specific metadata
│   ├── professional/     # Professional page
│   ├── respecting-privacy/ # Privacy policy page
│   ├── shopping/         # Shopping page
│   ├── supatest/         # Supabase testing page
│   ├── thinking/         # Blog/thoughts main section
│   │   ├── layout.tsx    # Thinking section layout
│   │   ├── metadata.ts   # Thinking section metadata
│   │   ├── [primary-category]/ # Category-specific blog pages
│   │   │   └── [slug]/   # Individual blog post pages
│   │   └── about/        # About blog section
│   │       ├── [category]/ # Category-specific pages
│   │       │   ├── [slug]/ # Individual post pages
│   │       │   └── page.tsx # Category listing page
│   │       └── page.tsx  # About section main page
│   ├── around-here-somehwere/ # Test page
│   ├── force-logout/     # Force logout route
│   ├── logout/           # Logout route
│   ├── globals.css       # Global CSS styles with Tailwind v4 imports
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Homepage
├── components/           # Reusable UI components
│   ├── __tests__/        # Component tests
│   ├── admin/            # Admin-specific components
│   │   ├── __tests__/    # Admin component tests
│   │   ├── AdminHeader.tsx # Admin header component
│   │   ├── AdminNavigation.tsx # Admin navigation
│   │   ├── ContactsList.tsx # Contact list component
│   │   ├── DraftOverviewWidget.tsx # Draft overview widget
│   │   ├── ImageUploader.tsx # Image upload component
│   │   ├── LoginForm.tsx # Login form component
│   │   ├── PostEditor.tsx # Post editor component
│   │   ├── PostsTable.tsx # Posts table component
│   │   ├── PublishButton.tsx # Publish button component
│   │   ├── RegisterForm.tsx # Register form component
│   │   ├── SimpleImageUploader.tsx # Simple image uploader
│   │   ├── TestUploaderWrapper.tsx # Test uploader wrapper
│   │   └── TiptapEditor.tsx # Tiptap editor component
│   ├── icons/            # Icon components
│   │   ├── AdvisingIcon.tsx # Advising icon
│   │   ├── BuildingIcon.tsx # Building icon
│   │   └── InvestingIcon.tsx # Investing icon
│   ├── ui/               # UI components
│   │   ├── input.tsx     # Input component
│   │   └── tooltip.tsx   # Tooltip component
│   ├── ClientAnalytics.tsx # Client-side analytics
│   ├── ClientAnalyticsWrapper.tsx # Analytics wrapper
│   ├── ConnectCta.tsx    # Connect CTA component
│   ├── ContactForm.tsx   # Contact form component
│   ├── Footer.tsx        # Site footer
│   ├── Header.tsx        # Site header with navigation and mobile menu
│   ├── LayoutWrapper.tsx # Layout wrapper component
│   ├── MainSiteLayout.tsx # Main site layout component
│   ├── PostHogDebugger.tsx # PostHog debugger component
│   ├── PostView.tsx      # Post view component
│   ├── ProjectPageAnalytics.tsx # Project page analytics
│   ├── SafeImage.tsx     # Optimized image component with error handling
│   ├── SocialIcons.tsx   # Social icons component
│   ├── StatusMessage.tsx # Status message component
│   └── VisualLayout.tsx  # Visual layout component
├── lib/                  # Utility functions and services
│   ├── actions/          # Server actions
│   │   ├── __tests__/    # Action tests
│   │   ├── contactActions.ts # Contact form actions
│   │   └── postActions.ts # Post management actions
│   ├── analytics/        # Analytics configuration
│   │   ├── context.tsx   # Analytics context
│   │   ├── index.ts      # Analytics exports
│   │   ├── providers/    # Analytics providers
│   │   │   └── posthog.ts # PostHog provider
│   │   └── types.ts      # Analytics types
│   ├── auth/             # Authentication utilities
│   │   ├── __tests__/    # Auth tests
│   │   ├── supabase-server.ts # Supabase server auth
│   │   ├── supabase.ts   # Supabase client auth
│   │   ├── unified-auth-hook.tsx # Unified auth hook
│   │   └── unified-auth.ts # Unified auth utilities
│   ├── constants/        # Constants
│   │   └── colors.ts     # Color constants
│   ├── supabase/         # Supabase client configuration and database functions
│   │   ├── auth.ts       # Supabase auth utilities
│   │   ├── client.ts     # Supabase client setup
│   │   ├── publicClient.ts # Public Supabase client
│   │   ├── server.ts     # Supabase server utilities
│   │   └── serverClient.ts # Server Supabase client
│   ├── types/            # TypeScript type definitions
│   │   └── supabase.ts   # Supabase type definitions
│   ├── utils/            # Helper functions
│   │   ├── index.ts      # Utility exports
│   │   └── markdown.ts   # Markdown utilities
│   └── test-utils.tsx    # Test utilities
├── middleware.ts         # Next.js middleware for auth and routing
├── supabase/             # Supabase configuration and migrations
│   ├── config.toml       # Supabase configuration
│   ├── down_migrations/  # Down migration files
│   ├── functions/        # Supabase Edge Functions
│   │   └── get_service_role_access_test/ # Service role test function
│   ├── migrations/       # SQL migration files for database schema changes
│   └── migrations_backup/ # Backup migration files
└── scripts/              # Utility scripts for development and database management
    ├── create-migration.sh # Script to create new migrations with timestamps
    ├── create-posts-table.sql # Posts table creation script
    ├── fix-css.sh        # CSS fix script
    ├── run-migrations.sh # Script to run migrations up/down
    ├── setup-supabase.js # Supabase setup script
    ├── test-supabase.js  # Supabase test script
    ├── update-image-urls.js # Image URL update script
    ├── update-images.js  # Image update script
    └── upgrade.sh        # Upgrade script
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
`/thinking/about/[category]/[slug]`

**Blog Structure Details:**
- **Main Blog Section**: `/thinking` - Main blog landing page
- **About Blog Section**: `/thinking/about` - About section of the blog
- **Category Pages**: `/thinking/about/[category]` - Category listing pages
- **Individual Posts**: `/thinking/about/[category]/[slug]` - Individual blog post pages
- **Primary Category Pages**: `/thinking/[primary-category]` - Primary category pages (if used)
- **Primary Category Posts**: `/thinking/[primary-category]/[slug]` - Posts under primary categories (if used)

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