# doug.is - Personal Website Project

## Project Overview

This is a personal website for Douglas Rogers built with Next.js 15.2.4, React 19, Supabase, and Tailwind CSS v4. The site features a modern, cyberpunk-inspired design with neon accents and follows a content-first approach. It serves as a platform for sharing thoughts, projects, and professional information while showcasing Doug's work as a developer, investor, and entrepreneur.

## Tech Stack

- **Framework**: Next.js ^15.2.4 with App Router
- **Language**: TypeScript
- **Frontend**: React ^19.0.0
- **Styling**: Tailwind CSS ^4.0.0 with PostCSS ^4.0.14
- **Database**: Supabase (Local Development + Production)
- **Deployment**: Vercel
- **UI Components**: Radix UI
- **Analytics**: Vercel Analytics + PostHog + Google Analytics (GA4)
- **Node.js**: >=20.11.1

## Database Architecture

### Environment-Based Database Selection

The project implements a sophisticated database separation strategy that automatically switches between local and production databases based on the environment:

**Local Development Environment**:
- **Database**: Local Supabase instance running on Docker
- **Ports**: API (54321), Database (54322), Studio (54323), Auth (54324)
- **URLs**: http://127.0.0.1:54321 (API), http://127.0.0.1:54323 (Studio)
- **Data**: Local copy of production data for development and testing

**Production Environment**:
- **Database**: Remote Supabase project (tzffjzocrazemvtgqavg.supabase.co)
- **URLs**: Production Supabase project URLs
- **Data**: Live production data

**Automatic Environment Detection**:
- **Local**: Automatically detected when running `npm run dev` or `./start.sh`
- **Production**: Automatically detected in Vercel deployment environment
- **Fallback**: Graceful fallback to production database if local instance unavailable

### Data Synchronization

**Local to Production Sync**:
- **Pull**: Scripts to copy production data to local database
- **Push**: Mechanisms to deploy local changes to production
- **Conflict Resolution**: Safe handling of data conflicts during synchronization
- **Schema Sync**: Automatic schema comparison and migration

**Migration Management**:
- **Unified Migrations**: Single migration system that works on both environments
- **Schema Comparison**: Tools to detect and resolve schema differences
- **Safe Deployment**: Validation before pushing changes to production

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

### Local Supabase Setup
```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Start local Supabase services
supabase start

# Access local services:
# - Studio: http://127.0.0.1:54323
# - API: http://127.0.0.1:54321
# - Database: localhost:54322

# Stop local services
supabase stop

# Reset local database (WARNING: deletes all local data)
supabase db reset
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
- **Local Development**: Local Supabase instance for isolated development
- **Data Synchronization**: Scripts to sync data between local and production

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
7. **Database Separation**: Automatic local vs production database selection
8. **Data Synchronization**: Safe data sync between development and production

## Environment Variables

### Required Environment Variables

**Local Development (.env.local)**:
```bash
# Local Supabase (for development)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key

# Production Supabase (for reference and fallback)
NEXT_PUBLIC_SUPABASE_URL_PROD=https://tzffjzocrazemvtgqavg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY_PROD=your_production_service_role_key
```

**Production (Vercel Environment Variables)**:
```bash
# Production Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tzffjzocrazemvtgqavg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

**Analytics Configuration**:
```bash
# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Google Analytics (GA4) - automatically configured
# No environment variables needed - hardcoded tracking ID G-RVQRV9JEND
```

### Environment Detection

The application automatically detects the environment and selects the appropriate database:

- **Local Development**: Automatically uses local Supabase instance
- **Production**: Automatically uses production Supabase project
- **Fallback**: Gracefully falls back to production if local instance unavailable

## Deployment and Infrastructure

### Vercel Deployment
- **Automatic Deployments**: Triggered on main branch pushes
- **Environment Variables**: Configured in Vercel dashboard
- **Analytics**: Vercel Analytics integrated for performance monitoring
- **Build Optimization**: Configured for standalone output

### Database Management
- **Migration System**: Use Supabase CLI for database migrations
- **Backup Strategy**: Regular database backups via Supabase dashboard
- **Monitoring**: Use Supabase logs and analytics for database monitoring
- **Local Development**: Local Supabase instance for isolated development
- **Data Sync**: Scripts to synchronize data between environments

## Further Reading
For in-depth best practices, refer to:
-   `.cursor/rules/nextjs.mdc` for Next.js 15, App Router, and React 19 patterns.
-   `.cursor/rules/tailwind4.mdc` for the CSS-first v4 syntax and theme setup.
-   `.cursor/rules/supabase.mdc` for data access patterns and security architecture.
-   `.cursor/rules/testing.mdc` for comprehensive testing strategies and workflows. 