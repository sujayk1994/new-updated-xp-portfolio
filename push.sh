#!/bin/bash

echo "================================"
echo "  Push to GitHub"
echo "================================"
echo ""

if ! git remote get-url origin > /dev/null 2>&1; then
    echo "Error: No remote repository configured."
    echo "Please set up your GitHub remote first."
    exit 1
fi

read -p "Enter commit message (or press Enter for default): " message
if [ -z "$message" ]; then
    message="Update from Replit - $(date '+%Y-%m-%d %H:%M')"
fi

echo ""
echo "Adding all changes..."
git add -A

echo "Creating commit..."
git commit -m "$message"

echo ""
echo "Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "================================"
    echo "  Successfully pushed to GitHub!"
    echo "================================"
else
    echo ""
    echo "Push failed. You may need to:"
    echo "1. Check your GitHub authentication"
    echo "2. Make sure you have write access to the repository"
fi
