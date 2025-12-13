#!/bin/bash

echo "========================================"
echo "  Windows XP Portfolio Simulator"
echo "========================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_env_vars() {
    echo -e "${BLUE}Checking environment variables...${NC}"
    
    missing_vars=""
    
    if [ -z "$DATABASE_URL" ]; then
        missing_vars="$missing_vars DATABASE_URL"
    fi
    
    if [ -z "$JWT_SECRET" ]; then
        echo -e "${YELLOW}  Warning: JWT_SECRET not set. Sessions will reset on restart.${NC}"
        echo -e "${YELLOW}  Generate one with: openssl rand -hex 32${NC}"
    else
        echo -e "${GREEN}  JWT_SECRET is set.${NC}"
    fi
    
    if [ -z "$RESEND_API_KEY" ]; then
        echo -e "${YELLOW}  Note: RESEND_API_KEY not set. Contact form emails disabled.${NC}"
        echo -e "${YELLOW}  Get your API key from https://resend.com${NC}"
    else
        echo -e "${GREEN}  RESEND_API_KEY is set.${NC}"
        if [ -z "$RESEND_FROM_EMAIL" ]; then
            echo -e "${YELLOW}  Warning: RESEND_FROM_EMAIL not set.${NC}"
            echo -e "${YELLOW}  Set it to your verified domain email (e.g., contact@yourdomain.com)${NC}"
        else
            echo -e "${GREEN}  RESEND_FROM_EMAIL: $RESEND_FROM_EMAIL${NC}"
        fi
    fi
    
    if [ -n "$missing_vars" ]; then
        echo -e "${RED}  Missing required:$missing_vars${NC}"
    else
        echo -e "${GREEN}  Database configured.${NC}"
    fi
    echo ""
}

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
check_env_vars
install_dependencies
check_lfs_files
setup_database

echo ""
echo -e "${GREEN}Starting server at http://localhost:5000${NC}"
echo "Press Ctrl+C to stop"
echo "----------------------------------------"
npm run dev
