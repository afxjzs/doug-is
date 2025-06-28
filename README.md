# Doug.is - Personal Website

A modern personal website built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Modern, responsive design with Tailwind CSS
- Server-side rendering with Next.js App Router
- Dynamic content from Supabase database
- Optimized for performance with Next.js image optimization
- Mobile-friendly navigation with animated menu

## Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel
- **UI Components**: Radix UI
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 20.11.1 or later
- pnpm (recommended) or npm/yarn
- Supabase account (for database functionality)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/doug-is.git
   cd doug-is
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
	 chmod +x ./start.sh
   ./start.sh
   ```

5. Open [http://localhost:5001](http://localhost:5001) in your browser to see the result.

## Project Structure

- `/src/app`: Next.js App Router pages and API routes
- `/src/components`: Reusable UI components
- `/src/lib`: Utility functions and services
- `/src/content`: Static content for the website
- `/supabase`: Supabase configuration and migrations
- `/scripts`: Utility scripts for development and database management

## Database Schema and Migrations

The project uses a simplified single-file migration approach for Supabase. The complete schema is defined in `/supabase/migrations/20000000000000_schema_setup.sql`.

### Database Reset and Migrations

If you need to reset your database and apply the migration:

1. Reset your database (WARNING: this will delete all data):
   ```sql
   -- Run this in Supabase SQL Editor
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
   ```

2. Apply the migration:
   ```bash
   # Make sure you've logged in and linked your project first
   supabase login
   supabase link --project-ref tzffjzocrazemvtgqavg
   
   # Push migrations
   supabase db push
   ```

### Database Tables

The schema includes these main tables:
- `posts`: Blog posts with title, content, and publishing status
- `contact_messages`: Contact form submissions 
- `user_roles`: User role assignments for access control

## Deployment

The project is deployed on Vercel. Any push to the main branch will trigger a new deployment.

### Environment Variables

Make sure to set the following environment variables in your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Testing

This project includes a comprehensive testing setup with Jest, React Testing Library, and Playwright for different types of testing.

### Test Setup

- **Unit/Component Tests**: Jest with React Testing Library
- **Test Environment**: jsdom for browser-like testing
- **Coverage**: Enabled with detailed reporting
- **Mocking**: Custom utilities for Supabase and Next.js features
- **E2E Testing**: Playwright (available but needs configuration)

### Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (recommended for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

### Test Structure

Tests are located in `__tests__` directories alongside the components they test:

```
src/
├── components/
│   ├── __tests__/
│   │   └── StatusMessage.test.tsx
│   └── admin/
│       └── __tests__/
│           ├── LoginForm.test.tsx
│           └── PostsTable.test.tsx
```

### Writing Tests

The project uses custom test utilities located in `src/lib/test-utils.tsx` that provide:

- **Supabase Mocking**: Pre-configured mocks for Supabase client operations
- **Next.js Mocking**: Mocks for navigation, routing, and images
- **Custom Render**: Enhanced render function with provider setup

Example test:

```typescript
import { render, screen } from '@/lib/test-utils'
import { setupSupabaseMock } from '@/lib/test-utils'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    setupSupabaseMock()
  })

  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected text')).toBeInTheDocument()
  })
})
```

### Test Configuration

- **Jest Config**: `jest.config.ts` - Configured for Next.js with path mapping
- **Setup File**: `jest.setup.ts` - Global test setup and mocks
- **Coverage**: Collects from all `src/**/*.{ts,tsx}` files except API routes and type definitions

### Coverage Reports

After running `pnpm test:coverage`, coverage reports are generated in the `coverage/` directory:

- `coverage/lcov-report/index.html` - Detailed HTML coverage report
- `coverage/lcov.info` - LCOV format for CI/CD integration

### Adding New Tests

1. Create a `__tests__` directory next to your component
2. Name your test file `ComponentName.test.tsx`
3. Import testing utilities from `@/lib/test-utils`
4. Use `setupSupabaseMock()` for components that interact with Supabase
5. Follow the existing test patterns for consistency

### E2E Testing Setup (Future)

Playwright is installed but not yet configured. To set up E2E testing:

1. Create `playwright.config.ts` in the project root
2. Add E2E test scripts to `package.json`
3. Create `tests/` directory for E2E test files

## Development

First, run the development server:

```bash
chmod +x start.sh
./start.sh
```

Open [http://localhost:5001](http://localhost:5001) with your browser to see the result.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
