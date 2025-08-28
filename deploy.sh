#!/bin/bash

# Sokoban Game Deployment Script
# This script helps you deploy your game to various platforms

set -e  # Exit on any error

echo "🎮 Sokoban Game Deployment Helper"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -f "sokoban.js" ]; then
    echo "❌ Error: Please run this script from the webgame directory"
    echo "Expected files: index.html, sokoban.js"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "📋 Available deployment options:"
echo ""
echo "1. GitHub Pages (setup Git repository)"
echo "2. Netlify (requires Netlify CLI)"
echo "3. Vercel (requires Vercel CLI)"
echo "4. Surge.sh (requires Surge CLI)"
echo "5. Test locally"
echo ""

read -p "Choose an option (1-5): " choice

case $choice in
    1)
        echo "🔄 Setting up Git repository for GitHub Pages..."
        
        # Check if git is initialized
        if [ ! -d ".git" ]; then
            git init
            echo "✅ Git repository initialized"
        fi
        
        # Add files
        git add .
        git commit -m "Deploy Sokoban web game" || echo "ℹ️  No changes to commit"
        
        echo ""
        echo "📋 Next steps for GitHub Pages:"
        echo "1. Create a repository on GitHub"
        echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
        echo "3. Run: git push -u origin main"
        echo "4. Enable GitHub Pages in repository settings"
        echo ""
        ;;
    
    2)
        echo "🚀 Deploying to Netlify..."
        
        # Check if Netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            echo "❌ Netlify CLI not found. Installing..."
            npm install -g netlify-cli
        fi
        
        echo "🔄 Deploying to Netlify..."
        netlify deploy --prod --dir .
        echo "✅ Deployed to Netlify!"
        ;;
    
    3)
        echo "🚀 Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "❌ Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        
        echo "🔄 Deploying to Vercel..."
        vercel --prod
        echo "✅ Deployed to Vercel!"
        ;;
    
    4)
        echo "🚀 Deploying to Surge.sh..."
        
        # Check if Surge CLI is installed
        if ! command -v surge &> /dev/null; then
            echo "❌ Surge CLI not found. Installing..."
            npm install -g surge
        fi
        
        echo "🔄 Deploying to Surge..."
        surge .
        echo "✅ Deployed to Surge!"
        ;;
    
    5)
        echo "🖥️  Starting local server..."
        echo "🌐 Game will be available at: http://localhost:8000"
        echo "📱 Press Ctrl+C to stop the server"
        echo ""
        
        # Try different server options
        if command -v python3 &> /dev/null; then
            python3 -m http.server 8000
        elif command -v python &> /dev/null; then
            python -m http.server 8000
        elif command -v npx &> /dev/null; then
            npx serve . -p 8000
        else
            echo "❌ No suitable server found. Please install Python or Node.js"
            exit 1
        fi
        ;;
    
    *)
        echo "❌ Invalid option. Please choose 1-5."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo "📖 For more detailed instructions, see DEPLOYMENT.md"
