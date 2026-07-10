#!/bin/bash

# Siraj Hackathon - GitHub Pages Deploy Script
# This script automates GitHub Pages deployment
# Usage: bash deploy.sh

echo "🚀 Siraj Hackathon - GitHub Pages Deployment Setup"
echo "=================================================="
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   macOS: brew install git"
    echo "   Windows: Download from https://git-scm.com/download/win"
    echo "   Linux: sudo apt-get install git"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Get GitHub username
read -p "📝 Enter your GitHub username: " GITHUB_USERNAME
read -p "📝 Enter your GitHub token (or press Enter to skip): " GITHUB_TOKEN

# Clone or create repo
REPO_NAME="siraj-hackathon"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "📂 Setting up repository..."

if [ -d "$REPO_NAME" ]; then
    echo "Repository already exists. Updating..."
    cd "$REPO_NAME"
    git pull origin main
else
    echo "Cloning repository..."
    if [ ! -z "$GITHUB_TOKEN" ]; then
        git clone "https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    else
        git clone "$REPO_URL"
    fi
    cd "$REPO_NAME"
fi

echo "✅ Repository ready"
echo ""

# Copy HTML file
if [ -f "siraj-hackathon.html" ]; then
    echo "✅ siraj-hackathon.html already exists"
else
    echo "⚠️  siraj-hackathon.html not found in current directory"
    echo "   Please place siraj-hackathon.html in this directory"
    read -p "   Press Enter once the file is placed..."
    
    if [ ! -f "siraj-hackathon.html" ]; then
        echo "❌ File not found. Exiting."
        exit 1
    fi
fi

echo ""
echo "📤 Committing and pushing to GitHub..."

git add siraj-hackathon.html
git commit -m "Add Siraj hackathon landing page" || echo "ℹ️  No changes to commit"
git push origin main

echo ""
echo "✅ Pushed to GitHub!"
echo ""
echo "🌐 Your live URL:"
echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME/siraj-hackathon.html"
echo ""
echo "📋 Next steps:"
echo "   1. Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "   2. Under 'Source', select 'main' branch and '/' folder"
echo "   3. Click Save"
echo "   4. Wait 1-2 minutes for deployment"
echo "   5. Share your live URL with the team!"
echo ""
echo "🎉 Done! Your page will be live shortly."
