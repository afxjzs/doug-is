#!/bin/bash

# Start development environment setup
echo "🚀 Starting development environment setup..."

# Setup Node.js environment
echo "📦 Setting up Node.js environment..."
if command -v nvm &> /dev/null; then
  nvm use 20
else
  echo "⚠️ nvm not found, using system Node"
fi
node_version=$(node -v)
echo "✅ Using Node.js ${node_version}"

# Clean build files and cache
echo "🧹 Cleaning build files and cache..."
rm -rf .next

# Start Next.js development server
echo "🌐 Starting Next.js development server..."
bun run dev
