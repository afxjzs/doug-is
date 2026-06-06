#!/bin/bash

#start.sh - Development environment setup script for doug-is project

echo "🚀 Starting development environment setup..."

# Check Node.js version
echo "📦 Setting up Node.js environment..."
if command -v nvm &> /dev/null; then
  nvm use || nvm use 22
else
  echo "⚠️ nvm not found, using system Node"
fi

# Display Node.js version
NODE_VERSION=$(node -v)
echo "✅ Using Node.js ${NODE_VERSION}"

# Clean build files and cache for fresh start
echo "🧹 Cleaning build files and cache..."
rm -rf .next
rm -rf node_modules/.cache

# Check for environment variables
if [ ! -f .env.local ]; then
  echo "⚠️ No .env.local file found. Creating from example..."
  if [ -f .env.example ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from example"
  else
    echo "❌ No .env.example file found. Please create .env.local manually."
    touch .env.local
  fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Set performance optimization environment variables
export NODE_OPTIONS="--max-old-space-size=4096"
export NEXT_TELEMETRY_DISABLED=1

# Kill any existing processes on port 3000
kill $(lsof -t -i:3000) 2>/dev/null || true

# Start development server with optimizations
echo "🌐 Starting Next.js development server with optimizations..."
npm run dev -- --turbo
