# Doug.is

Personal website built with Next.js, Supabase, and Tailwind CSS.

## Features

- Vaporwave/chillwave themed design
- Blog with categories
- Admin interface for content management
- Responsive design

## Getting Started

### Prerequisites

- Node.js 20.18.3 or later
- Supabase account

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

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Setting Up Supabase Tables

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `scripts/create-posts-table.sql`
4. Paste and run the SQL in the Supabase SQL Editor

This will:
- Create the `posts` table with the required schema
- Set up Row Level Security policies
- Insert sample blog posts

### Setting Up Supabase Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Enable Email/Password sign-in method
3. Go to Users and create a new user with your email and password

### Running the Development Server

```bash
./dev.sh
```

This script ensures the correct Node.js version is used and cleans up build files before starting the server.

## Admin Interface

The admin interface is available at `/admin`. You'll need to sign in with the Supabase credentials you created.

## Folder Structure

- `/src/app` - Next.js app router pages
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and Supabase client
- `/public` - Static assets
- `/scripts` - Database setup scripts

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify your Supabase credentials in `.env.local`
2. Check if the `posts` table exists in your Supabase project
3. Run the SQL script in `scripts/create-posts-table.sql` if needed

### Next.js Build Issues

If you encounter build issues:

1. Delete the `.next` directory
2. Run `./dev.sh` to start with a clean build

## License

MIT
