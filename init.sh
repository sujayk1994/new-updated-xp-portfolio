#!/bin/bash

echo "========================================"
echo "  Windows XP Portfolio Simulator"
echo "========================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

download_lfs_files() {
    REPO="sujayk1994/new-updated-xp-portfolio"
    BRANCH="main"
    BASE_URL="https://media.githubusercontent.com/media/${REPO}/${BRANCH}"
    
    LFS_FILES=$(find static -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.mp3" -o -name "*.mp4" -o -name "*.pdf" -o -name "*.zip" -o -name "*.wasm" \) -size -200c 2>/dev/null)
    
    if [ -n "$LFS_FILES" ]; then
        echo -e "${YELLOW}Downloading media files...${NC}"
        failed=0
        count=0
        total=$(echo "$LFS_FILES" | wc -l)
        
        while IFS= read -r file; do
            if [ -n "$file" ]; then
                url="${BASE_URL}/${file}"
                if ! curl -sfL "$url" -o "$file" 2>/dev/null; then
                    echo -e "${YELLOW}  Warning: Could not download $file${NC}"
                    failed=$((failed + 1))
                fi
                count=$((count + 1))
                
                if (( count % 20 == 0 )); then
                    echo "  Progress: $count/$total files..."
                fi
            fi
        done <<< "$LFS_FILES"
        
        if [ "$failed" -gt 0 ]; then
            echo -e "${YELLOW}  Downloaded with $failed warnings (some files may be missing).${NC}"
        else
            echo -e "${GREEN}  Downloaded $total media files.${NC}"
        fi
    fi
}

setup_database() {
    if [ -n "$DATABASE_URL" ]; then
        echo "Setting up database..."
        if node scripts/setup-db.js 2>/dev/null; then
            echo -e "${GREEN}Database ready.${NC}"
        else
            echo -e "${YELLOW}Database setup had issues (app will still run).${NC}"
        fi
    fi
}

install_dependencies() {
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        if ! npm install --silent; then
            echo -e "${RED}Failed to install dependencies.${NC}"
            exit 1
        fi
        echo -e "${GREEN}Dependencies installed.${NC}"
    else
        npm install --prefer-offline --silent 2>/dev/null || true
    fi
}

check_lfs_files() {
    lfs_count=$(find static -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.mp3" -o -name "*.mp4" -o -name "*.pdf" -o -name "*.zip" -o -name "*.wasm" \) -size -200c 2>/dev/null | wc -l)
    if [ "$lfs_count" -gt 0 ]; then
        download_lfs_files
    fi
}

echo "Initializing..."
install_dependencies
check_lfs_files
setup_database

echo ""
echo -e "${GREEN}Starting server at http://localhost:5000${NC}"
echo "Press Ctrl+C to stop"
echo "----------------------------------------"
npm run dev
