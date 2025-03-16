#!/bin/bash

# bun-dev.sh - Development environment setup script for doug-is project using Bun

echo "🚀 Starting development environment setup with Bun..."

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
  echo "❌ Bun is not installed. Please install it first:"
  echo "    curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

# Display Bun version
BUN_VERSION=$(bun --version)
echo "✅ Using Bun ${BUN_VERSION}"

# Clean build files and cache for fresh start
echo "🧹 Cleaning build files and cache..."
rm -rf .next
rm -rf node_modules/.cache
bun pm cache rm

# Check network connectivity to Google Fonts
echo "🔍 Checking network connectivity to Google Fonts..."
if ping -c 1 fonts.googleapis.com &> /dev/null; then
  echo "✅ Connection to Google Fonts is working"
else
  echo "⚠️ Warning: Cannot connect to Google Fonts. Font loading may fail."
fi

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

# Install dependencies if needed using Bun
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies with Bun..."
  bun install
fi

# Set performance optimization environment variables
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=4096"

# Start development server with Bun
echo "🌐 Starting Next.js development server with Bun..."
bun --bun run dev 