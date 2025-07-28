#!/bin/bash

# Development script for Auto Prompter Extension

echo "🤖 Auto Prompter Extension - Development Setup"
echo "=============================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Node.js
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check for npm
if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Build the extension
echo "🔨 Building extension..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Extension built successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Open Brave browser"
    echo "2. Go to brave://extensions/"
    echo "3. Enable 'Developer mode'"
    echo "4. Click 'Load unpacked'"
    echo "5. Select the 'dist' folder"
    echo ""
    echo "🚀 For development with auto-rebuild:"
    echo "   npm run dev"
    echo ""
    echo "🧪 Test sites:"
    echo "   - https://chat.openai.com"
    echo "   - https://claude.ai"
    echo "   - https://bard.google.com"
else
    echo "❌ Build failed! Check the error messages above."
    exit 1
fi
