#!/bin/bash

# Start development environment setup
echo "🚀 Starting development environment setup..."

# Setup Node.js environment
echo "📦 Setting up Node.js environment..."
REQUIRED_NODE_VERSION="18.17.0"

if command -v nvm &> /dev/null; then
  # Use .nvmrc file if it exists
  if [ -f .nvmrc ]; then
    echo "📄 Found .nvmrc file, using specified version"
    nvm use
  else
    echo "🔄 Using nvm to switch to Node.js ${REQUIRED_NODE_VERSION}"
    nvm use ${REQUIRED_NODE_VERSION} || nvm install ${REQUIRED_NODE_VERSION}
  fi
else
  echo "⚠️ nvm not found, using system Node"
  
  # Check if system Node version meets requirements
  CURRENT_NODE_VERSION=$(node -v | cut -d 'v' -f 2)
  if [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$CURRENT_NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE_VERSION" ]; then
    echo "❌ Error: Node.js version ${CURRENT_NODE_VERSION} is less than required version ${REQUIRED_NODE_VERSION}"
    echo "Please upgrade Node.js or install nvm: https://github.com/nvm-sh/nvm"
    exit 1
  fi
fi

node_version=$(node -v)
echo "✅ Using Node.js ${node_version}"

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
  echo "❌ Error: Bun is not installed"
  echo "Please install Bun: https://bun.sh/docs/installation"
  exit 1
fi

bun_version=$(bun --version)
echo "✅ Using Bun ${bun_version}"

# Clean build files and cache
echo "🧹 Cleaning build files and cache..."
rm -rf .next

# Start Next.js development server with Bun
echo "🌐 Starting Next.js development server with Bun..."
bun run bun-dev
