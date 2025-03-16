# Next.js 15 + Tailwind v4 + React 19 Configuration Guide

This document outlines the specific versions and configuration details used in a working project, featuring Next.js 15, Tailwind CSS v4, and React 19.

## Core Dependencies

### Node.js
- Version: 22.14.0 (Required)
- Use `nvm` to manage Node versions:
```bash
nvm install 22.14.0
nvm use 22.14.0
```

### Next.js and React
- Next.js: 15.2.2
- React: ^19.0.0
- React DOM: ^19.0.0

### Tailwind CSS
- Version: ^4.0.0 (NOT alpha/beta versions)
- Dependencies:
  - `@tailwindcss/postcss`: ^4.0.14 (Note: This is the new plugin location for v4)
  - `postcss`: ^8.4.35

## Key Features
- Uses Next.js App Router
- Turbopack enabled for development
- React 19 features support
- Tailwind CSS v4 with improved performance
- TypeScript 5.3+ support

## Configuration Files

### package.json
```json
{
  "name": "your-project-name",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "debug-build": "next build --debug",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@heroicons/react": "^2.2.0",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-slot": "^1.1.2",
    "@vercel/analytics": "^1.5.0",
    "@vercel/og": "^0.6.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.5.0",
    "lucide-react": "^0.479.0",
    "next": "15.2.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sharp": "^0.33.5",
    "sonner": "^2.0.1",
    "tailwind-merge": "^3.0.2",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4.0.14",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.2.2",
    "postcss": "^8.4.35",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.3.3"
  }
}
```

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Performance optimization for page caching
    staleTimes: {
      dynamic: 30,  // Cache dynamic pages for 30 seconds
      static: 180,  // Cache static pages for 3 minutes
    },
  },
};

module.exports = nextConfig;
```

### postcss.config.js
```javascript
/**
 * PostCSS Configuration for Next.js 15 with Tailwind CSS v4
 *
 * In Tailwind CSS v4, the PostCSS plugin has moved to @tailwindcss/postcss
 * This is different from Tailwind v3 which used 'tailwindcss' directly
 *
 * Note: We're using CommonJS module.exports format for better compatibility
 * with Next.js build system rather than ESM export default
 */
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}, // The new plugin location for Tailwind CSS v4
  },
};
```

### tailwind.config.ts
```typescript
/**
 * Tailwind CSS v4 Configuration for Next.js 15
 *
 * - This is a minimal configuration since most theme settings now live in CSS
 * - In Tailwind v4, theme customization is done via @theme directive in CSS
 * - This file only specifies content paths and plugins
 * - The content array tells Tailwind which files to scan for classes
 * - TypeScript configuration is fully compatible with Node 22+
 */
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	plugins: [tailwindcssAnimate], // Using ESM import for plugins (Node 22 compatible)
};

export default config;
```

### globals.css
```css
/**
 * Global CSS for Next.js 15 with Tailwind CSS v4
 */

@import "tailwindcss";

/* Custom variables */
:root {
  /* Your CSS variables here */
}

/* Your other CSS styles */
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Project Structure
```
src/
├── app/          # Next.js 15 App Router pages
├── components/   # React components
├── config/       # Configuration files
└── lib/         # Utility functions and shared code
```

## Tailwind CSS v4 Upgrade Guide

### 1. Update Dependencies
Update your `package.json` to use the stable Tailwind v4 versions:

```json
"devDependencies": {
  "@tailwindcss/postcss": "^4.0.14",  // Not alpha/beta versions
  "postcss": "^8.4.35",
  "tailwindcss": "^4.0.0",            // Not alpha/beta versions
}
```

### 2. Update CSS Import Syntax
In your global CSS file (typically `src/app/globals.css`), replace the old Tailwind v3 directives:

```css
/* OLD Tailwind v3 syntax - DO NOT USE with v4 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

With the new v4 import:

```css
/* NEW Tailwind v4 syntax - REQUIRED */
@import "tailwindcss";
```

### 3. Update PostCSS Configuration
Replace your PostCSS configuration with the v4 setup:

```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}, // The new plugin location for Tailwind CSS v4
  },
};
```

### 4. Theme Configuration Changes
In Tailwind v4, theme customization is done primarily via CSS using the `@theme` directive, rather than in the JS config:

```css
/* In your globals.css */
@import "tailwindcss";

@theme {
  --primary: 265 85% 65%;
  --secondary: 265 70% 40%;
  /* other theme values */
}
```

### 5. Clear Cache and Restart
After making these changes:

```bash
# Remove node_modules and cache
rm -rf .next node_modules
npm cache clean --force

# Fresh install and restart
npm install
npm run dev
```

## Common Tailwind v4 Issues and Solutions

### CSS Not Working
- Make sure you're using `@import "tailwindcss"` instead of `@tailwind` directives
- Verify you're using stable v4 releases (^4.0.0, not alpha/beta)
- Check that the PostCSS plugin is correctly configured to `@tailwindcss/postcss`
- Clear the `.next` cache after making CSS-related changes

### Classes Not Applying
- Verify your content array in `tailwind.config.ts` includes all relevant files
- Check for typos in class names (Tailwind v4 has some naming changes)
- Inspect generated CSS in browser developer tools

### Build Errors
- Make sure all dependencies are compatible (Next.js 15, Tailwind v4, React 19)
- Check Node.js version (22.14.0+ recommended)
- Remove any Tailwind v3 specific plugins or configurations

## Upgrading Existing Projects

1. **Prerequisites**
```bash
# Create .nvmrc file
echo "22.14.0" > .nvmrc

# Setup Node version
nvm install 22.14.0
nvm use 22.14.0
```

2. **Update package.json**
- Update core dependencies:
  ```json
  {
    "next": "15.2.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
  ```
- Update Tailwind:
  ```json
  {
    "@tailwindcss/postcss": "^4.0.14",
    "tailwindcss": "^4.0.0"
  }
  ```

3. **Update Configuration Files**
- Replace postcss.config.js with the new configuration
- Update globals.css with the new import syntax
- Simplify tailwind.config.ts if needed
- Update next.config.js with new features
- Update tsconfig.json for bundler moduleResolution

4. **Clean and Rebuild**
```bash
# Remove existing build artifacts and dependencies
rm -rf .next node_modules

# Fresh install
npm install

# Development with Turbopack
npm run dev

# Production build
npm run build
```

## Breaking Changes to Watch For

### Next.js 15
- App Router is now the default
- New bundler and improved performance
- Turbopack is the recommended dev server
- New experimental staleTimes feature

### React 19
- New hooks and features
- Improved performance
- Better error handling
- Enhanced server components

### Tailwind CSS v4
- PostCSS plugin moved to `@tailwindcss/postcss`
- CSS import syntax changed from `@tailwind` directives to `@import "tailwindcss"`
- Theme customization moved to CSS via `@theme` directive
- Breaking changes in utility classes and naming
- Improved performance and reduced bundle size

## Development Commands

```bash
# Development with Turbopack
npm run dev

# Debug build issues
npm run debug-build

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```
