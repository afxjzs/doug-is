#!/bin/bash

# Fix CSS issues for Tailwind CSS v4 with Next.js 15
echo "🚀 Starting CSS fix process..."

# Clean up Next.js cache and build files
echo "🧹 Cleaning up Next.js cache and build files..."
rm -rf .next
rm -rf node_modules/.cache

# Clean up and reinstall Tailwind CSS and PostCSS
echo "📦 Reinstalling Tailwind CSS v4 alpha and dependencies..."
npm remove tailwindcss @tailwindcss/postcss
npm install --save-dev tailwindcss@4.0.0-alpha.2 @tailwindcss/postcss@4.0.0-alpha.2

# Create a simple postcss.config.js file
echo "📝 Creating a simple postcss.config.js file..."
cat > postcss.config.js << EOL
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      config: './tailwind.config.js',
    },
  },
}
EOL

# Create a simple tailwind.config.js file
echo "📝 Creating a simple tailwind.config.js file..."
cat > tailwind.config.js << EOL
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        black: "#000000",
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
    },
  },
  corePlugins: {
    preflight: true,
  },
}
EOL

# Create a simple test CSS file
echo "📝 Creating a test globals.css file..."
cat > src/app/globals.css.new << EOL
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: black;
  color: white;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
}
EOL

echo "✅ CSS fix process completed!"
echo ""
echo "Next steps:"
echo "1. Test the site with the simplified CSS by renaming:"
echo "   mv src/app/globals.css.new src/app/globals.css"
echo "2. Run 'npm run dev' to start the development server"
echo "3. If the basic styling works, gradually add back your custom styles" 