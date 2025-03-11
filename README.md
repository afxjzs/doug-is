# Doug.is - Personal Website

A modern personal website built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Modern, responsive design with Tailwind CSS
- Server-side rendering with Next.js App Router
- Dynamic content from Supabase database
- Optimized for performance with Next.js image optimization
- Mobile-friendly navigation with animated menu

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel
- **UI Components**: Radix UI
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn
- Supabase account (for database functionality)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/doug-is.git
   cd doug-is
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or use the provided script
   ./dev.sh
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `/src/app`: Next.js App Router pages and API routes
- `/src/components`: Reusable UI components
- `/src/lib`: Utility functions and services
- `/src/content`: Static content for the website

## Deployment

The project is deployed on Vercel. Any push to the main branch will trigger a new deployment.

### Environment Variables

Make sure to set the following environment variables in your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
