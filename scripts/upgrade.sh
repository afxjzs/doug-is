#!/bin/bash

# Upgrade script for doug-is project to Next.js 15, React 19, and Tailwind CSS v4
echo "🚀 Starting upgrade process to Next.js 15, React 19, and Tailwind CSS v4..."

# Load nvm first if it exists
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Check if nvm is available after loading
if ! type nvm > /dev/null 2>&1; then
    echo "❌ nvm not found. Please install it first:"
    echo "    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "After installing, close and reopen your terminal, or run:"
    echo "    export NVM_DIR=\"\$HOME/.nvm\""
    echo "    [ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\""
    exit 1
fi

# Install and use the correct Node.js version
echo "📦 Installing Node.js 22.14.0..."
nvm install 22.14.0
nvm use 22.14.0

# Verify Node.js version
NODE_VERSION=$(node -v)
echo "✅ Using Node.js ${NODE_VERSION}"

# Clean up old build artifacts and dependencies
echo "🧹 Cleaning up old files..."
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json
rm -rf yarn.lock
rm -rf bun.lockb

# Create .nvmrc file if it doesn't exist
echo "22.14.0" > .nvmrc
echo "✅ Created .nvmrc file"

# Install dependencies with force flag to handle peer dependency issues
echo "📦 Installing dependencies for Next.js 15, React 19, and Tailwind CSS v4..."
npm install --force

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "⚠️ There were some issues with dependency installation."
    echo "Trying again with --legacy-peer-deps..."
    npm install --legacy-peer-deps
    
    if [ $? -ne 0 ]; then
        echo "❌ Dependency installation failed."
        echo "Please check your package.json for compatibility issues."
        exit 1
    fi
fi

# Only run these steps if npm install was successful
if [ -d "node_modules" ]; then
    # Run type check using the locally installed TypeScript
    echo "🔍 Running type check..."
    if [ -f "node_modules/.bin/tsc" ]; then
        node_modules/.bin/tsc --noEmit || echo "⚠️ TypeScript check failed, but continuing with upgrade."
    else
        echo "⚠️ TypeScript not found in node_modules. Skipping type check."
    fi

    # Run lint
    echo "🧪 Running lint..."
    npm run lint || echo "⚠️ Linting failed, but continuing with upgrade."
else
    echo "⚠️ node_modules directory not found. Skipping type check and lint."
fi

echo "✅ Upgrade process completed!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server with Turbopack"
echo "2. Check for any TypeScript errors and fix them"
echo "3. Test all functionality with React 19"
echo "4. Update components to use new React 19 features"
echo "5. Test the production build with 'npm run build'"
echo ""
echo "Note: You may need to update your code to be compatible with React 19 and Next.js 15."
echo "Refer to the migration guides for more information:"
echo "- Next.js: https://nextjs.org/docs/app/building-your-application/upgrading"
echo "- React: https://react.dev/blog/2023/03/16/introducing-react-19"
echo "- Tailwind CSS: https://tailwindcss.com/docs/upgrade-guide" 