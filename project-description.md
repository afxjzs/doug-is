# Doug.is - Personal Website

## Project Overview
This is a personal website for Doug Rogers, built with Next.js 14, React, TypeScript, Tailwind CSS, and Supabase. The site showcases Doug's work as a developer, investor, and entrepreneur.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel
- **UI Components**: Radix UI
- **Analytics**: Vercel Analytics

## Project Structure

### `/src/app`
Contains the Next.js App Router pages and API routes:
- `/api`: API routes for data fetching and testing
- Various route directories for different sections of the site (e.g., `/thinking`, `/building`, `/investing`)
- `/contact`: Contact page with form for user messages
- `layout.tsx`: Root layout with global styles and components
- `page.tsx`: Homepage

### `/src/components`
Reusable UI components:
- `Header.tsx`: Navigation header with mobile menu
- `Footer.tsx`: Site footer
- `Navigation.tsx`: Navigation links
- `SafeImage.tsx`: Optimized image component
- `ContactForm.tsx`: Form component for contact page

### `/src/lib`
Utility functions and services:
- `/supabase`: Supabase client configuration
- `/types`: TypeScript type definitions
- `/utils`: Helper functions

### `/src/content`
Static content for the website.

### `/supabase`
Supabase configuration and database migrations:
- `/migrations`: SQL migration files for database schema changes
- `config.toml`: Supabase configuration

### `/scripts`
Utility scripts for development and database management:
- `create-migration.sh`: Helper script to create new migrations
- `run-migrations.sh`: Helper script to run migrations up/down
- `dev.sh`: Development environment setup script

## Key Features
- Modern, responsive design with Tailwind CSS
- Server-side rendering with Next.js App Router
- Dynamic content from Supabase database
- Optimized for performance with Next.js image optimization
- Mobile-friendly navigation with animated menu

## Development Workflow
- Use `bun --bun run dev` for local development (preferred method for fastest performance)
- Alternatively, use `./dev.sh` for optimized Node.js setup
- Or use `npm run dev` directly (slowest option)
- Deployment is handled through Vercel
- Environment variables for Supabase are required for database functionality

## Performance Optimizations
- Font optimization with next/font
- Image optimization with next/image
- Minimized client-side JavaScript
- Server components for improved performance
- Optimized build configuration in next.config.js 

## Database Management

The project uses Supabase for database storage with a structured migration system. The database includes:

- **Posts Table**: Stores blog posts with categories and content
- **Contact Messages Table**: Stores submissions from the contact form

All tables use Row Level Security (RLS) policies to control access based on user authentication. 