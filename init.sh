#!/bin/bash

echo "================================"
echo "  Windows XP Simulator"
echo "  One-Command Initialize & Run"
echo "================================"
echo ""

download_lfs_files() {
    REPO="sujayk1994/new-updated-xp-portfolio"
    BRANCH="main"
    BASE_URL="https://media.githubusercontent.com/media/${REPO}/${BRANCH}"
    
    LFS_FILES=$(find static -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.mp3" -o -name "*.mp4" -o -name "*.pdf" -o -name "*.zip" -o -name "*.wasm" \) -size -200c 2>/dev/null)
    
    if [ -n "$LFS_FILES" ]; then
        echo "Downloading media files from repository..."
        count=0
        total=$(echo "$LFS_FILES" | wc -l)
        
        while IFS= read -r file; do
            if [ -n "$file" ]; then
                url="${BASE_URL}/${file}"
                curl -sL "$url" -o "$file" &
                count=$((count + 1))
                
                if (( count % 10 == 0 )); then
                    wait
                    echo "  Downloaded $count/$total files..."
                fi
            fi
        done <<< "$LFS_FILES"
        
        wait
        echo "  Downloaded all $total media files."
        echo ""
    fi
}

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "Failed to install dependencies."
        exit 1
    fi
    echo ""
fi

test_file="static/images/xp_loading_logo.jpg"
if [ -f "$test_file" ] && [ $(stat -c%s "$test_file" 2>/dev/null || stat -f%z "$test_file" 2>/dev/null) -lt 200 ]; then
    download_lfs_files
fi

echo "Starting development server on port 5000..."
echo ""
npm run dev
